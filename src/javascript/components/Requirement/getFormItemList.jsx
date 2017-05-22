const getFormItemData = (id, ctx) => {
  const baseCol = {
    style: { width: '100%' },
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  const baseDayPicker = {
    id: 'datePicker',
    formOpts: {
      label: '日期',
      ...baseCol,
      doHelp: true,
      doValidateStatus: true,
    },
  };
  const baseTreeSelectElem = {
    showSearch: true,
    multiple: true,
    treeDefaultExpandAll: true,
    treeCheckable: true,
    treeNodeFilterProp: 'label',
    searchPlaceholder: '请输入类型',
  };
  const baseTreeSelect = {
    ...baseCol,
    doHelp: true,
    doValidateStatus: true,
  };
  const formItemList = {
    DayPicker: {
      ...baseDayPicker,
      elemName: 'DatePicker',
      elemOpts: {
        allowClear: false,
        disabledDate: ctx.disabledEndDate,
        style: { width: '100%' },
      },
      opts: {
        // rules: [{ type: 'object', required: true, message: 'Please select time!' }],
        // getValueFromEvent: value => this.getValueFromEvent(value),
      },
    },
    DayPickerStart: {
      ...baseDayPicker,
      elemName: 'DatePicker',
      elemOpts: {
        allowClear: false,
        disabledDate: ctx.disabledStartDate,
        style: { width: '100%' },
      },
      opts: {
        // rules: [{ type: 'object', required: true, message: '请选择开始时间!' }],
        getValueFromEvent: ctx.handleStartChange,
      },
    },
    DayPickerEnd: {
      ...baseDayPicker,
      elemName: 'DatePicker',
      elemOpts: {
        allowClear: false,
        disabledDate: ctx.disabledEndDate,
        style: { width: '100%' },
      },
      opts: {
        // rules: [{ type: 'object', required: true, message: '请选择结束时间!' }],
        getValueFromEvent: ctx.handleEndChange,
      },
    },
    MonthPickerStart: {
      ...baseDayPicker,
      elemName: 'MonthPicker',
      elemOpts: {
        disabledDate: ctx.disabledStartDate,
        style: { width: '100%' },
      },
      opts: {
        // rules: [{ type: 'object', required: true, message: '请选择开始时间!' }],
        getValueFromEvent: ctx.handleStartChange,
      },
    },
    MonthPickerEnd: {
      ...baseDayPicker,
      elemName: 'MonthPicker',
      elemOpts: {
        disabledDate: ctx.disabledEndDate,
        style: { width: '100%' },
      },
      opts: {
        // rules: [{ type: 'object', required: true, message: '请选择结束时间!' }],
        getValueFromEvent: ctx.handleEndChange,
      },
    },
    UnitSelect: {
      id: 'pickerUnit',
      opts: {
        // rules: [{ type: 'string', required: true, message: 'Please select time!' }],
        getValueFromEvent: ctx.handleUnitChange,
      },
      elemName: 'Select',
      elemOpts: {
        placeholder: '请选择时间单位',
      },
      elemChild: [
        { value: 'Day', label: '日' },
        { value: 'Week', label: '周' },
        { value: 'Month', label: '月' },
      ],
      formOpts: {
        label: '时间单位',
        ...baseCol,
        doHelp: true,
        doValidateStatus: true,
      },
    },
    Input: {
      id: 'userName',
      opts: {
        validateTrigger: 'onBlur',
        // rules: [{ required: true, message: '请输入对应信息!' }],
      },
      elemName: 'Input',
      formOpts: {
        label: '时间单位',
        ...baseCol,
        doHelp: true,
        doValidateStatus: true,
      },
    },
    ShopTreeSelect: {
      id: 'shop',
      elemName: 'TreeSelect',
      elemOpts: {
        ...baseTreeSelectElem,
        treeData: ctx.props.shopTreeSelect,
        searchPlaceholder: '请选择门店',
      },
      opts: {
        // rules: [{ required: true, message: '请选择门店!' }],
      },
      formOpts: {
        ...baseTreeSelect,
        label: '所属门店',
      },
    },
    typeTreeSelect: {
      id: 'type',
      elemName: 'Select',
      elemOpts: {
        placeholder: '请选择类型',
      },
      elemChild: ctx.props.typeTreeSelect,
      opts: {
        // rules: [{ required: true, message: '请选择类型!' }],
      },
      formOpts: {
        ...baseTreeSelect,
        label: '支出类型',
      },
    },
    conditionTreeSelect: {
      id: 'condition',
      elemName: 'Select',
      elemOpts: {},
      elemChild: ctx.props.conditionTreeSelect,
      opts: {
        // rules: [{ required: true, message: '请选择使用状况!' }],
      },
      formOpts: {
        ...baseTreeSelect,
        label: '使用状况',
      },
    },
  };
  return formItemList[id];
};

export default getFormItemData;
