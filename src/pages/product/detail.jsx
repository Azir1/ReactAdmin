import React, { Component } from 'react';
import { Card, Icon, List, } from 'antd'
import LinkButton from '../../components/link-button';
import { reqProductCategory } from '../../api';

const Item = List.Item
class ProductDetail extends Component {
    state = {
        cName1: '',//父分类
        cName2: '',//子分类
    }
    async componentDidMount() {
        // 得到当前商品分类id
        const { pCategoryId, categoryId } = this.props.location.state
        if (pCategoryId === '0') { //
            const result = await reqProductCategory(categoryId)
            const cName1 = result.data.name
            this.setState({ cName1 })
        } else {
            /* 通过多个await的方式发送多个请求，后面的请求是在前一个请求成功
            返回之后才发送*/
            // const result1 = await reqProductCategory(pCategoryId)
            // const result2 = await reqProductCategory(categoryId)
            // const cName1 = result1.data.name
            // const cName2 = result2.data.name
            // this.setState({ cName1, cName2 })

            //一次性发送多个请求，只有都成功了，才正常处理
            const results = await Promise.all([reqProductCategory(pCategoryId),reqProductCategory(categoryId)]) 
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2,
            })
        }
    }
    render() {
        const title = (
            <span>
                {/* 编程式路由导航 */}
                <LinkButton onClick={() => this.props.history.goBack()} ><Icon type="arrow-left" style={{ fontSize: 24 }} /></LinkButton>
                <span style={{ fontSize: 22, marginLeft: 16 }}>商品详情</span>
            </span>
        )
        // 读取携带的state属性
        const { name, desc, price, imgs, detail, } = this.props.location.state
        const { cName1, cName2 } = this.state
        // const {name,desc,price,imgs,pCategoryId,detail,categoryId} = product
        return (
            <Card
                title={title}
                style={{ width: '100%', }}
            >
                <List className='product-detail'>
                    <Item>
                        <span className='left'>商品名称：</span>
                        <span className='right'>{name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述：</span>
                        <span className='right'>{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格：</span>
                        <span className='right'>{price}元</span>
                    </Item>
                    <Item>
                        <span className='left'>所属分类：</span>
                        <span className='right'>
                            <span>{cName1}</span>
                            {
                                cName2 ? <span><Icon type="swap-right" />{cName2}</span> : ''
                            }

                        </span>
                    </Item>
                    <Item>
                        <span className='left'>商品图片：</span>
                        <span className='right'>
                            {/* 重点在标签内写函数一定要写{} */}
                            {imgs.map((item, index) => {
                                return (
                                    <img key={index} src={item} alt="" />
                                )
                            })}
                        </span>
                    </Item>
                    <Item>
                        <span className='left'>商品详情：</span>
                        {/* 动态展示：dangerslySetInnerHtml属性差异，在react中写innerHtml */}
                        <span dangerouslySetInnerHTML={{ __html: detail }} />
                    </Item>
                </List>
            </Card>
        );
    }
}

export default ProductDetail;