import React, { Component } from 'react';
import { Form, Select, Input, } from 'antd'
import PropsTypes from 'prop-types'
const Item = Form.Item
const Option = Select.Option
class AddForm extends Component {
    // 对props类型进行检验
    static propsTypes = {
        setForm: PropsTypes.func.isRequired,
        categorys: PropsTypes.array.isRequired,
        parentId: PropsTypes.string.isRequired,
    }
    componentWillMount() {
        this.props.setForm(this.props.form)

    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { categorys, parentId } = this.props

        return (
            <Form>
                <Item>
                    <p>所属分类：</p>
                    {
                        getFieldDecorator('parentId', { initialValue: parentId })(
                            <Select>
                                <Option value='0'>一级分类</Option>
                                {
                                    categorys.map((index) => {
                                        return (
                                            <Option value={index._id}>{index.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )
                    }
                </Item>
                <Item>
                    <p>分类名称：</p>
                    {
                        getFieldDecorator('categoryName', {
                            rules: [
                                { required: true, message: '请输入名称!' }
                            ]
                        })(
                            <Input placeholder='请输入分类名称' />
                        )
                    }

                </Item>
            </Form>
        );
    }
}

export default Form.create()(AddForm);//包装Form组件，传入强大的this.props.form