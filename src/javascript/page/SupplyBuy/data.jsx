
export default class SupplyBuyData {
 // 表格大小
  static formItemCol = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };

// 按钮大小
  static submitWrapperCol = {
    span: 6,
    offset: 6,
  };

// [确定提交的提示]
  static messageContentConfirm = `只有登记编号的物资可纪录维修费用，
                请为有维修可能性的物资创建编号;
                数据录入后不能修改，请检查无误后提交。是否确认提交？`;
  static messageRepairConfirm = `
                数据录入后不能修改，请检查无误后提交。是否确认提交？`;

   /**
  }
 * [页面初始化时出现的数据]
 * @param  {[function]} callback [description]
 */
  static expendTypeFormItem = [
    {
      label: '支出类型',
      id: 'expendType',
      rules: [
            { required: true, message: '支出类型不能为空!' },
      ],
          // getValueFromEvent: this.handleExpendTypeChange,
      type: 'select',
      options: [
            { id: 0, value: 'purchase', label: '采购', key:  0 },
            { id: 1, value: 'repair', label: '维修', key:  1 },
      ],
    },
  ];
  /**
 * [支出类型选择采购出现的表单]
 * @param  {[function]} callback [description]
 */
  static buyFormItemData = [
    {
      label: '物资名称',
      id: 'goodsName',
      rules: [
            { required: true, message: '物资名称不能为空!' },
      ],
      type: 'input',
    },
    {
      label: '品牌',
      id: 'goodsBrand',
      rules: [
            { required: true, message: '品牌不能为空!' },
      ],
      type: 'input',
    },
    {
      label: '型号',
      id: 'goodsModel',
      rules: [
            { required: true, message: '型号不能为空!' },
      ],
      type: 'input',
    },
    {
      label: '单价',
      id: 'goodsPrice',
      rules: [
            { required: true, message: '单价不能为空!' },
            { pattern: /^[0-9]+(.[0-9]{2})?$/, message: '单价必须为正数且最多两位小数!' }],
      type: 'input',
      suffix: '元',
    },
    {
      label: '折旧率',
      id: 'depreciationRate',
      rules: [
            { required: true, message: '折旧率不能为空!' },
            { pattern: /^[0-9]+(.[0-9]{2})?$/, message: '折旧率必须为正数且最多两位小数!' },
      ],
      type: 'input',
      suffix: '月',
    },
    {
      label: '数量',
      id: 'goodsNum',
      rules: [
            { required: true, message: '数量不能为空!' },
      ],
      // getValueFromEvent: this.handleQuantityChange,
      type: 'select',
      // options: this.genQuantitySelectOptions(),

      // value: 2,
      // defaultValue: 2,
      children: [
            {},
            {},
      ],
    },
    // {
    //   label: `编号1`,
    //   id: `numingRule1`,
    //   type: 'input',
    // },
    // {
    //   label: `编号2`,
    //   id: `numingRule2`,
    //   type: 'input',
    // },
  ];

  /**
 * [支出类型选择维修出现的表单]
 * @param  {[function]} callback [description]
 */
  static fixFormItemData = [
    {
      label: '编号',
      id: 'goodsId',
      rules: [
            { required: true, message: '编号选择不能为空!' },
      ],
          // getValueFromEvent: this.handleNumberChange,
      type: 'select',
      options: '', // 接口获取
    },
    {
      label: '维修费用',
      id: 'repairFee',
      rules: [
            { required: true, message: '维修费用不能为空!' },
            { pattern: /^[0-9]+(.[0-9]{2})?$/, message: '维修费用必须为正数且最多两位小数!' },
      ],
      type: 'input',
      suffix: '元',
    },
  ];
}
