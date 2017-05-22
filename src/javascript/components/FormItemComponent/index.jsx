import React, { Component } from 'react';
// import ReactDOM from 'react-dom';

import { Input, DatePicker, Select, TreeSelect, Form, Button } from 'antd';
import PropTypes from 'prop-types';
const FormItem = Form.Item;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

class MyForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // formItemCol: {
      //   labelCol: { span: 8 },
      //   wrapperCol: { span: 8 },
      // },
      ComponentMap: {
        input : (res) => {
          let {
              suffix,
            } = res;
          return (
            <Input suffix={<span style={{ fontSize: 13 }} >{suffix}</span>} />
          );
        },

        picker : (res) => {
          let {
            disabledDate,
          } = res;
          return (
            <DatePicker style={{ width:'100%' }}
              disabledDate={disabledDate}
              allowClear={false}
              // disabledTime={disabledDateTime}
              showTime
            />
          );
        },

        select : (res) => {
          let {
              options,
            } = res;

          let optionsContent = options.map((opt, index) => {
            return (
              <Option key={opt.value}>{opt.label}</Option>
            );
          });

          return (
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {optionsContent}
            </Select>

          );
        },

        treeSelect : (res) => {
          let {
              treeData,
              value,
              onChange,
            } = res;

          const tProps = {
            treeData,
            value,
            onChange,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: 'Please select',
          };
          return (
            <TreeSelect {...tProps} />
          );
        },

      },
    };
  }

  genFormItem = () => {
    let current = this.props.formItemData;
    const { getFieldDecorator } = this.props.form;
    const {
      formItemCol: {
        labelCol,
        wrapperCol,
      },
    } = this.props;

    return current.map((currentItem, i) => {
      let {
        label,
        id,
        rules,
        type,
        defaultValue,
        value,
        options,
        suffix,
        getValueFromEvent,
        treeData,
        disabledDate,
      } = currentItem;

      return (
        <FormItem
          label={label}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          key={i}
        >
          {getFieldDecorator(`${id}`, {
            rules,
            getValueFromEvent,
            initialValue: defaultValue || '',
          })(
                this.state.ComponentMap[type]({
                  type,
                  defaultValue,
                  value,
                  suffix,
                  options,
                  treeData,
                  disabledDate,
                })
            )}
        </FormItem>
      );
    });
  }

  render () {
    let {
      handleSubmit,
      submitWrapperCol,
    } = this.props;

    let submitButtonStyleObj = this.props.submitButtonStyleObj || { display: 'block' };
    return (
      <Form onSubmit={handleSubmit}>
        {this.genFormItem()}
        <FormItem style={submitButtonStyleObj}
          wrapperCol={submitWrapperCol}
            >
          <Button type='primary' htmlType='submit'>
             提交
          </Button>
        </FormItem>

      </Form>
    );
  }
}

MyForm.propTypes = {
  form: PropTypes.object.isRequired,
  formItemData: React.PropTypes.array,
  handleSubmit: React.PropTypes.func, // 提交函数
  submitButtonStyleObj: PropTypes.object, // 提交按钮是否显示
  formItemCol: PropTypes.object,  // 表单样式
  submitWrapperCol:PropTypes.object, // 提交按钮样式
};

const MyFormItem = Form.create({
})(MyForm);

export default MyFormItem;
