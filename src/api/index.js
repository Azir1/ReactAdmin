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

// 登录接口
// export function reqLogin(username,password){
//     return ajax('/login',{username,password},'POST')
// }
const BASE = ''
// 推荐箭头函数来写
export const reqLogin = (username,password)=>ajax(BASE+'/login',{username,password},'POST')

// 添加用户
export const reqAddUser = (user)=>ajax(BASE+'/manage/user/add',user,'POST')