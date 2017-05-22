import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MenuComp from 'components/MenuComp/MenuComp';
import Requirement from 'components/Requirement/Requirement';
import MyFormItem from 'components/FormItemComponent/index.jsx';
import 'scss/base.scss';
import 'scss/Supplies/index.scss';
import RequestUtil from 'extend/common/RequestUtil';
import Util from 'extend/common/Util';
import SuppliesData from './data.jsx';
import config from '../../config/config.json';

import { Table, Button, Modal } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
const confirm = Modal.confirm;
const {
  columns,
  addFormItemData,
  typeTreeSelect,
  messageContent,
  formItemCol,
  submitWrapperCol,
} = SuppliesData;

class PageComponent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      exportTerm: {
        beginDate: '',
        endDate: '',
        otherOutcomeType: '',
        storeId: '',
      },
      shopTreeSelect: [],
      shopTreeSelectFature: [], // 大类
      formItemCol,
      submitWrapperCol,
      columns,
      addFormItemData,
      messageContent,
      typeTreeSelect, // 支出类型
      otherOutcomeDataList: [], // 列表展示数据
      addOtherOutcomeModal: '',  //  增加时的蒙版
      visibleBoolean: false,  //  增加的蒙版是否显示
      disabledOrNot: 'disabled', // 导出按钮 disableded
      size: 'large',  //导出按钮的大小
    };
  }

  componentDidMount () {
    addFormItemData.find((n) => n.id === 'storeId').getValueFromEvent = this.handleStoreNameChange;
    addFormItemData.find((n) => n.id === 'otherOutcomeType').getValueFromEvent = this.handleOtherOutcomeTypeChange;
    addFormItemData.find((n) => n.id === 'beginDate').disabledDate = this.disabledStartDate;
    addFormItemData.find((n) => n.id === 'endDate').disabledDate = this.disabledEndDate;

    this.getStoreIds();
    this.initLoad();
  }

  timeLimit = () => {
    let form = this.refs.myForm;
    let otherOutcomeTypeResult = form.getFieldsValue()['otherOutcomeType'];
    // 水费 电费 薪酬

    if (otherOutcomeTypeResult === typeTreeSelect.find((n) => n.value === 'dianfei').value ||
        otherOutcomeTypeResult === typeTreeSelect.find((n) => n.value === 'shuifei').value ||
        otherOutcomeTypeResult === typeTreeSelect.find((n) => n.value === 'xinchou').value) {
      return true;
    } else {
      return false;
    }
  }

 /**
 * [开始时间的时间限制]
 * @param  {[function]} callback [description]
 */
  disabledStartDate = (startValue) => {
    const form = this.refs.myForm;
    const endValue = form.getFieldsValue()['endDate'];

    if (!startValue) {
      return false;
    }

    if (this.timeLimit()) { // 不受限制
      return endValue && (startValue.valueOf() > endValue.valueOf());
    } else {
      return (startValue.valueOf() < Date.now()) ||
        (endValue && (startValue.valueOf() > endValue.valueOf()));
    }
  }

  disabledEndDate = (endValue) => {
    const form = this.refs.myForm;
    const startValue = form.getFieldsValue()['beginDate'];

    if (!endValue) {
      return false;
    }

    if (this.timeLimit()) { // 不受限制
      return startValue && (startValue.valueOf() > endValue.valueOf());
    } else {
      return (endValue.valueOf() < Date.now()) ||
        (startValue && (startValue.valueOf() > endValue.valueOf()));
    }
  }
  /**
 * [不能选择大的门类]
 * @param  {[function]} callback [description]
 */
  handleStoreNameChange = (value) => {
    const { shopTreeSelectFature } = this.state;
    let result = shopTreeSelectFature.find(function (val, index) {
      return val === value;
    });
    if (!result) { return value; };
  }
  /**
   * [将选择的支出类型保存起来，用于与开始时间联动]
   * @param  {[type]} a [description]
   * @return {[type]}   [description]
   */
  handleOtherOutcomeTypeChange = (value) => {
    let form = this.refs.myForm;
    form.setFieldsValue({
      beginDate: '',
      endDate: '',
    });
    // this.handleDisabledDateBeginDate();
    return value;
  }
  /**
 * [刚进来时列表函数，仅仅显示当月数据]
 * @param  {[function]} callback [description]
 */
  initLoad = () => {
    // let now = new Date();
    // let today = moment(now).format('YYYY-MM-DD');
    // let currentMonth = today.substring(0, 8);
    // let firstDay = `${currentMonth}01`;
    // let value = {
    //   beginDate: firstDay,
    //   endDate: today,
    // };
    // this.getRequireData(value);
    this.getRequireData({});
  }
  pageSizeChange = (page) => {
    const {
      exportTerm: {
        beginDate,
        endDate,
        otherOutcomeType,
        storeId,
      },
    } = this.state;
    let value = {
      beginDate,
      endDate,
      otherOutcomeType,
      storeId,
    };
    this.getRequireData(value, page);
  }
