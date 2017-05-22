import React from 'react';
import { DatePicker, Select } from 'antd';
const MonthPicker = DatePicker.MonthPicker;
const Option = Select.Option;

export const datePicker = {
  id: 'date-picker',
  opts: {
    rules: [{ type: 'object', required: true, message: 'Please select time!' }],
  },
  elem: <DatePicker />,
  formOpts: {
    label: '日期',
    doHelp: true,
    doValidateStatus: true,
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  },
};

export const monthPicker = {
  id: 'month-picker',
  opts: {
    rules: [{ type: 'object', required: true, message: 'Please select time!' }],
  },
  elem: <MonthPicker />,
  formOpts: {
    label: '日期',
    doHelp: true,
    doValidateStatus: true,
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  },
};

export const pickeUnit = {
  id: 'picker-unit',
  opts: {
    rules: [{ type: 'string', required: true, message: 'Please select time!' }],
    onChange: this.handleUnitChange,
  },
  elem:
    (<Select placeholder="Select a option and change input text above">
      <Option value="day">日</Option>
      <Option value="week">周</Option>
      <Option value="month">月</Option>
    </Select>),
  formOpts: {
    label: '时间单位',
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
    doHelp: true,
    doValidateStatus: true,
  },
};
