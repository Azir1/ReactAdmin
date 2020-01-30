// 根组件
import React, { Component } from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }

    render() {
        return (
            <BrowserRouter>
                <Switch> {/*只匹配其中一个*/}
                    <Route path='/login' component={Login}></Route>
                    <Route path='/' component={Admin}></Route>
                    
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;