/**
 * [筛选列表函数]
 * @param  {[function]} callback [description]
 */
  getRequireData = (value, pageNo = 1) => {
    let that = this;
    let beginDate = value[`NONEPickerStart`] || value.beginDate;
    let endDate = value[`NONEPickerEnd`] || value.endDate;
    let otherOutcomeType = value['type'] || value.type;
    let storeId = value['shop'] || value.storeId;

    if (storeId !== undefined) {
      storeId = storeId.join(',');
    }
    that.setState({
      exportTerm: {
        beginDate,
        endDate,
        otherOutcomeType,
        storeId,
      },
    });

    let parm = {
      url : 'outcome/others/list',
      method : 'POST',
      data : {
        beginDate,
        endDate,
        otherOutcomeType,
        storeId,
        'pageNo': Number(pageNo),
        'pageSize': Number(10),
      },
      successFn : function (data) {
        if (RequestUtil.isResultSuccessful(data)) {
          let {
            resultData: {
              list,
              totalSize,
            },
          } = data;
          if (totalSize === 0) {
            that.setState({
              disabledOrNot: 'disabled',
            });
          } else {
            that.setState({
              disabledOrNot: '',
            });
          }

          if (Util.isArray(list)) {
            let otherOutcomeDataList = [];
            list.map(function (item, index) {
              let {
                storeName,
                otherOutcomeType,
                price,
                begintDate,
                endDate,
                paymentDate,
                expirationDays,
                outcomeAvg,
                remark,
              } = item;
              SuppliesData.transformEN(otherOutcomeType);
              let otherOutcomeDataListContent = {
                key: index,
                storeName,
                otherOutcomeType,
                price,
                startDate: begintDate,
                endDate,
                paymentDate,
                expirationDays,
                outcomeAvg,
                remark,
              };

              otherOutcomeDataList.push(otherOutcomeDataListContent);
            });
            that.setState({
              otherOutcomeDataList,
              totalSize,
            });
          }
        } else {
          console.log('get dataList error!');
        }
      },
      errorFn : function () {
        console.error(arguments);
      },
    };
    RequestUtil.fetch(parm);
    return value;
  }

  handleSubmit = (e) => {
    let form = this.refs.myForm;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        let submitData = { ...values };
        for (let key in values) {
          moment.isMoment(values[key]) && (submitData[key] = moment(values[key]).format('YYYY-MM-DD'));
        }
        this.showConfirm(submitData);
      }
    });
  }

  showConfirm = (reslut) => {
    let that = this;
    let saveOutcomeRecord = that.saveOutcomeRecord;
    let { messageContent } = that.state;
    confirm({
      content: `${messageContent}`,
      okText: `确认`,
      cancelText: `取消`,
      iconType: ' ',
      onOk () {
        that.getVisibleChange();
        saveOutcomeRecord(reslut); // 保存新增数据重加载数据列表
      },
      onCancel () {
        console.log('Cancel');
      },
    });
  }
  saveOutcomeRecord= (result) => {
    let {
      beginDate,
      endDate,
      otherOutcomeType,
      paymentDate,
      price,
      remark,
      storeId,
    } = result;
    let that = this;
    let parm = {
      url : 'outcome/others/save',
      method : 'POST',
      data: {
        beginDate,
        endDate,
        otherOutcomeType,
        paymentDate,
        price: Number(price),
        remark,
        storeId,
      },
      successFn : function (data) {
        if (RequestUtil.isResultSuccessful(data)) {
          that.initLoad(); // 重载数据列表
          let form = that.refs.myForm;
          form.setFieldsValue({
            storeId: '',
            otherOutcomeType: '',
            price: '',
            beginDate: '',
            endDate: '',
            paymentDate: '',
            remark: '',
          });
        } else {
          console.log('get addrList error!');
        }
      },
      errorFn : function () {
        console.error(arguments);
      },
    };
    RequestUtil.fetch(parm);
  }
/**
 * [蒙版消失函数]
 * @param  {[function]} callback [description]
 */
  getVisibleChange = () => {
    let visibleBoolean = false;
    this.setState({
      visibleBoolean,
    });
  }
  /**
 * [出现蒙版，增加表单函数]
 * @param  {[function]} callback [description]
 */
  addExpenditureRecord = () => {
    const {
      addFormItemData,
      shopTreeSelect,
      typeTreeSelect,
    } = this.state;
    let visibleBoolean = true;
    let addFormItemDataClone = Util.deepClone(addFormItemData);

    addFormItemDataClone.find((n) => n.id === 'storeId').treeData = shopTreeSelect;
    addFormItemDataClone.find((n) => n.id === 'otherOutcomeType').options = typeTreeSelect;

    this.setState({
      visibleBoolean,
      addFormItemData: addFormItemDataClone,
    });
  }
  /**
 * [导出excel表单]
 * @param  {[function]} callback [description]
 */
  exportExpenditureRecord = () => {
    let submitButton = this.refs.submit;
    submitButton.click();
  }
