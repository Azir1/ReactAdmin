import React, { Component } from 'react';
import './index.css'
import logo from '../../assets/images/logo.png'
import { Link, withRouter } from 'react-router-dom'
// 引入AntD导航菜单
import { Menu, Icon } from 'antd';
import menuList from '../../config/menuConfig'

const { SubMenu } = Menu;
class LeftNav extends Component {

    // 根据menu数组生成对应的标签数组
    // 使用map+递归调用
    /*
    reduce()累计累加 + 递归调用
    getMenuNodes = (menuList)=>{
        return menuList.reduce(((pre,item)=>{
            if (!item.children) {
                // 向pre中添加<Menu.Item> 
                pre.push((
                    <Menu.Item key={item.key}>
                    <Link to ={item.key} className='underLine'>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                    ))
            }else{
                // 向pre中添加</SubMenu>
                pre.push((
                    <SubMenu
                    key={item.key}
                    title={
                        <span>
                        <Icon type={item.icon} />
                        <span> {item.title} </span>
                        </span>
                        }
                        >
                        {this.getMenuNodes(item.children)}
                        
                        </SubMenu>
                        ))
                    }
                    return pre
                },[]))
            }
    */
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.map(item => {
            // 取path，判断是否有子item打开
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key} className='underLine'>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                // find()查找,查找一个与当前请求路径匹配的子item
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)

                // 如果存在，说明当前item的子列表需要打开
                if (cItem) {
                    this.openKey = item.key

                }
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span> {item.title} </span>
                            </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}

                    </SubMenu>
                )
            }
        })
    }
    // 第一次render之前,为第一个render（）准备数据（必须同步的）
    UNSAFE_componentWillMount() {
        // 先传值
        this.menuNodes = this.getMenuNodes(menuList)
    }
    render() {
        // 得到当前请求的路由路径，路由三个重要组件 history（中有一些方法控制
        // 路由跳转），location，match
        const path = this.props.location.pathname
        // 得到需要打开菜单项的key
        const openKey = this.openKey
        return (
            <div className='left-nav'>
                <Link to='/' className='underLine'>
                    <header className='left-nav-header'>
                        <img src={logo} alt="" />
                        <h1>后台管理系统</h1>
                    </header>
                </Link>
                {/* 导航菜单 */}
                <div style={{ width: 200 }}>
                    <Menu
                        // 根据路由动态选中，比defaultSelectedKeys好用
                        selectedKeys={[path]}
                        defaultOpenKeys={[openKey]}
                        mode="inline"
                        theme="dark"
                    // inlineCollapsed={this.state.collapsed}
                    >
                        {/* <Menu.Item key="/home">
                            <Link to ='/home' className='underLine'>
                                <Icon type="pie-chart" />
                                <span>首页</span>
                            </Link>
                        </Menu.Item>
                    
                        <SubMenu
                            key="sub1"
                            title={
                            <span>
                                <Icon type="mail" />
                                <span>商品</span>
                            </span>
                            }
                        >
                            <Menu.Item key="/category">
                                <Link to='/category' className='underLine'>
                                    <Icon type="mail" />
                                    <span>品类管理</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/product">
                                <Link to='/product' className='underLine'>
                                    <Icon type="mail" />
                                    <span>商品管理</span>
                                </Link>       
                            </Menu.Item>
                            
                        </SubMenu>

                        <Menu.Item key="/user">
                            <Link to='/user' className='underLine'>
                                <Icon type="desktop" />
                                <span>用户管理</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/role">
                            <Link to='/role' className='underLine'>
                                <Icon type="inbox" />
                                <span>权限设置</span>
                            </Link>
                        </Menu.Item>

                        <SubMenu
                            key="sub2"
                            title={
                            <span>
                                <Icon type="appstore" />
                                <span>图标分析</span>
                            </span>
                            }
                        >
                            <Menu.Item key="/charts/bar">
                                <Link to='/charts/bar' className='underLine'>
                                    柱状图
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/charts/line">
                                <Link to='/charts/line' className='underLine'>
                                    折线图
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/charts/pie">
                                <Link to='/charts/pie' className='underLine'>
                                    饼状图
                                </Link>
                            </Menu.Item>                          
                        </SubMenu> */}
                        {
                            this.menuNodes
                            // this.getMenuNodes(menuList)
                        }
                    </Menu>
                </div>
            </div>
        );
    }
}
/*withRouter高阶组件（把一个非路由组件的组件，变成一个路由组件）
    包装非路由组件，返回一个新的组件
    新的组件向非路由组件传递三个属性match location history
*/
export default withRouter(LeftNav);