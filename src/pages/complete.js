import React, { Component, Fragment } from 'react';
import { Card } from "antd";
import AddNewJob from '../components/AddNewJob';
import Jobs from '../components/jobs';

class JobsPage extends Component {

  render() {
    return (
      <Card 
        title={
        <Fragment>
          <span style={{ paddingLeft: "12px", fontSize: "16px" }}>COMPLETE</span>
        </Fragment>}
        >
          <Jobs jobType='complete' />
        <AddNewJob />
      </Card>
    );
  }
};

export default JobsPage;