/**
 * [请求门店数据函数,]
 * @param  {[function]} callback [description]
 */
  getStoreIds = () => {
    let that = this;
    let shopTreeSelect = [];
    let shopTreeSelectFature = [];
    let param = {
      url : 'shop/query',
      method : 'POST',
      data : {
      },
      successFn : function (data) {
        if (RequestUtil.isResultSuccessful(data)) {
          let storeIdsList = data.resultData;

          if (Util.isArray(storeIdsList)) {
            storeIdsList.map(function (item, index) {
              let {
                id,
                name,
                list,
              } = item;
              shopTreeSelectFature.push(id);
              let shopTreeSelectContent = {
                label: name,
                value: id,
                key: `0-${index}`,
                children: [],
              };

              list.map(function (item, index) {
                let {
                  id,
                  name,
                } = item;
                let childrenContent = {
                  label: name,
                  value: id,
                  key: `${shopTreeSelectContent.key}-${index}`,
                };

                shopTreeSelectContent.children.push(childrenContent);
              });
              shopTreeSelect.push(shopTreeSelectContent);
            });
            that.setState({
              shopTreeSelect,
              shopTreeSelectFature,
            });
          }
        } else {
          console.log('get storeIdsList error!');
        }
      },
      errorFn : function () {
        console.error(arguments);
      },
    };
    RequestUtil.fetch(param);
  };

  render () {
    const {
      shopTreeSelect,
      typeTreeSelect,
      columns,
      otherOutcomeDataList,
      exportTerm: {
        beginDate,
        endDate,
        otherOutcomeType,
        storeId,
      },
      visibleBoolean,
      totalSize,
      addFormItemData,
      formItemCol,
      submitWrapperCol,
      size,
    } = this.state;
    let disabledOrNot = this.state.disabledOrNot;

    if (!beginDate || !endDate) {
      disabledOrNot = 'disabled';
    }
    const RequirementInfo = {
      formItems: [
        {
          formName: 'DayPicker',
          formInfo: {
            dateRange: true,
            dateUnit: 'NONE',
          },
        },
        {
          formName: 'typeTreeSelect',
          formInfo: {},
        },
        {
          formName: 'ShopTreeSelect',
          formInfo: {},
        },
      ],
      getRequireData: this.getRequireData,
      shopTreeSelect,
      typeTreeSelect,
    };
    return (
      <MenuComp activeTab={5} subTitle="其他支出">
        <Requirement {...RequirementInfo} />
        <div className='table'>
          <a href="javascript:void(0)" className='addRecord' onClick={this.addExpenditureRecord}>+增加支出记录</a>
          <Button type="primary"
            size={size}
            onClick={this.exportExpenditureRecord}
            disabled={disabledOrNot}
            >导出</Button>
          <Table
            columns={columns}
            dataSource={otherOutcomeDataList}  // 数据
            bordered
            pagination={{ total: totalSize, onChange: this.pageSizeChange }}
         />
        </div>

        <Modal title=''
          visible={visibleBoolean}
          onOk={this.submit}
          onCancel={this.getVisibleChange}
          maskClosable={false}
          okText='提交' cancelText=' '
          footer={null}
          style={{ top: '260px' }}
        >
          <MyFormItem ref='myForm'
            initLoad={this.initLoad}
            formItemData={addFormItemData}
            handleSubmit={this.handleSubmit}
            formItemCol={formItemCol}
            submitWrapperCol={submitWrapperCol}
          />
        </Modal>

        <form action={config[config.current] + 'outcome/others/export'} method="post" style={{ display: 'none' }}>
          开始时间:
            <input type="text" name="beginDate" value={beginDate} /><br />
          结束时间:<br />
          <input type="text" name="endDate" value={endDate} /><br />
          支出类型:<br />
          <input type="text" name="otherOutcomeType" value={otherOutcomeType} /><br />
          门店:<br />
          <input type="text" name="storeId" value={storeId} /><br /><br />
          <input type="submit" value="Submit" ref="submit" />
        </form>

      </MenuComp>
    );
  }
}

Modal.propTypes = {
  getVisibleChange: PropTypes.func,
  initLoad: PropTypes.func,
  form: PropTypes.object.isRequired,
};
ReactDOM.render(<PageComponent />, document.getElementById('app'));
