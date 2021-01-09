import { Drawer, Divider, Col, Row, Progress, Button, Badge } from 'antd';
import React from 'react';
import axios from '../axios';

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper" style={{ marginBottom: '5px'}}>
    <div className="site-description-item-profile-p-label"><b>{title}</b></div>
    {content}
  </div>
);

class JobProfile extends React.Component {
  state = { visible: false, record: {}, progress: 0 };

  componentDidMount() {
    this.timer = setInterval(() => {
      if(this.props.record.state === 'active') {
        this.fetch();
      }
    }, 2000);
  }

  componentDidUpdate() {
    if(!this.props.record.state) {
      //clearInterval(this.timer);
    }
  }

  fetch = () => {
    axios.get(`/jobs/${this.props.record.id}`).then(({ data }) => {
      let { progress, state } = data;
      if(state !== 'active') {
        clearInterval(this.timer);
      }
      this.setState({ progress });
    });
  }

  render() {
    return (
      <>
        <Drawer
          width={640}
          placement="right"
          closable={false}
          onClose={this.props.onClose}
          destroyOnClose
          visible={this.props.visible}
        >
          <h2 className="site-description-item-profile-p" style={{ marginBottom: 24 }}>
            {this.props.record.title} {this.props.record.state === 'active' && (<Badge status="processing" />)}
          </h2>
          <h3 className="site-description-item-profile-p">{this.props.record.type}</h3>
          <Row>
            <Col span={12}>
              <DescriptionItem title="ID" content={this.props.record.id} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="STATE" content={this.props.record.state} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="CREATED AT" content={this.props.record.created_at} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="UPDATED AT" content={this.props.record.updated_at} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="ATTEMPTS" content={this.props.record.attempts} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title="DATA"
                content={JSON.stringify(this.props.record.data)}
              />
            </Col>
          </Row>
          {this.props.record.state === 'active' && (
            <Row>
              <Col span={24}>
                <DescriptionItem 
                  title="PROGRESS" 
                  content={<Progress percent={this.state.progress} status="active" />} 
                />
              </Col>
            </Row>
          )}
          {this.props.record.state === 'failed' && (
            <Row>
              <Col span={24}>
                <DescriptionItem 
                  title="ERROR" 
                  content={this.props.record.error} 
                />
              </Col>
            </Row>
          )}
          <Divider />
          <div
            style={{
              textAlign: 'right',
            }}
            >
            {this.props.record.state === 'active' && (
              <Button style={{ marginRight: 8 }}>Cancel</Button>
            )}
            {this.props.record.state === 'failed' && (
              <Button loading={false} type="primary" style={{ marginRight: 8 }}>Retry</Button>
            )}
            <Button loading={false} type="danger">Delete</Button>
          </div>
        </Drawer>
      </>
    );
  }
}

export default JobProfile;