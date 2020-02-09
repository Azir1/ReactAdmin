import React, { Component } from 'react';
import memoryUtils from '../../utils/memoryUtils'
import { Redirect, Route, Switch } from 'react-router-dom';
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
// 引入二级路由组件
import Home from '../home/home'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Category from '../category/category'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

// 引入AntD组件
import { Layout } from 'antd';
const { Footer, Sider, Content } = Layout;

// 后台管理的组件
class Admin extends Component {
    render() {
        const user = memoryUtils.user
        // 如果内存中没有user==>当前没有登录
        if (!user || !user._id) {
            // 自动跳转登录界面(在render中)
            return <Redirect to='/login' />
        }

        return (
            <Layout style={{ height: '100%' }}>
                <Sider><LeftNav /></Sider>
                <Layout>
                    <Header>header</Header>
                    <Content style={{ backgroundColor: '#fff', margin: '20px' }}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            <Route path='/charts/bar' component={Bar} />
                            {/* 刷新显示home页 */}
                            <Redirect to='/home' />
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#cccc' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>

        );
    }
}

export default Admin;