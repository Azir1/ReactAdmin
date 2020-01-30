/*能发送异步ajax请求的函数模块
封装ajax库
查文档
函数的返回值return是promise对象
url地址，data不一定有对象，所以指定{}默认值，GET是最常用的请求方式
url请求地址，data请求数据类型，type请求方式
因为params是添加到url的请求字符串中的，用于get请求。 
而data是添加到请求体（body）中的， 用于post请求。

1、优化：统一处理请求异常
    在外层包一个自己创建的promise对象
    请求出错时不reject（error），而是显示错误提示
2、异步得到的不想是response 而是response.data
在请求成功resolve时：resolve（response.data）
*/ 
import axios from 'axios'
import {message} from 'antd'

export default function ajax(url,data={},type='GET'){
    return new Promise((resolve,reject)=>{
        let promise
        // 1、执行异步ajax请求
        if (type==='GET') { //发GET请求
            promise = axios.get(url,{ //配置对象
                params:{
                    ID: data  //指定请求参数
                }
            })
        }else{             //发post请求
            promise = axios.post(url,data)
        }
        // 2、成功，调用resolve  
        promise.then(response=>{
            resolve(response.data)
        // 3、失败，不调用reject，而是提示异常信息
        }).catch(error=>{
            message.error(`请求出错了${error.message}`)
        })
        
    })

}

// 请求登录接口
// ajax('/login',{username:'Tom',password:'1234'},'POST').then()
// 添加用户接口
// ajax('/manage/user/add',{username:'Andy',password:'111',phone:'1835556123'},'POST').then()