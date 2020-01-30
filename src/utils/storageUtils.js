/*
进行本地local数据存储管理的工具模块
*/ 
// 引入store存储模块
import store from 'store'

const User_Key = 'user_key'
export default {
    //保存 user 
    saveUser(user){
        // localStorage.setItem(User_Key,JSON.stringify(user))
        store.set(User_Key,user)
    },
    //读取 user
    getUser(){
        // return JSON.parse(localStorage.getItem(User_Key)||'{}')
        return store.get(User_Key) || {}
    },
    //删除 user
    removerUser(){
        // localStorage.removeItem(User_Key)
        store.remove(User_Key)
    }
}