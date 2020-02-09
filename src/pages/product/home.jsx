
import React, { Component } from 'react';
import { Card, Select, Button, Input, Form, Icon, Table, message, } from 'antd'
import LinkButton from '../../components/link-button/index'
import { reqProducts, reqUpdateStatus, reqSearchProducts } from '../../api';
import { PAGE_SIZE } from '../../utils/constants';

const { Option } = Select
const Item = Form.Item
class ProductHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            loading: false,//表格数据加载
            total: 0,
            searchType: 'productName',
            searchName: '',

        };
    }
    // 异步获取商品列表 / 获取搜索列表
    getProducts = async (pageNum) => {
        this.pageNum = pageNum //保存当前的pageNum,后面更新上架/下架的时候可以看见
        const { searchName, searchType } = this.state
        let result
        this.setState({ loading: true })
        // 搜索商品
        if (searchName) {
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        this.setState({ loading: false })
        const { list, total } = result.data//从返回的数据中取值
        if (result.status === 0) {
            this.setState({
                products: list,
                total,
            })
        }
    }

    // 商品上架或下架
    updateStatus = async (productId, status) => {

        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }
    //  初始化表头,放在componentwillmount里面
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
                width: '20%',
                align: 'center',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                width: '50%',
            },
            {
                title: '价格',
                dataIndex: 'price',
                width: '10%',
                align: 'center',
                // 指定了对应的属性，注意render的回调函数一定要传入参数才能获取值
                render: (price) => <span>￥{price}</span>
            },
            {
                title: '状态',
                // dataIndex: 'status',
                width: '10%',
                align: 'center',
                render: (product) => {
                    const { _id, status } = product
                    return (

                        <span>
                            <Button
                                type='primary'
                                onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            {
                                status === 1 ? <div>在售</div> : <div>已下架</div>
                            }
                        </span>
                    )
                }
            },
            {
                title: '操作',
                // dataIndex: 'operate',dataIndex:列数据在数据项中对应的 key
                width: '10%',
                align: 'center',
                render: (product) => (
                    // 将product对象使用路由的state传递给目标组件
                    <span>
                        {/* 重点**:编程式路由导航，push（）可以回退到Home页面，replace（）不可以回退 */}

                        <LinkButton
                            onClick={() => this.props.history.push('/product/detail', product)}
                        >详情</LinkButton>
                        <div><LinkButton onClick={()=>this.props.history.push('/product/addupdate',product)} >修改</LinkButton></div>
                    </span>
                )
            },
        ];
    }
    UNSAFE_componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getProducts(1)
    }
    render() {
        const { products, loading, total, searchType, searchName } = this.state
        return (
            <Card
                title={
                    <Form layout="inline">
                        <Item>
                            <Select
                                // defaultValue='productName'
                                style={{ width: 110 }}
                                // 受控组件，onChange用state来接收参数
                                onChange={value => this.setState({ searchType: value })}
                                value={searchType}
                            >
                                <Option value='productName'>按名称搜索</Option>
                                <Option value='productDesc'>按描述搜索</Option>
                            </Select>
                        </Item>
                        <Item>
                            <Input
                                placeholder="关键字"
                                style={{ width: 150 }}
                                value={searchName}
                                // 受控组件自动收集，需要用onChange监听
                                onChange={event => this.setState({ searchName: event.target.value })}
                            />
                        </Item>
                        <Item>
                            {/* 搜索部分编写步骤，先写请求接口，再收集数据，在写请求函数 */}
                            <Button type='primary'
                                onClick={() => this.getProducts(1)}  //就要用一个匿名函数把参数1带过去啊
                            >搜索
                            </Button>
                        </Item>
                    </Form>
                }
                extra={
                    // 编程式路由跳转
                    <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')} ><Icon type='plus' />添加商品</Button>
                }
                style={{ width: '100%', height: '100%' }}>
                {/* 表格 */}
                <Table dataSource={products}
                    loading={loading}
                    columns={this.columns}
                    bordered
                    pagination={{ pageSize: PAGE_SIZE, total, onChange: (pageNum) => { this.getProducts(pageNum) } }}
                    rowKey='_id'
                />
            </Card>
        );
    }
}

export default ProductHome;