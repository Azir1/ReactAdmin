import React, { Component } from 'react';
import { Card, Button, Icon, Table, message, Modal } from 'antd'
import LinkButton from '../../components/link-button/index'
import './category.less'
import { reqCategory, reqAddCategory, reqUpdateCategory } from '../../api/index'
import AddForm from './add-form';
import UpdateForm from './update-form';


class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      categorys: [],//一级分类列表
      subCategorys: [],//二级分类列表
      parentId: '0',
      parentName: '',
      visibleStatus: 0,//0不显示确认框，1添加框，2修改框
    };
  }
  // 定义初始化表头函数
  initCol = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (category) => ( //返回需要显示的界面标签,这里的*category表示每行数据对象
          <span>
            <LinkButton style={{ marginRight: '20px' }} onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {this.state.parentId === '0' ? <LinkButton onClick={() => this.getSubCategorys(category)} >查看子分类</LinkButton> : ''}
          </span>
        )
      },
    ];
  }
  // 修改分类,步骤：1、发请求更新  2、关闭窗口  3、重新刷新列表
  showUpdate = (category) => {
    this.category = category
    this.setState({ visibleStatus: 2 })
  }
  updateCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        const categoryId = this.category._id  //一级分类，二级分类各自独有的id
        const { categoryName } = values
        const result = await reqUpdateCategory({ categoryId, categoryName })  //发请求更新*****
        if (result.status === 0) {
          this.getCategory() //刷新列表
        }
        this.setState({ visibleStatus: 0 })  //关闭窗口
        // 清除表单内容,避免表单内容缓存，影响表单初始化
        this.form.resetFields()
      }
    })




  }
  handleCancel = () => {
    this.setState({ visibleStatus: 0 })
    // 清除表单内容
    this.form.resetFields()
  }
  // 更新
  showAdd = () => {
    this.setState({ visibleStatus: 1 })
  }
  addCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        const { categoryName, parentId } = this.form.getFieldsValue()
        const result = await reqAddCategory(parentId, categoryName)
        if (result.status === 0 && parentId === this.state.parentId) {
          // 更新列表
          this.getCategory()
        }
        // 清除form缓存
        this.form.resetFields()
        // 隐藏对话框
        this.setState({ visibleStatus: 0 })
      }
    });
  }
  // 发送数据
  // 点击获取二级列表
  getSubCategorys = (category) => {
    this.setState({
      parentId: category._id,
      parentName: category.name,
    }, () => {
      // 更新状态后，执行回调函数
      this.getCategory()
    })
  }
  // 异步请求一级或二级分类列表
  getCategory = async () => {
    this.setState({ loading: true })
    const { parentId } = this.state
    const result = await reqCategory(parentId)
    this.setState({ loading: false })
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        // 获取一级分类列表
        this.setState({
          categorys
        })
      } else {
        // 获取二级分类列表
        this.setState({
          subCategorys: categorys
        })
      }
    } else {
      message.error('获取分类失败')
    }
  }
  // 点击返回一级分类列表
  showCategorys = () => {
    this.setState({ parentId: '0' }, () => {
      this.getCategory()
    })
  }
  // 初始化表头
  UNSAFE_componentWillMount() { //在render之前调用
    this.initCol()
  }
  // 异步ajax请求一级分类列表数据
  componentDidMount() {  //子组件都render完之后才可以调用
    this.getCategory()
  }
  render() {
    let title
    const { loading, categorys, parentId, subCategorys, parentName } = this.state
    const extra = <Button type='primary' onClick={this.showAdd}><Icon type="plus" />添加</Button>
    const category = this.category || {}
    {
      this.state.parentId === '0' ? title = <LinkButton>一级分类列表</LinkButton> : title = (
        <div>
          <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
          <Icon type="swap-right" style={{ margin: 14 }} />
          <span>{parentName}</span>
        </div>
      )
    }
    return (
      <div>
        <Card title={title} extra={extra} >
          {/* 修改分类对话框 */}
          <Modal
            title="修改分类"
            visible={this.state.visibleStatus === 2}
            onOk={this.updateCategory}
            onCancel={this.handleCancel}
          >
            <UpdateForm
              categoryName={category.name}
              setForm={(form) => { this.form = form }}  //用函数类型的props来接收form对象
            />
          </Modal>
          {/* 更新分类 */}
          <Modal
            title="更新分类"
            visible={this.state.visibleStatus === 1}
            onOk={this.addCategory}
            onCancel={this.handleCancel}
          >
            <AddForm categorys={categorys} parentId={parentId} setForm={(form) => this.form = form} />
          </Modal>
          <Table
            loading={loading}
            dataSource={parentId === '0' ? categorys : subCategorys}
            columns={this.columns}
            bordered
            rowKey='_id'
            pagination={{
              pageSize: 11,
              showQuickJumper: true,
              showSizeChanger: true,
            }}
          />
        </Card>
      </div>
    );
  }
}

export default Category;
