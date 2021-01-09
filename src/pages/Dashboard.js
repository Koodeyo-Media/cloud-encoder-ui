import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import axios from '../axios';
import { bytesToSize } from "../Util";

function getOption(name) {
  return {
    title: {
      text: name
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '2%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: []
      }
    ],
    yAxis: [
      {
        type: 'value',
        max: 100,
      }
    ],
    series: [
      {
        name: name,
        type: 'line',
        areaStyle: { normal: {} },
        data: []
      },
    ]
  };
}

class Dashboard extends Component {
  count = 0;

  state = {
    cpuOption: getOption('CPU Usage'),
    memOption: getOption('Memory Usage'),
    serverInfo: []
  };

  componentDidMount() {
    this.fetch();
    this.timer = setInterval(this.fetch, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  fetch = () => {
    this.setState({ loading: true });
    axios.get('/server').then(({ data }) => {
      let serverInfo = [
        { name: 'OS', value: data.os.arch + "_" + data.os.platform + "_" + data.os.release },
        { name: "CPU", value: data.cpu.num + " x " + data.cpu.model },
        { name: "Memory", value: bytesToSize(data.mem.totle) }
      ];

      let now = new Date();
      let axisData = now.toLocaleTimeString().replace(/^\D*/, '');

      let cpuOption = { ...this.state.cpuOption };
      let memOption = { ...this.state.memOption };

      if (this.count++ > 30) {
        cpuOption.xAxis[0].data.shift();
        cpuOption.series[0].data.shift();

        memOption.xAxis[0].data.shift();
        memOption.series[0].data.shift();
      }

      cpuOption.uptime = now;
      cpuOption.xAxis[0].data.push(axisData);
      cpuOption.series[0].data.push(data.cpu.load);

      memOption.uptime = now;
      memOption.xAxis[0].data.push(axisData);
      memOption.series[0].data.push((100 - 100 * data.mem.free / data.mem.totle).toFixed(2));

      this.setState({ cpuOption, memOption, serverInfo });
    }).catch(e => {});
  }

  render() {

    return (
      <Row style={{ margin: '24px 16px', minHeight: 280 }}>
        <Col span={12} style={{ padding: "0 12px", marginTop: "16px" }}>
          <Card>
            <ReactEchartsCore
              echarts={echarts}
              ref='echarts_react'
              option={this.state.cpuOption}
              style={{ height: '300px', width: '100%' }}
            />
          </Card>
        </Col>
        <Col span={12} style={{ padding: "0 12px", marginTop: "16px" }}>
          <Card>
            <ReactEchartsCore
              echarts={echarts}
              ref='echarts_react'
              option={this.state.memOption}
              style={{ height: '300px', width: '100%' }}
            />
          </Card>
        </Col>
        <Col span={12} style={{ padding: "0 12px", marginTop: "16px" }}>
          <Card>
            {this.state.serverInfo.map((spec, i) => (
              <h4 key={i}><b>{spec.name}:</b> {spec.value}</h4>
            ))}
          </Card>
        </Col>
      </Row>

    );
  }

}

export default Dashboard;
