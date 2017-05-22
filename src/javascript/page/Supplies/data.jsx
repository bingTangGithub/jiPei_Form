
export default class SuppliesData {
   // 表格大小
  static formItemCol = {
    labelCol: { span: 6 },
    wrapperCol: { span: 8 },
  };

// 按钮大小
  static submitWrapperCol = {
    span: 8,
    offset: 2,
  };
  // 提交前提示
  static messageContent = `数据录入后不能修改，请检查无误后提交。
                         是否确认提交？`;
   /**
 * [表格表头数据]
 * @param  {[function]} callback [description]
 */
  static columns = [
    {
      title: '门店',
      dataIndex: 'storeName',
      key: 'storeName',
    }, {
      title: '支出类型',
      dataIndex: 'otherOutcomeType',
      key: 'otherOutcomeType',
    }, {
      title: '金额（元）',
      dataIndex: 'price',
      key: 'price',
    }, {
      title: '开始时间',
      dataIndex: 'startDate',
      key: 'startDate',
    }, {
      title: '到期时间',
      dataIndex: 'endDate',
      key: 'endDate',
    }, {
      title: '缴费时间',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
    }, {
      title: '有效期（日）',
      dataIndex: 'expirationDays',
      key: 'expirationDays',
    }, {
      title: '日均支出（元）',
      dataIndex: 'outcomeAvg',
      key: 'outcomeAvg',
    }, {
      title: '支出说明',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];
  /**
 * [增加表单时，表单数据]
 * @param  {[function]} callback [description]
 */
  static addFormItemData = [
    {
      label: '门店',
      id: 'storeId',
      rules: [
            { required: true, message: '门店不能为空!' },
      ],
      // getValueFromEvent:  this.handleStoreNameChange,
      type: 'treeSelect',
      treeData: [],
      value: '',
    },
    {
      label: '支出类型',
      id: 'otherOutcomeType',
      rules: [
            { required: true, message: '支出类型不能为空!' },
      ],
      // getValueFromEvent:  this.handleOtherOutcomeTypeChange,
      type: 'select',
      options: [],
    },
    {
      label: '金额',
      id: 'price',
      rules: [
              { required: true, message: '金额不能为空!' },
              { pattern: /^[0-9]+(.[0-9]{2})?$/, message: '金额必须为正数且最多两位小数!' }],
      type: 'input',
      suffix: '元',
    },
    {
      label: '开始时间',
      id: 'beginDate',
      // disabledDate:
      rules: [
            { required: true, message: '开始时间不能为空!' },
      ],
      type: 'picker',
    },
    {
      label: '结束时间',
      id: 'endDate',
      // disabledDate:
      rules: [
            { required: true, message: '结束时间不能为空!' },
      ],
      type: 'picker',
    },
    {
      label: '缴费时间',
      id: 'paymentDate',
      rules: [
            { required: true, message: '缴费时间不能为空!' },
      ],
      type: 'picker',
    },
    {
      label: '说明',
      id: 'remark',
      type: 'input',
    },
  ];

  /**
 * [支出类型可选项]
 * @param  {[function]} callback [description]
 */
  static typeTreeSelect = [
    {
      label:'房屋租金',
      value: 'fangwuzujin',
      key: '0',
    },
    {
      label:'物业费',
      value: 'wuyefei',
      key: '1',
    },
    {
      label:'维修费',
      value: 'weixiufei',
      key: '2',
    },
    {
      label:'装修费',
      value: 'zhuangxiufei',
      key: '3',
    },
    {
      label:'宽带费',
      value: 'kuandaifei',
      key: '4',
    },
    {
      label:'通信费',
      value: 'tongxinfei',
      key: '5',
    },
    {
      label:'易耗品',
      value: 'yihaopin',
      key: '6',
    },
    {
      label:'电费',
      value: 'dianfei',
      key: '7',
    },
    {
      label:'水费',
      value: 'shuifei',
      key: '8',
    },
    {
      label:'薪酬',
      value: 'xinchou',
      key: '9',
    },
  ];
   /**
 * [将表单中的拼音转化为汉字显示]
 * @param  {[function]} callback [description]
 */
  static transformEN (res) {
    let result;
    let otherOutcomeTypeObj = {
      'fangwuzujin': '房屋租金',
      'wuyefei': '物业费',
      'weixiufei': '维修费',
      'zhuangxiufei': '装修费',
      'kuandaifei': '宽带费',
      'tongxinfei': '通信费',
      'yihaopin': '易耗品',
      'dianfei': '电费',
      'shuifei': '水费',
      'xinchou': '薪酬',
    };
    for (let key in otherOutcomeTypeObj) {
      if (key === res) {
        result = otherOutcomeTypeObj[key];
      }
    }
    return result;
  }
}
