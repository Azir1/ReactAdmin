import React, { Component } from 'react';
import { Card, Form, Input, Cascader, Button, Icon } from 'antd'
import LinkButton from '../../components/link-button';
import { reqCategory } from '../../api';

const { Item } = Form
const { TextArea } = Input

class ProductAddUpdate extends Component {
    state = {
        options: [],
    };
    // 获取一级/二级分类列表
    // async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
    getCategory = async (parentId) => {
        const result = await reqCategory(parentId)
        if (result.status === 0) {
            const category = result.data
            if (parentId === 0) { // 一级分类列表
                this.initOptions(category)
            } else {  //二级分类列表
                return category  //返回二级列表，当前async函数返回的promise就会成功，且value
            }
        }
    }
    initOptions = (category) => {
        const options = category.map((item) => ({
            value: item._id,
            label: item.name,
            isLeaf: false,
        }))
        // 更新options状态
        this.setState({
            options
        })
    }
    // 级联选择，用来加载下一级列表的回调函数
    loadData = async selectedOptions => {
        // 得到选择的option对象，是一个数组
        const targetOption = selectedOptions[0];
        // 显示loading
        targetOption.loading = true;
        // 根据选中的分类，获取二级列表数据
        const subCategorys = await this.getCategory(targetOption.value)
        targetOption.loading = false;
        if (subCategorys && subCategorys.length > 0) {
            // 生成二级列表的options
            const childOptions = subCategorys.map(item => ({
                value: item._id,
                label: item.name,
                isLeaf: true,
            }))
            // 关联到当前option上
            targetOption.children = childOptions
        } else {
            targetOption.isLeaf = true
        }
        this.setState({
            options: [...this.state.options],
        })
    }

    submit = () => {
        // 进行表单验证如果通过才发送请求
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    validatePrice = (rule, value, callback) => {
        console.log(value, typeof value);
        // 价格的自定义验证
        if (value * 1 > 0) {
            callback() //验证通过
        } else {
            callback('价格必须大于0') //验证没有通过
        }
    }

    componentDidMount() {
        // 先是获取父分类列表
        this.getCategory(0)
    }
    // 第一次render之前will
    UNSAFE_componentWillMount() {
        // 取出携带的state
        const product = this.props.location.state //如果是添加就没有值，否则有值
        // 是否是更新的标识，！！是强制转换为布尔值
        this.isUpdate = !!product
        // 保存商品，{}防止出错
        this.product = product || {}
    }
    render() {
        // 修改项所携带的product值
        const { name, desc, pCategoryId, categoryId, price, } = this.product
        // 用来接受级联分类的ID数组
        const { isUpdate, product } = this
        const categoryIds = []
        if (isUpdate) {
            if (pCategoryId === 0) {
                // 一级分类的商品
                categoryIds.push(pCategoryId)

            } else {
                // 二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        const { getFieldDecorator } = this.props.form
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.replace('/product')}>
                    <Icon type="arrow-left" style={{ fontSize: 24 }} />
                </LinkButton>
                <span style={{ fontSize: 22, marginLeft: 16 }}>
                    {isUpdate ? '修改商品' : '添加商品'}
                </span>
            </span>
        )
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 }, //左侧label的宽度
            wrapperCol: { span: 8 },//右侧包裹的宽度
        }
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label='商品名称：'>
                        {getFieldDecorator('name', {
                            initialValue: name,
                            rules: [{ required: true, message: '请输入商品名称' }],
                        })(
                            <Input
                                // type="password"
                                placeholder="商品名称"

                            />,
                        )}
                    </Item>
                    <Item label='商品描述：'>
                        {getFieldDecorator('desc', {
                            initialValue: desc,
                            rules: [{ required: true, message: '请输入商品描述' }],
                        })(
                            <TextArea autoSize={{ minRows: 2, maxRows: 6 }} placeholder='请输入商品描述' />
                        )}
                    </Item>
                    <Item label='商品价格：'>
                        {getFieldDecorator('price', {

                            initialValue: price,
                            rules: [
                                { required: true, message: '请输入商品价格' },
                                { validator: this.validatePrice } //自定义表单校验
                            ],
                        })(
                            <Input addonAfter="元" type='number' />
                        )}
                    </Item>
                    <Item label='商品分类：'>
                        {getFieldDecorator('categoryIds', {
                            initialValue: categoryIds,
                            rules: [{ required: true, message: '必须指定商品分类' }],
                        })(
                            <Cascader
                                options={this.state.options}
                                loadData={this.loadData}
                            />
                        )}

                    </Item >
                    {/* <Item label='商品图片：'>
                        <Input />
                    </Item>
                    <Item label='商品详情：'>
                        <Input />
                    </Item> */}
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        );
    }
}

export default Form.create()(ProductAddUpdate);