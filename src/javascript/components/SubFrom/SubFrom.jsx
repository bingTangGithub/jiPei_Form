import React, { Component } from 'react';
import { Form, Select, Input, Button } from 'antd';
import PropTypes from 'prop-types';
const FormItem = Form.Item;
const SOption = Select.Option;

class NormalLoginForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let submitData = { ...values };
        submitData.goodsEntityId = this.props.wzid;
        this.props.getFormpush(submitData);
      }
    });
    this.props.form.setFieldsValue({
      storeId: '',
      storeDep: '',
      charge: '',
    });
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    const { childseo } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <Form
        onSubmit={this.handleSubmit}
        >
        <FormItem
          {...formItemLayout}
          label="门店:"
          hasFeedback
          validateStatus=''
                  >
          {getFieldDecorator('storeId', {
            initialValue: '',
            rules: [{ required: true, message: '必填，请选择' }],
          })(
            <Select>
              {childseo}
            </Select>
                      )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="部门:"
          hasFeedback
          validateStatus=''
                    >
          {getFieldDecorator('storeDep', {
            initialValue: '',
            rules: [{ required: true, message: '必填，请选择' }],
          })(
            <Select>
              <SOption value="yunyingbu" key='1'>运营部</SOption>
              <SOption value="zhongxin" key='2'>运营支持中心</SOption>
            </Select>
                     )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="责任人:"
          hasFeedback
          validateStatus=''
                    >
          {getFieldDecorator('charge', {
            initialValue: '',
            rules: [{ required: true, message: '必填，请输入' }],
          })(
            <Input />
                    )}
        </FormItem>
        <FormItem>
          <div className="lingyong-confirm">
            <Button
              onClick={this.props.handleCancel}
              size='large'
              className='m-btnqx'
            >取消</Button>
            <Button type="primary"
              htmlType="submit" size='large'
              className='m-btn3'
              >提交</Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}

NormalLoginForm.propTypes = {
  form: PropTypes.object.isRequired,
  childseo: PropTypes.array.isRequired,
  getFormpush: PropTypes.func.isRequired,
  wzid: PropTypes.string.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

let SubFrom = Form.create({
  onValuesChange: (props, fields) => {
  },
})(NormalLoginForm);
export default SubFrom;
