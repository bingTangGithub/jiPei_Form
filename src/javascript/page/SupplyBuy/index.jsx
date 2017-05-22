import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import 'scss/base.scss';
import 'scss/SupplyBuy/index.scss';
import MenuComp from 'components/MenuComp/MenuComp';
import RequestUtil from 'extend/common/RequestUtil';
import Util from 'extend/common/Util';
import PropTypes from 'prop-types';
import MyFormItem from 'components/FormItemComponent/index.jsx';
import SupplyBuyData from './data.jsx';
import { Form, Modal } from 'antd';
const confirm = Modal.confirm;

const {
  expendTypeFormItem,
  buyFormItemData,
  fixFormItemData,
  submitWrapperCol,
  formItemCol,
  messageContentConfirm,
  messageRepairConfirm,
} = SupplyBuyData;
const typeSelectResult = expendTypeFormItem
                  .find((n) => n.id === 'expendType').options
                  .find((n) => n.value === 'purchase').value; // 选择采购结果
const initBuyFormItemDataLength = buyFormItemData.length;

class PageComponent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      numingRule: 'numingRule', // 设置id的
      quantityInputSize: 0,
      listFixNumber: [], // 可维修数据列表
      listQuantityInput: [],
      submitButtonBoolean: false, // 是否出现提交按钮
      submitButtonFormItem: '',
      expendTypeFormItem,
      buyFormItemData,
      fixFormItemData,
      formItemCol,
      submitWrapperCol,
      messageContentConfirm,
      expendTypeResult:'',
    };
  }

/**
 * [第一次渲染后，将data数据中的 getValueFromEvent等要用到函数的属性赋值
 * ，并将维修列表可供选择的编号获取]
 * @return {[type]}   [description]
 */
  componentDidMount () {
    let expendTypeFormItemClone = Util.deepClone(expendTypeFormItem);
    let buyFormItemDataClone = Util.deepClone(buyFormItemData);

    expendTypeFormItemClone.find((n) => n.id === 'expendType').getValueFromEvent = this.handleExpendTypeChange;
    buyFormItemDataClone.find((n) => n.id === 'goodsNum').getValueFromEvent = this.handleQuantityChange;
    buyFormItemDataClone.find((n) => n.id === 'goodsNum').options = this.genQuantitySelectOptions();

    this.setState({
      expendTypeFormItem: expendTypeFormItemClone,
      buyFormItemData:buyFormItemDataClone,
    });
    this.getfixNumber();
  }

/**
 * [默认录入可以提交20个，select按钮给出20个 options]
 * @return {[type]}   [description]
 */
  genQuantitySelectOptions = (count = 20) => {
    let result = [];
    for (let i = 0; i < count; i++) {
      result.push(
        { label: i + 1, value: i + 1 }
      );
    }
    return result;
  };

/**
 * [接口获取维修列表可供选择的编号]
 * @return {[type]}   [description]
 */
  getfixNumber = () => {
    let listFixNumber = [];
    let genSelectOptions = this.genSelectOptions;
    let parm = {
      url : 'outcome/goods/repairList',
      method : 'POST',
      data: {
      },
      successFn : function (data) {
        if (RequestUtil.isResultSuccessful(data)) {
          let fixNumberArray = data.resultData;
          if (Util.isArray(fixNumberArray)) {
            fixNumberArray.map(function (item, index) {
              listFixNumber.push(item);
            });
            genSelectOptions(listFixNumber);
          }
        } else {
          console.log('get fixNumber error!');
        }
      },
      errorFn : function () {
        console.error(arguments);
      },
    };
    RequestUtil.fetch(parm);
  }

/**
 * [由接口生成 options]
 * @return {[type]}   [description]
 */
  genSelectOptions = (obj) => {
    const { fixFormItemData } = this.state;
    let result = [];

    obj.map(function (item, index) {
      result.push(
        { id: index, value: item, label: item, key: `abc${index}` }
      );
    });

    let newObj = Object.assign({}, fixFormItemData[0], { options: result });
    this.setState({
      fixFormItemData: [
        newObj,
        fixFormItemData[1],
      ],
    });

    return result;
  };

/**
 * [改变数量时，生成对应数量的 input]
 * @return {[type]}   [description]
 */
  handleQuantityChange = (val) => {
    const {
      buyFormItemData,
      numingRule,
    } = this.state;

    let quantityInputSize = parseInt(this.state.quantityInputSize);
    let value = parseInt(val);

    let newListContent = Util.deepClone(buyFormItemData);

    if (value < quantityInputSize) {
      newListContent.length = value + initBuyFormItemDataLength;
    } else {
      for (let i = quantityInputSize + 1; i <= value; i++) {
        newListContent.push(
          {
            label: `编号${i}`,
            id: `${numingRule}${i}`,
            type: 'input',
          },
          );
      }
    }

    this.setState({
      buyFormItemData: newListContent,
      quantityInputSize: value,
    });
    return value;
  }

/**
 * [支出类型有值时，submitButtonBoolean为真，提交按钮出现]
 * 获取选择的值，并根据该值的不同设置获quantityInputSize，
 * quantityInputSize不到2时补到2]
 * @return {[type]}   [description]
 */
  handleExpendTypeChange = (value) => {
    const {
      buyFormItemData,
    } = this.state;
    let submitButtonBoolean = true;

    if (value === typeSelectResult) { // 选择采购
      let newListContent = Util.deepClone(buyFormItemData);
      let length = newListContent.length;
      if (length > 6) {
        newListContent.length = 6;
      }
      // else if (length < 8) {
      //   newListContent.push(
      //     {
      //       label: `编号2`,
      //       id: `numingRule2`,
      //       type: 'input',
      //     },
      //   );
      // }
      this.setState({
        buyFormItemData: newListContent,
      });
    }

    this.setState({
      submitButtonBoolean,
      expendTypeResult: value,
      quantityInputSize: 0,
    });
    return value;
  }

