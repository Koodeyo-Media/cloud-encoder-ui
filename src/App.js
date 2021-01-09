import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import { Layout, Menu } from 'antd';
import { createBrowserHistory } from 'history';
import CompleteJobs from './pages/complete';
import ActiveJobs from './pages/active';
import InactiveJobs from './pages/inactive';
import FailedJobs from './pages/failed';
import DelayedJobs from './pages/delayed';
import Dashboard from './pages/Dashboard';
import "./css/App.css";
import { 
    FieldTimeOutlined, DashboardOutlined, 
    FileDoneOutlined, ClockCircleOutlined, 
    CloseCircleOutlined, SyncOutlined
 } from '@ant-design/icons';
const { Sider, Content, Footer } = Layout;

class App extends Component {
    fullTitle = "Cloud Encoder";
    shortTitle = "CE";

    state = {
        collapsed: false,
        title: this.fullTitle,
        pathname: "/"
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
            title: this.state.collapsed ? this.fullTitle : this.shortTitle,
        });
    }

    render() {
        return (
            <Router>
                <Layout style={{ minHeight: "100vh" }}>
                    <Sider
                        breakpoint="lg"
                        collapsedWidth={this.isMobile ? 0 : 80}
                        trigger={this.isMobile && undefined}
                        width={200}
                        collapsible
                        collapsed={this.state.collapsed}
                        onCollapse={this.toggle}
                        style={{
                            zIndex: 2,
                            overflow: 'auto',
                            height: '100vh',
                            position: 'fixed',
                            left: 0,
                        }}
                        >

                        <div className="logo"><h1>{this.state.title}</h1></div>

                        <Menu theme="dark" mode="inline"
                            defaultSelectedKeys={[createBrowserHistory().location.pathname]}
                        >
                            <Menu.Item key="/">
                                <Link to="/">
                                    <DashboardOutlined />
                                    <span>Dashboard</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/inactive">
                                <Link to="/inactive">
                                    <ClockCircleOutlined />
                                    <span>Queued</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/active">
                                <Link to="/active">
                                    <SyncOutlined />
                                    <span>Active</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/failed">
                                <Link to="/failed">
                                    <CloseCircleOutlined />
                                    <span>Failed</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/complete">
                                <Link to="/complete">
                                    <FileDoneOutlined />
                                    <span>Complete</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/delayed">
                                <Link to="/delayed">
                                    <FieldTimeOutlined />
                                    <span>Delayed</span>
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout style={{ marginLeft: this.state.collapsed ? 80 : 200 }}>
                        <Content>
                            <Route exact path="/" component={Dashboard} />
                            <Route path="/complete" component={CompleteJobs} />
                            <Route path="/inactive" component={InactiveJobs} />
                            <Route path="/failed" component={FailedJobs} />
                            <Route path="/active" component={ActiveJobs} />
                            <Route path="/delayed" component={DelayedJobs} />
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>&copy; {new Date().getFullYear()} Koodeyo, Inc.</Footer>
                    </Layout>
                </Layout>
            </Router>
        );
    }

}

export default App;
