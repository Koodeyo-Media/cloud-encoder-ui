import React, { Component } from 'react';
import { Table, Button } from "antd";
import axios from '../axios';
import moment from 'moment';
import JobsProfile from './JobProfile';

class Jobs extends Component {
  
  state = {
    jobs: [],
    loading: false,
    visible: false,
    profile: false,
    loadingOnDelete: false,
    record: {},
    selectedRowKeys: []
  };

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'TYPE',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'TITLE',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'STATE',
      dataIndex: 'state',
      key: 'state'
    },
    {
      title: 'CREATED AT',
      dataIndex: 'created_at',
      key: 'created_at'
    },
    {
      title: 'UPDATED AT',
      dataIndex: 'updated_at',
      key: 'updated_at'
    },
    {
      title: 'ATTEMPTS',
      dataIndex: 'attempts',
      key: 'attempts'
    }
  ];

  delete() {
    const { selectedRowKeys, jobs } = this.state;
    this.setState({ loadingOnDelete: true });
    axios.post('/jobs/delete', {
      jobs: selectedRowKeys.map((index) => {
        return jobs[index].id;
      })
    }).then(({ data }) => {
      this.setState({ loadingOnDelete: false });
    });
  }

  componentDidMount() {
    this.fetch();
  } 

  fetch = () => {
    this.setState({ loading: true });

    axios.get(`/jobs/${this.props.jobType}/0-100`).then(({ data }) => {
      this.setState({
        loading: false,
        jobs: data.map((val, i) => {
          return {
            ...val, key: i,
            title: val.data.title,
            created_at: moment(parseInt(val.created_at)).format('DD/MM/YYYY H:MM:s A'),
            updated_at: moment(parseInt(val.updated_at)).format('DD/MM/YYYY H:MM:s A'),
            attempts: `${val.attempts.made}(${val.attempts.remaining})`
          }
        })
      });
    }).catch(e => {
      this.setState({
        loading: false
      });
    });
  }

  onSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }

  render() {
    const { loading, selectedRowKeys, jobs } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this)
    };
    return (
      <>
      <Table
        dataSource={jobs}
        columns={this.columns}
        loading={loading}
        rowSelection={rowSelection}
        pagination={{
          total: jobs.length,
          defaultPageSize: 6
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              this.setState({ 
                profile: true, record
              });
            }, // click row
            onDoubleClick: event => {}, // double click row
            onContextMenu: event => {}, // right button click row
            onMouseEnter: event => {}, // mouse enter row
            onMouseLeave: event => {}, // mouse leave row
          };
        }}
      />
      <JobsProfile 
        visible={this.state.profile} 
        record={this.state.record} 
        destroyOnClose={true}
        onClose={() => {
          this.setState({ 
            profile: false,
            record: {}
          });
        }} />
      {selectedRowKeys.length > 0 && (
        <Button 
          loading={this.state.loadingOnDelete} 
          type="danger" 
          style={{ marginRight: '5px'}}
          onClick={this.delete.bind(this)}
        >Delete</Button>
      )}
      </>
    );
  }
};

export default Jobs;