/**
 * [提交，根据选择的支出类型的不同进行相应的处理]
 * quantityInputSize不到2时补到2]
 * @return {[type]}   [description]
 */
  handleSubmit = (e) => {
    let form = this.refs.myForm;
    let {
      messageContentConfirm,
    } = this.state;
    e.preventDefault();

    form.validateFields((err, values) => {
      if (!err) {
        let result = form.getFieldsValue();
        let selectResult = result.expendType;
        if (typeSelectResult === selectResult) { // 选择采购
          this.showConfirm(result, messageContentConfirm, selectResult);
        } else { // 选择维修时
          this.showConfirm(result, messageRepairConfirm, selectResult);
        }
      }
    });
  }

/**
 * [维修数据提交接口]
 * quantityInputSize不到2时补到2]
 * @return {[type]}   [description]
 */
  repairSubmit = (res) => {
    let that = this;
    let showConfirmRequire = that.showConfirmRequire;
    let {
      goodsId,
      repairFee,
    } = res;
    let parm = {
      url : '/outcome/goods/repair',
      method : 'POST',
      data : {
        goodsId,
        repairFee,
      },
      successFn : function (data) {
        let {
          resultDesc,
        } = data;
        if (RequestUtil.isResultSuccessful(data)) {
          window.location.href = '../SupplyExpend/index.html'; // 跳转到物资使用界面
          // 维修界面确定时
          let form = that.refs.myForm;
          form.setFieldsValue({
            repairFee: '',
            goodsId: '',
          });
        } else {
          showConfirmRequire(resultDesc);
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
 * [不需要取消按钮的提示弹窗]
 * @return {[type]} [description]
 */
  showConfirmRequire = (message) => {
    Modal.info({
      content: `${message}`,
      iconType: ' ',
      okText: '确定',
      onOk () {},
    });
  }
  /**
 * [提交确认的提示弹窗]
 * @return {[type]} [description]
 */
  showConfirm = (result, message, typeResult) => {
    let that = this;
    let purchaseSubmit = that.purchaseSubmit;
    let { messageContentConfirm } = that.state;
    confirm({
      content: <span>{message.split(';')[0]}{'；'}<br />{message.split(';')[1]}</span>,
      iconType: ' ',
      onOk () {
        if (typeResult === typeSelectResult) { // 选择采购
          if (message === messageContentConfirm) { // 采购时且没有重复编号，请求接口
            purchaseSubmit(result);
          }
        } else {
          that.repairSubmit(result);
        }
      },
      onCancel () {
        console.log('Cancel');
      },
    });
  }

   /**
 * [采购数据提交接口]
 * @param  {[function]} callback [description]
 */
  purchaseSubmit = (result) => {
    const { numingRule } = this.state;
    let showConfirmRequire = this.showConfirmRequire;
    let {
      goodsModel,
      goodsName,
      goodsBrand,
      goodsPrice,
      depreciationRate,
      goodsNum,
    } = result;
    let goodsIds = [];

    for (let key in result) {
      if (key.indexOf(`${numingRule}`) !== -1 && result[key]) {
        goodsIds.push(result[key]);
      }
    }

    goodsIds = goodsIds.length ? goodsIds.join(',') : '';
    let parm = {
      url : 'outcome/goods/purchase',
      method : 'POST',
      data: {
        depreciationRate: Number(depreciationRate),
        goodsBrand,
        goodsIds,
        goodsModel,
        goodsName,
        goodsNum: Number(goodsNum),
        goodsPrice: Number(goodsPrice),
      },
      successFn : function (data) {
        if (RequestUtil.isResultSuccessful(data)) {
          window.location.href = '../SupplyExpend/index.html'; // 跳转到物资使用界面
        } else {
          let message = data.resultDesc;
          showConfirmRequire(message);
          console.log('get addrList error!');
        }
      },
      errorFn : function () {
        console.error(arguments);
      },
    };
    RequestUtil.fetch(parm);
  }

  render () {
    const {
      submitButtonBoolean,
      expendTypeResult,
      buyFormItemData,
      fixFormItemData,
      expendTypeFormItem,
      formItemCol,
      submitWrapperCol,
    } = this.state;
    let currentFormItemData = expendTypeFormItem;
    let submitButtonStyleObj = {};
    if (submitButtonBoolean) {
      if (expendTypeResult === typeSelectResult) {
        currentFormItemData = expendTypeFormItem.concat(buyFormItemData);
      } else {
        currentFormItemData = expendTypeFormItem.concat(fixFormItemData);
      }
      submitButtonStyleObj = { display: 'block' };
    } else {
      submitButtonStyleObj = { display: 'none' };
    }

    return (
      <MenuComp activeTab={3} subTitle="物资采购">
        <MyFormItem ref='myForm'
          formItemData={currentFormItemData}
          handleSubmit={this.handleSubmit}
          submitButtonStyleObj={submitButtonStyleObj}
          formItemCol={formItemCol}
          submitWrapperCol={submitWrapperCol}
          />
      </MenuComp>
    );
  }
}

PageComponent.propTypes = {
  form: PropTypes.object.isRequired,
};

const WrappedApp = Form.create()(PageComponent);

ReactDOM.render(<WrappedApp />, document.getElementById('app'));
