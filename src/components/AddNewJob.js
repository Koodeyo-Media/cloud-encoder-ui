import React, { Fragment} from 'react';
import { 
  Drawer, Form, Button, Col, Row, Input, 
  Select, message, Modal, List, Card,
  Menu, Dropdown, Checkbox
} from 'antd';
import { PlusOutlined, DeleteFilled } from '@ant-design/icons';
import axios from '../axios';
import uuid from 'uuid';
const { Option } = Select;

export default class AddNewJobDrawer extends React.Component {
  state = { 
    visible: false,
    loading: false,
    videoFile: null,
    posterFile: null,
    inputOptsModal: false,
    cdnOptsModal: false,
    sizes: ['144', '240', '360','480', '720', '1080', '1440', '2160'],
    input: [],
    output: [],
    cdn: {},
    data: {
      pipeline: 'Encoder'
    }
  };

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
      loading: false
    });
  };

  onSubmit = () => {
    let { input, output, cdn, data } = this.state;
    var formData = new FormData();

    input = input.map((media) => {
      if(media.file) {
        let inputAsset = uuid.v4();
        formData.append(inputAsset, media.file);
        media.inputAsset = inputAsset;
        delete media.file;
      }
      return media;
    });
    
    formData.append('cdn', JSON.stringify(cdn));
    formData.append('input', JSON.stringify(input));
    formData.append('output', JSON.stringify(output));

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        formData.append(key, data[key]); 
      }
    }

    axios.post('/jobs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(({ data }) => {
      message.success('Job added successfully');
      this.onClose();
    }).catch((e) => {
      this.setState({
        loading: false
      });
      message.error('Failed to add Job');
    })
  }

  onChange(e) {
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value
      }
    });
  }
  
  addOutputOption(type, title, opts = {}) {
    let { output } = this.state;
    output.push({
      type, title, 
      ...opts
    });
    this.setState({ output });
  }

  editOutPutOption(index, opt, value) {
    let { output } = this.state;
    output[index][opt] = value;
    this.setState({ output });
  }

  editInputOption(index, opt, value) {
    let { input } = this.state;
    input[index][opt] = value;
    this.setState({ input });
  }
  
  addInput(data) {
    let { input } = this.state;
    input.push(data);
    this.setState({ input });
  }

  editCDNOption(key, value) {
    let { cdn } = this.state;
    cdn[key] = value;
    this.setState({ cdn });
  }

  render() {
    const { visible, loading,  cdnOptsModal } = this.state;
    return (
      <>
        <Button type="primary" onClick={this.showDrawer}>
          <PlusOutlined /> Add
        </Button>
        <Drawer
          title="New Job"
          width={720}
          onClose={this.onClose}
          visible={visible}
          destroyOnClose={false}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="title"
                  label="Title"
                >
                  <Input placeholder="Please enter title" onChange={this.onChange.bind(this)} name="title"/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Pipeline">
                  <Select 
                    placeholder="Pipeline"
                    defaultValue="Encoder"
                    onChange={(val) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          pipeline: val
                        }
                      });
                    }} 
                  >
                  {['Encoder', 'Packager'].map((option, i) => (
                    <Option value={option} key={i}>{option}</Option>
                  ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Input"
                >
                  <Row>
                    <Col>
                      <input 
                        type="file" 
                        ref="file" 
                        style={{ display: 'none'}} 
                        onChange={(e) => {
                          let file = e.target.files[0];
                          this.addInput({ 
                            title: file.name,
                            file,
                            media_type: file.type.split('/')[0]
                          });
                        }}
                      />

                      <Button onClick={() => this.refs.file.click()}>Local File</Button>
                    </Col>
                    <Col style={{ marginRight: '5px', marginLeft: '5px'}}>
                      <Button onClick={() => this.addInput({ 
                          title: 'URL SOURCE',
                          urlInput: true  
                        })}>URL</Button>
                    </Col>
                    <Col>
                      <Button onClick={() => this.addInput({ 
                          title: 'S3 SOURCE',
                          s3: true  
                        })}>S3</Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="CDN settings"
                >
                  <Modal 
                    title="Amazon S3 settings" 
                    visible={cdnOptsModal} 
                    onOk={() => {
                      this.setState({ cdnOptsModal: false });
                    }} 
                    onCancel={() => {
                      this.setState({ 
                        cdnOptsModal: false
                      });
                    }}
                  >
                    <Form.Item>
                      <Input placeholder="Access Key" onChange={({ target: { value }}) => this.editCDNOption('accessKey', value)} />
                    </Form.Item>
                    <Form.Item>
                      <Input placeholder="Secret Key" onChange={({ target: { value }}) => this.editCDNOption('secretKey', value)}/>
                    </Form.Item>
                    <Form.Item>
                      <Input placeholder="Bucket" onChange={({ target: { value }}) => this.editCDNOption('bucket', value)} />
                    </Form.Item>
                    <Form.Item>
                      <Input placeholder="URL for S3 compatible services" onChange={({ target: { value }}) => this.editCDNOption('endpoint', value)}/>
                    </Form.Item>
                  </Modal>
                  <Select 
                    defaultValue="select cdn" 
                    name="type" 
                    onChange={(val) => {
                      if(val !=="select cdn") {
                        this.setState({ cdnOptsModal: true });
                      }
                    }} 
                  >
                    {['select cdn', 'Amazon S3'].map((option, i) => (
                      <Option value={option} key={i}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Webhook">
                  <Input placeholder="/api/webhook" onChange={this.onChange.bind(this)} name="webhook"/>
                </Form.Item>
              </Col>
            </Row>
            <List
              style={{ marginTop: '10px'}}
              locale={{ emptyText: " " }}
              grid={{
                gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 2, xxl: 3,
              }}
              dataSource={this.state.input}
              renderItem={(item, index) => (
                <List.Item>
                  <Card
                    title={
                    <Fragment>
                      <span style={{ paddingLeft: "12px", fontSize: "16px" }}>{item.title}</span>
                      <a href="##" 
                        onClick={() => {
                          let input = this.state.input;
                          input.splice(index, 1);
                          this.setState({ input });
                        }} 
                        style={{ float: 'right'}}
                      >
                        <DeleteFilled />
                      </a>
                    </Fragment>}
                  >
                    <>
                      {(item.urlInput || item.s3) && (
                        <Form.Item>
                          <Input placeholder={item.s3 ? 'Asset' : 'URL'} onChange={({ target: { value }}) => this.editInputOption(index, 'inputAsset', value)} />
                        </Form.Item>
                      )}
                      <Form.Item>
                        <Select 
                          placeholder="Type" 
                          defaultValue={item.media_type}
                          onChange={(val) => this.editInputOption(index, 'media_type', val)} 
                        >
                          {['video', 'audio', 'text', 'image'].map((option, i) => (
                            <Option value={option} key={i}>{option}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item>
                        <Select 
                          placeholder="Language"
                          onChange={(val) => this.editInputOption(index, 'language', val)}  
                        >
                          {['English'].map((option, i) => (
                            <Option value={option} key={i}>{option}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item>
                        <Select 
                          placeholder="DRM Label"
                          onChange={(val) => this.editInputOption(index, 'drm_label', val)} 
                        >
                          {['auto', 'AUDIO', 'SD', 'HD'].map((option, i) => (
                            <Option value={option} key={i}>{option}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </>
                  </Card>
                </List.Item>
              )}
            />
            <Row gutter={16}>
              <Col span={12}>
                <Dropdown overlay={(
                <Menu>
                  <Menu.Item key="0" onClick={() => this.addOutputOption('videoEncoding', 'Video Encoding')}>
                    <a href="##">Video Encoding</a>
                  </Menu.Item>
                  <Menu.Item key="1" 
                    onClick={() => this.addOutputOption('hls&dash', 'HTTP Streaming', {
                      streamingMode: ['VOD'],
                      manifestFormat: ['DASH']
                    })
                  }>
                    <a href="##">HLS & DASH</a>
                  </Menu.Item>
                  <Menu.Item key="2" onClick={() => this.addOutputOption('thumbnails', 'Thumbnails')}>
                    <a href="##">Thumbnails</a>
                  </Menu.Item>
                  <Menu.Item key="3" onClick={() => this.addOutputOption('gif', 'GIF')}>
                    <a href="##">GIF</a>
                  </Menu.Item>
                </Menu>
                )} trigger={['click']}>
                  <Button type="primary" icon={<PlusOutlined />} size="large">Output</Button>
                </Dropdown>
              </Col>
            </Row>
          </Form>
          <List
            style={{ marginTop: '10px'}}
            locale={{ emptyText: " " }}
            grid={{
              gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 2, xxl: 3,
            }}
            dataSource={this.state.output}
            renderItem={(item, index) => (
              <List.Item>
                <Card
                  title={
                  <Fragment>
                    <span style={{ paddingLeft: "12px", fontSize: "16px" }}>{item.title}</span>
                    <a href="##" 
                      onClick={() => {
                        let output = this.state.output;
                        output.splice(index, 1);
                        this.setState({ output });
                      }} 
                      style={{ float: 'right'}}
                    >
                      <DeleteFilled />
                    </a>
                  </Fragment>}
                >
                <Form layout="vertical" hideRequiredMark>
                  {['hls&dash', 'videoEncoding'].indexOf(item.type) >= 0 && (
                    <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item>
                        <Select 
                          placeholder="Codec" 
                          onChange={(val) => this.editOutPutOption(index, 'codec', val)} 
                        >
                          {['libx264', 'libx265', 'libvpx-vp9'].map((option, i) => (
                            <Option value={option} key={i}>{option}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item>
                        <Select 
                          mode='multiple'
                          onChange={(val) => this.editOutPutOption(index, 'size', val)} 
                          placeholder="Size"
                        >
                          {this.state.sizes.map((option, i) => (
                            <Option key={i} value={option}>{option}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    </Row>  
                  )}
                {item.type === 'hls&dash' && (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item>
                        <Checkbox.Group 
                          options={['LIVE', 'VOD']} 
                          value={item.streamingMode} 
                          onChange={(val) => this.editOutPutOption(index, 'streamingMode', val)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item>
                        <Checkbox.Group 
                          options={['DASH', 'HLS']} 
                          value={item.manifestFormat} 
                          onChange={(val) => this.editOutPutOption(index, 'manifestFormat', val)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                )}
                {item.type === 'thumbnails' && (
                  <>
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item>
                        <Select 
                          mode='multiple'
                          onChange={(val) => this.editOutPutOption(index, 'count', val)} 
                          placeholder="Number of thumbnails"
                        >
                          {[1].map((option, i) => (
                            <Option key={i} value={option}>{option}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item>
                        <Input placeholder="Width" onChange={({ target: { value }}) => this.editOutPutOption(index, 'width', value)} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item>
                        <Input placeholder="Height" onChange={({ target: { value }}) => this.editOutPutOption(index, 'height', value)} />
                      </Form.Item>
                    </Col>
                  </Row>
                  </>
                )}
                {item.type === 'gif' && (
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item>
                        <Input placeholder="Width" onChange={({ target: { value }}) => this.editOutPutOption(index, 'width', value)} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item>
                        <Input placeholder="Offset in second" onChange={({ target: { value }}) => this.editOutPutOption(index, 'offset', value)} />
                      </Form.Item>
                    </Col>
                  </Row>
                )}
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item>
                      <Input placeholder={item.type === 'hls&dash' ? 'master' : 'output'} onChange={({ target: { value }}) => this.editOutPutOption(index, 'outputAsset', value)} />
                    </Form.Item>
                  </Col>
                </Row>
                </Form>
                </Card>
              </List.Item>
            )}
          />
          <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button loading={loading} onClick={this.onSubmit} type="primary">
                Submit
              </Button>
            </div>
        </Drawer>
      </>
    );
  }
}