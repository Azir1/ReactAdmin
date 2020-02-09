/*搭建商品管理页面步骤：
    1、分析页面，搭建子路由(先创建子组件，然后注册路由)，详情detail，修改addupdate，新增add
    2、静态布局
*/
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'

import ProductHome from './home'
import ProductDetail from './detail'
import ProductAddUpdate from './add-update'
import './product.less'

class Product extends Component {

    render() {
        return (
            <Switch>
                {/* exact严格匹配，否则product内容会显示在其他路由上 */}
                <Route path='/product' exact component={ProductHome} />  
                <Route path='/product/detail' component={ProductDetail} />
                <Route path='/product/addupdate' component={ProductAddUpdate} />
            </Switch>
        )
    }
}

export default Product;