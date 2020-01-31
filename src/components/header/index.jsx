import React, { Component } from 'react';
import './index.css'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import { reqWeather } from '../../api';
import { withRouter } from 'react-router-dom';
import menuList from '../../config/menuConfig';
import { Modal } from 'antd';
import storageUtils from '../../utils/storageUtils';
import LinkButton from '../link-button';

class Header extends Component {
    state = { 
            currentTime:formateDate(Date.now()),
            dayPictureUrl:'',
            weather:''
         }

    // 启动循环，每隔一秒更新一次时间
    getSysTime = ()=>{
        this.intervalId = setInterval(() => {
        // 储存在组件的this中
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        }, 1000);
    }

    getWeather = async()=>{
        const {dayPictureUrl,weather} = await reqWeather('南京')
        this.setState({dayPictureUrl,weather})
    }

    // 获取标题
    getTitle = (path)=>{
        let title
        menuList.forEach((item)=>{
            if (item.key===path) {
                title = item.title
            }else if(item.children){
                const cItem = item.children.find(cItem=>cItem.key === path)    
                            // find()返回通过测试的数组的第一个元素的值                
                    if (cItem) {
                        title = cItem.title
                    }
            }
        })  
        return title      
    }
    // 退出登录
    logout = ()=>{
        const { confirm } = Modal
        confirm({
            title: '确定要退出吗？',
            onOk:()=> {
                // 删除内存、浏览器缓存登录数据
                storageUtils.removerUser()
                memoryUtils.user = {}
                // 跳转到登录界面
                this.props.history.replace('/login')
            },
        });
    }
    // 第一次render后执行，一般在此执行异步操作，发ajax请求，启动定时器
    componentDidMount(){
        this.getSysTime()
        this.getWeather()
    }
    componentWillUnmount(){
        clearInterval(this.intervalId)
    }
    render() {
        // 得到当前用户名
        const user = memoryUtils.user
        const {currentTime,dayPictureUrl,weather} = this.state
        const path = this.props.location.pathname
        const title = this.getTitle(path)        
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{user.username}</span>
                    <LinkButton onClick = {this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter (Header);