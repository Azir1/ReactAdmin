import React, { Component } from 'react';
import { Card,Button,Icon,Table } from 'antd'
import LinkButton from '../../components/link-button/index'
import './category.less'
import {reqCategory} from '../../api/index'
class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
          categorys:[]
        };
    }
    // 定义初始化表头函数
    initCol = ()=>{
      this.columns = [
        {
          title: '分类名称',
          dataIndex: 'name',
        },
        {
          title: '操作',
          width:300,
          render: () => ( //返回需要显示的界面标签
              <span>
                  <LinkButton style={{marginRight:'20px'}}>修改分类</LinkButton>  
                  <LinkButton>查看子分类</LinkButton>
              </span>
          )   
        },
      ];
    }

    // 异步请求一级分类
    getCategory = async()=>{
      const result = await reqCategory('0')
      console.log(result);
      const categorys = result.data
      this.setState({
        categorys
      })
    }
    // 异步ajax请求一级分类列表数据
    componentDidMount(){
      this.getCategory()
    }
    // 初始化表头
    componentWillMount(){
      this.initCol()
    }
    render() { 
        const title = '一级分类列表'
        const extra = <Button type='primary'><Icon type="plus" />添加</Button>
        const {categorys} = this.state
        return (
            <div>
                <Card title={title} extra={extra}>
                <Table 
                    dataSource={categorys} 
                    columns={this.columns} 
                    bordered
                    rowKey='_id'/>
                </Card>
            </div>
        );
    }
}

export default Category;
