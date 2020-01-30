import React, { Component } from 'react'
import { Form, Icon, Input, Button, message } from 'antd'
import './login.css'
import log from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import stoerageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom'

// const Item =Form.Item   const不能写在import之前

// 1、前台表单验证  2、收集表单输入数据   AntD都能做

// 登录的路由组件
class Login extends Component {
    
    // 提交表单请求登录,事件回调函数要有event
    handleSubmit=(event)=>{
        // 阻止事件的默认行为
        event.preventDefault()
        // 得到form对象,对所有的表单字段进行验证
        const form = this.props.form
        this.props.form.validateFields(async(err, values) => {
            // 校验成功
            if (!err) {
            //   console.log('提交登录的ajax请求 ', values);
                const {username,password} = values
                const result = await reqLogin(username,password)
                // console.log('请求成功',response.data)
                // const result = response.data  //{status：0，data：user}{status：1，msg：‘错误提示信息’}
                if (result.status === 0) { //登录成功
                    // 提示登录成功
                    message.success('登录成功')
                    // 保存user
                    const user = result.data
                    memoryUtils.user = user  //保存在内存中
                    stoerageUtils.saveUser(user) //保存到localStorage中
                    // 跳转到后台管理界面,不用push，push可以回退，登录界面没必要回退，所以用replace
                    this.props.history.replace('/')
                    // const uesr = result.data
                }else{//登录失败,提示错误信息
                    message.error(result.msg)
                }

            }else{
                console.log('校验失败');
            }
        });
        // 获取表单项的输入数据
        const value = form.getFieldsValue()
        console.log(value);
       
    }
    // 对密码进行自定义验证，比较麻烦，建议官方给定的方法
    validatePwd=(rule,value,callback)=>{
        // callback() 验证通过
        // callback('xxxxxxxxx') 验证失败，并指定提示的文本
        if (!value) {
            callback('密码不能为空')
        }else if(value.length<4){
            callback('密码长度必须大于4位')
        }else if(value.length>12){
            callback('密码长度不能大于12位')
        }else if(!/^[a-zA-Z0-9]+$/.test(value)){
            callback('密码必须是英文、数字、下划线组成')
        }else{
            callback() //验证通过
        }


    }
    render() {
        // 如果用户已经登录，则自动跳转admin界面
        const user = memoryUtils.user
        if (user&&user._id) {
            return <Redirect to='/' />
        }
        // 子组件得到父组件的form对象
        const form = this.props.form
        const { getFieldDecorator } = form
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={log} alt=""/>
                    <h1>后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {/* 用getFieldDecorator 来包装Input
                                username--标识名称 {输入规则}
                            */}
                           {
                               getFieldDecorator('username',{
                                // 声明式验证：直接用别人定义好的规则进行验证
                                initialValue:'admin', //默认输入值，可以不写
                                rules: [{ required: true, whitespace:true,message: '用户名必须输入' },
                                        { min:4, message: '用户名至少4位' },
                                        { max:12, message: '用户名最多12位' },
                                        { pattern:/^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字、下划线组成' }],
                                
                               })(
                                <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名"
                                />
                               )
                           }
                        </Form.Item>
                        <Form.Item>
                            {
                               getFieldDecorator('password',{ 
                                //    validator	验证器
                                    rules:[
                                        {validator:this.validatePwd}
                                    ]
                               })(
                                <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                                />
                               )
                            }
                        </Form.Item>
                        <Form.Item>
                        {/* <a className="login-form-forgot" href="">
                            Forgot password
                        </a> */}
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                        {/* Or <a href="">register now!</a> */}
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

// export default Login
/*
1、高阶函数
    1)一类特别的函数
        a 接受函数类型的参数
        b 返回值是函数
    2）常见
        a 定时器：setTimeou（）/setInterval（）
        *b Promise：Promise（（）=>{}） then（value=>{},reason=>{}）
        *c 数组遍历相关的方法：forEach()/filter()/map()/reduce()/find()/findIndex()
        d 函数对象的bind（） fn.bind()
        e Form.create()()，包装一个组件生成新的组件 getFieldDecorator()()
    3）高阶函数更新动态，更加具有扩展性
2、高阶组件（其实也是高阶函数），只是他接收的是组件函数，返回的是一个新的组件函数
    1）本质是一个函数
    2）接收一个组件（被包装组件），返回一个新的组件（包装组件），包装组件会向被包装组件传入特定属性
    3）作用：扩展组件的功能

async和await
1、作用
    简化promise对象的使用：不用再使用.then（）来指定成功/失败的回调函数
    以同步编码方式（没有回调函数）实现异步流程
2、哪里用await
    在返回promise的表达式左侧写await：不想要promise，想要promise异步执行的成功的value数据
3、哪里用async
    在await所在函数（最近的）定义的左侧写async

包装From组件，生成一个新的组件Form（Login）
新组件Form（Login）会向Form组件传递一个强大对象属性：*form
*/
const WarpLogin = Form.create()(Login)
export default WarpLogin
