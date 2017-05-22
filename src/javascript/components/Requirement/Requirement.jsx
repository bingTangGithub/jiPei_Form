import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Util from 'extend/common/Util';
import moment from 'moment';
import { Form, Row, Col, Input, Button, DatePicker, Select, TreeSelect } from 'antd';
import getFormItemData from './getFormItemList.jsx';
import './Requirement.scss';

const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const Option = Select.Option;

class Requirement extends Component {
  constructor (props) {
    super(props);

    this.state = {
      endValue: null,
      dateUnit: '',
      durations: {
        Day: 31,
        Week: 180,
        Month: null,
      },
    };
  }

  componentDidMount () {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  resetFormList = (formItemList) => {
    let itemList = [];
    let { formItems } = this.props;
    let { dateUnit } = this.state;

    formItems.length && formItems.map((item, index) => {
      switch (item.formName) {
        case 'DayPicker':
          !dateUnit && (dateUnit = item.formInfo.dateUnit);
          if (item.formInfo.dateRange) {
            let originUnit = dateUnit;
            switch (dateUnit) {
              case 'NONE':
                this.dateUnit = 'NONE';
                dateUnit = 'Day';
                break;
              case 'Month':
                break;
              case 'All':
              case 'Day':
              case 'Week':
              default:
                dateUnit = 'Day';
                break;
            }
            (originUnit !== 'NONE') && itemList.push({ ...formItemList('UnitSelect', this) });

            let pickerStart = { ...formItemList(dateUnit + 'PickerStart', this) };
            pickerStart.id = `${originUnit}PickerStart`;
            pickerStart.formOpts = { ...pickerStart.formOpts };
            pickerStart.formOpts.label = '开始日期';
            itemList.push(pickerStart);

            let pickerEnd = { ...formItemList(dateUnit + 'PickerEnd', this) };
            pickerEnd.id = `${originUnit}PickerEnd`;
            pickerEnd.formOpts = { ...pickerEnd.formOpts };
            pickerEnd.formOpts.label = '结束日期';
            itemList.push(pickerEnd);
          } else {
            itemList.push({ ...formItemList('DayPicker', this) });
            dateUnit = 'Week';
          }
          break;
        case 'Input':
          item.formInfo.map((itemInput, index) => {
            let newInput = { ...formItemList(item.formName, this) };
            newInput.formOpts = { ...newInput.formOpts };
            newInput.id = itemInput.id;
            newInput.formOpts.label = itemInput.label;

            itemList.push({ ...newInput });
          });
          break;
        default:
          itemList.push({ ...formItemList(item.formName, this) });
          break;
      }
    });
    return itemList;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let submitData = { ...values };
        for (let key in values) {
          moment.isMoment(values[key]) && (submitData[key] = moment(values[key]).format('YYYY-MM-DD'));
        }
        this.props.getRequireData(submitData);
      }
    });
  }

  handleUnitChange = (value) => {
    this.setState({
      UnitChanged: true,
      dateUnit: value,
      startValue: null,
      endValue: null,
    });
    return value;
  }

  getFieldErrorMSG = (id) => {
    const { getFieldError, isFieldTouched } = this.props.form;
    return isFieldTouched(id) && getFieldError(id);
  }

  resetHelp = (id) => {
    return this.getFieldErrorMSG(id) || '';
  }

  resetValiStatus = (id) => {
    return this.getFieldErrorMSG(id) ? 'error' : '';
  }

  hasErrors (fieldsError) {
    const { dateUnit, startValue, endValue } = this.state;
    if (this.dateUnit === 'NONE') {
      if (!startValue && !endValue) {
        // 若二者都不填写 则不做处理
      } else if (!startValue || !endValue) {
        return true;
      }
    } else if (!dateUnit && !startValue && !endValue) {
      // 若三者都不填写 则不做处理
    } else if (!dateUnit || !startValue || !endValue) {
      return true;
    }
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  createDataEntry = (id, opts, elem) => {
    return this.props.form.getFieldDecorator(id, opts)(elem);
  }

  createFormItem = (children, opts = {}) => {
    return (
      <FormItem {...opts}>
        {children}
      </FormItem>
    );
  }

  getFormItems = (itemList) => {
    return itemList.map((item, index) => {
      const { id, opts, elemName, elemOpts, elemChild, formOpts } = item;

      const elem = this.getFormComp(elemName, elemOpts, elemChild);

      const { doHelp, doValidateStatus } = formOpts;
      doHelp && (formOpts.help = this.resetHelp(id));
      doValidateStatus && (formOpts.validateStatus = this.resetValiStatus(id));

      return (
        <Col sm={8} md={6} key={id + index} style={{ paddingBottom: 20 }}>
          {
            this.createFormItem(
              this.createDataEntry(id, opts, elem),
              { ...formOpts }
            )
          }
        </Col>
      );
    });
  }

  disabledStartDate = (sValue) => {
    const { endValue, durations, dateUnit } = this.state;
    let duration = durations[dateUnit];
    if (!sValue) {
      return false;
    }

    const tomorrow = moment().hour(24).set({ 'hour': '0', 'minute': '0', 'second': '0' });
    if (this.dateUnit !== 'NONE') {
      // 2017年不可选
      if (dateUnit && sValue.valueOf() < moment('2017-01-01').valueOf()) {
        return true;
      }
      if (sValue.valueOf() > tomorrow.valueOf()) {
        return true;
      }
    }

    if (!endValue) {
      return false;
    }
    return sValue.valueOf() > endValue.valueOf() ||
      (
        (this.dateUnit !== 'NONE') &&
        duration && (sValue.valueOf() <= moment(endValue).add(-duration, 'days').valueOf())
      );
  }

  disabledEndDate = (eValue) => {
    const { startValue, durations, dateUnit } = this.state;
    let duration = durations[dateUnit];
    const tomorrow = moment().hour(24).set({ 'hour': '0', 'minute': '0', 'second': '0' });
    if (this.dateUnit !== 'NONE') {
      // 2017年不可选
      if (dateUnit && eValue && eValue.valueOf() < moment('2017-01-01').valueOf()) {
        return true;
      }
      if (eValue && eValue.valueOf() > tomorrow.valueOf()) {
        return true;
      }
    }
    if (!eValue || !startValue) {
      return false;
    }

    return (eValue.valueOf() <= startValue.valueOf()) ||
      (
        (this.dateUnit !== 'NONE') &&
        (
          (eValue.valueOf() > tomorrow.valueOf()) ||
          (duration && (eValue.valueOf() > moment(startValue).add(duration, 'days').valueOf()))
        )
      );
  }

  handleStartChange = (sValue) => {
    this.setState({
      startValue: sValue,
    });
    return sValue;
  }

  handleEndChange = (eValue) => {
    this.setState({
      endValue: eValue,
    });
    return eValue;
  }

  isArray = (arr) => {
    return arr && (arr.constructor === Array);
  }

  getChildOpts = (items) => {
    return this.isArray(items) && items.length && items.map(
      (item, index) => <Option value={item.value} key={index}>{item.label}</Option>
    );
  }

  getFormComp = (type, elemOpt = {}, child = []) => {
    const ComponentMap = {
      DatePicker: <DatePicker {...elemOpt} />,
      MonthPicker: <MonthPicker {...elemOpt} />,
      Select: (
        <Select {...elemOpt}>
          {this.getChildOpts(child)}
        </Select>
      ),
      Input: <Input {...elemOpt} />,
      TreeSelect: <TreeSelect {...elemOpt} />,
    };
    return ComponentMap[type];
  }

  render () {
    const itemInfoList = this.resetFormList(getFormItemData);
    const formList = this.getFormItems(itemInfoList);

    const { getFieldsError } = this.props.form;

    // Only show error after a field is touched.
    return (
      <Form
        layout="inline"
        onSubmit={this.handleSubmit}
        hideRequiredMark={false}
        style={{ background: '#fff', padding: '20px' }}
      >
        <Row gutter={5}>
          {formList}
        </Row>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            disabled={this.hasErrors(getFieldsError())}
            style={{ width: 80, margin: '0' }}
            size='large'
          >
            筛选
          </Button>
        </FormItem>
      </Form>
    );
  }
}

Requirement.propTypes = {
  form: PropTypes.object.isRequired,
  formItems: PropTypes.array.isRequired,
  getRequireData: PropTypes.func.isRequired,
  // shopTreeSelect: PropTypes.array,
  // typeTreeSelect: PropTypes.array,
  // conditionTreeSelect: PropTypes.array,
};

const WrappedRequirement = Form.create({
  onValuesChange: (props, fields) => {
    // console.log('fields', fields);
  },
})(Requirement);

export default WrappedRequirement;
