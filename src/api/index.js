/*
    **能根据接口文档定义接口请求
    包含应用中所有接口请求函数的模块
    每个函数的返回值都是promise
    tips：
    1、export导出需使用{} 将对应的模块导出，
    同时在使用是import导入时需要使用{}来引入相应的模块
    2、
    export default导出时，不用使用{} 进行导出对应的模块、函数、文件等。但是只能导出一个。
    同时import 导入时也不用{} 实现导入。
*/ 
import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

// 登录接口
// export function reqLogin(username,password){
//     return ajax('/login',{username,password},'POST')
// }
const BASE = ''
// 推荐箭头函数来写
export const reqLogin = (username,password)=>ajax(BASE+'/login',{username,password},'POST')

// 添加用户
export const reqAddUser = (user)=>ajax(BASE+'/manage/user/add',user,'POST')

// jsonp请求的接口请求函数
/*jsonp解决ajax跨域的原理：
  1、jsonp只能解决GET类型的ajax请求跨域问题
  2、jsonp不是ajax请求，而是一般的get   请求
  3、基本原理：
    浏览器端：动态生成<script>来请求后台接口（src就是接口的url）

  */ 
// tip：所有的接口请求函数都要返回一个promise对象
export function reqWeather(city){
    return new Promise((resolve,reject)=>{
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url,{},(err,data)=>{
            if (!err && data.status==='success') {
                // 可以解构获取需要的天气数据
                const {dayPictureUrl,weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl,weather})
            }else{
                // 如果失败了
                message.error('获取天气信息失败')
            }
        })

    })
}
// reqWeather('南京')

//获取一级或二级分类列表
export const reqCategory= (parentId)=> ajax(BASE+'/manage/category/list',{parentId})

// 添加分类
export const reqAddCategory = (parentId,categoryName)=> ajax(BASE+'/manage/category/add',{parentId,categoryName},'POST')

// 更新品类名称,需要一个categoryId,categoryName的对象
export const reqUpdateCategory = ({categoryId,categoryName})=>ajax(BASE+'/manage/category/update',{categoryId,categoryName},'POST')










