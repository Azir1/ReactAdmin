// 入口js
import React from 'react'
import ReactDom from 'react-dom'
import App from './App'
// 充值reset样式在index.js中引入
import './index.css'

// jsx 遇到“<”当做html解析  遇到“{”当做js解析

import storageUtils from './utils/storageUtils'
import memortUtils from './utils/memoryUtils'

// 读取local中保存user，保存到内存中
const user = storageUtils.getUser()
memortUtils.user = user

ReactDom.render(
    <App />,
    document.getElementById('root')
)
// regusterServiceWorker()



