import React, { Component } from 'react';
import './index.css'
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，admin</span>
                    <a href="javascript:">退出</a>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>首页</div>
                    <div className='header-bottom-right'>
                        <span>2019-5-6- 10:20:56</span>
                        <img src="" alt="w"/>
                        <span>晴</span>
                    </div>


                </div>
            </div>
        );
    }
}

export default Header;