import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MenuComp from 'components/MenuComp/MenuComp';
import moment from 'moment';
import Requirement from 'components/Requirement/Requirement';
import DateTitle from 'components/DateTitle/DateTitle';
import RequestUtil from 'extend/common/RequestUtil';
// import Util from 'extend/common/Util';
import 'scss/base.scss';
import 'scss/Income/index.scss';
import { Table, Modal, Button, DatePicker } from 'antd';
import 'moment/locale/zh-cn';
import config from '../../config/config.json';
moment.locale('zh-cn');

class PageComponent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      nodate: [
        moment().weekday(0).format('YYYY-MM-DD'),
        moment().weekday(1).format('YYYY-MM-DD'),
        moment().weekday(2).format('YYYY-MM-DD'),
        moment().weekday(3).format('YYYY-MM-DD'),
        moment().weekday(4).format('YYYY-MM-DD'),
        moment().weekday(5).format('YYYY-MM-DD'),
        moment().weekday(6).format('YYYY-MM-DD'),
      ],
      requireData: {},
      dcvisible: false,
      reportDate: [],
      value:{},
      startValue: null,
      endValue: null,
      dcdate:{
        beginDate: moment().format('YYYY-MM') + '-01',
        endDate: moment().format('YYYY-MM-DD'),
      },
      dataSource: [],
      shopTreeSelect: [],
      showbutton: false,
      quyuA: [],
      allstoreIds: '',
    };
  }

  showdcModal = () => {
    this.setState({
      dcvisible: true,
    });
  }

  handleCancel = () => {
    this.setState({
      dcvisible: false,
    });
  }

  turndata = (Source) => {
    let jieguodata = [];
    let i = 0;
    const that = this;
    let dataSource = Source.resultData;
    let allstoreIds = [];
    const myMap = new Map();
    myMap.set(dataSource);
    myMap.forEach(function (value, key) {
      key.forEach(function (value, key) {
        let children = [];
        let lists = value.list;
        let j = 0;
        lists.forEach(function (value, key) {
          let chs = {
            'label': value.name,
            'value': value.id,
            'key': '0-' + i + '-' + j,
          };
          allstoreIds.push(value.id);
          children.push(chs);
          j++;
        });
        jieguodata[i] = {
          'value': value.id,
          'label': value.name,
          'children': children,
          'key': '0-' + i,
        };
        i++;
      });
    });
    that.setState({
      allstoreIds: allstoreIds.join(','),
    });
    return jieguodata;
  }

  componentDidMount () {
    const that = this;
    this.setState({
      shopTreeSelect: [],
    });
    let param = {
      url : 'shop/query',
      method : 'POST',
      data: {},
      successFn : function (data) {
        if (RequestUtil.isResultSuccessful(data)) {
          let datas = that.turndata(data);
          that.setState({
            shopTreeSelect: datas,
          }, () => {
            that.getRefreshData();
          });
        }
      },
      errorFn : function () {
        console.error(arguments);
      },
    };
    RequestUtil.fetch(param);
  }

  getRefreshData = () => {
    let { value, allstoreIds } = this.state;
    let that = this;
    let data = {};
    if (JSON.stringify(value) === '{}') {
      data = {
        'date': moment().format('YYYY-MM-DD'),
        'storeIds': allstoreIds,
      };
    } else {
      let stids = value.shop ? value.shop.join(',') : allstoreIds;
      data = {
        'date': value.datePicker,
        'storeIds': stids,
      };
    };

    let paraminq = {
      url : 'income/query',
      method : 'POST',
      data: data,
      successFn : function (data) {
        if (RequestUtil.isResultSuccessful(data)) {
          that.reData(data);
        }
      },
      errorFn : function () {
        console.error(arguments);
      },
    };
    RequestUtil.fetch(paraminq);
  }

  getRequireData = (value) => {
    let that = this;
    that.setState({
      value: value,
    }, () => {
      this.getRefreshData();
    });
  }

  reData = (data) => {
    let that = this;
    // let m = true;
    let reportDate = [];
    let jieguodata = [];
    let i = 0;
    let quyu = 0;
    let quyuA = [];
    let dataSource = data.resultData;
    const myMap = new Map();
    myMap.set(dataSource);
    myMap.forEach(function (value, key) {
      key.forEach(function (value, key) {
        let areaName = value.name;
        let areaID = value.id;
        let list = value.list;
        list.forEach(function (value, key) {
          let storeName = value.name;
          let storeID = value.id;
          let lists = value.list;
          let chepeiA = ['', '', '', '', '', '', '', ''];
          let chepeiN = ['', '', '', '', '', '', '', ''];
          let paijianA = ['', '', '', '', '', '', '', ''];
          let paijianN = ['', '', '', '', '', '', '', ''];
          let shoujianA = ['', '', '', '', '', '', '', ''];
          let shoujianN = ['', '', '', '', '', '', '', ''];
          let zhongbaoA = ['', '', '', '', '', '', '', ''];
          let zhongbaoN = ['', '', '', '', '', '', '', ''];
          let listA = ['', '', '', '', '', '', '', ''];
          let listN = ['', '', '', '', '', '', '', ''];
          let listP;
          for (let j = 0; j < lists.length; j++) {
            if ((j === (lists.length - 1)) || lists.date === '总计') {
              chepeiA[7] = (lists[j].chepeiAmount);
              chepeiN[7] = (lists[j].chepeiNum);
              paijianA[7] = (lists[j].paijianAmount);
              paijianN[7] = (lists[j].paijianNum);
              shoujianA[7] = (lists[j].shoujianAmount);
              shoujianN[7] = (lists[j].shoujianNum);
              zhongbaoA[7] = (lists[j].zhongbaoAmount);
              zhongbaoN[7] = (lists[j].zhongbaoNum);
            } else {
              if (lists[j]) {
                const weekdayIndex = moment(lists[j].date).weekday();
                chepeiA[weekdayIndex] = (lists[j].chepeiAmount);
                chepeiN[weekdayIndex] = (lists[j].chepeiNum);
                paijianA[weekdayIndex] = (lists[j].paijianAmount);
                paijianN[weekdayIndex] = (lists[j].paijianNum);
                shoujianA[weekdayIndex] = (lists[j].shoujianAmount);
                shoujianN[weekdayIndex] = (lists[j].shoujianNum);
                zhongbaoA[weekdayIndex] = (lists[j].zhongbaoAmount);
                zhongbaoN[weekdayIndex] = (lists[j].zhongbaoNum);
              }
            }
          }
          // m = false;
          for (var n = 0; n < 4; n++) {
            if (n === 0) {
              listA = shoujianA;
              listN = shoujianN;
              listP = '快件收件';
            } else if (n === 1) {
              listA = paijianA;
              listN = paijianN;
              listP = '快件派件';
            } else if (n === 2) {
              listA = chepeiA;
              listN = chepeiN;
              listP = '车配网';
            } else if (n === 3) {
              listA = zhongbaoA;
              listN = zhongbaoN;
              listP = '众包';
            }
            jieguodata[i] = {
              'areaName'  : areaName,
              'areaID'    : areaID,
              'storeName' : storeName,
              'storeID'   : storeID,
              'itemName'  : listP,
              'listA1'    : listA[0],
              'listN1'    : listN[0],
              'listA2'    : listA[1],
              'listN2'    : listN[1],
              'listA3'    : listA[2],
              'listN3'    : listN[2],
              'listA4'    : listA[3],
              'listN4'    : listN[3],
              'listA5'    : listA[4],
              'listN5'    : listN[4],
              'listA6'    : listA[5],
              'listN6'    : listN[5],
              'listA7'    : listA[6],
              'listN7'    : listN[6],
              'listAw'    : listA[7],
              'listNw'    : listN[7],
              'keys'      : i,
            };
            quyu++;
            i++;
          }
        });
        quyuA.push(quyu);
        quyu = 0;
      });
    });
    that.setState({
      quyuA: quyuA,
      dataSource: jieguodata,
      reportDate: reportDate,
    });
    return jieguodata;
  }

  onbChange = (date, dateString, current) => {
    const { endValue } = this.state;
    let showb = true;
    if (endValue) {
      showb = !(date < endValue);
    }
    this.setState({
      showbutton: showb,
      dcdate: {
        'beginDate': dateString,
      },
      startValue: date,
    });
  }
  oneChange = (date, dateString, current) => {
    const { startValue } = this.state;
    let showb = true;
    if (startValue) {
      showb = !(date > startValue);
    }
    this.setState({
      showbutton: showb,
      dcdate: {
        'endDate': dateString,
      },
      endValue: date,
    });
  }
  dcClick = () => {
    let submitButton = this.refs.submit;
    submitButton.click();
  }

  disabledDate = (current) => {
    if (current) {
      // alert('1');
    }
    return (
      current && (
        current.valueOf() > Date.now()
        ) && (current.valueOf() + 2678400000));
  }

  getColumns = () => {
    const { nodate, quyuA, value } = this.state;
    // let clonedDate = Util.deepClone(reportDate);

    let requiredDate = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];
    value && value.datePicker &&
      (requiredDate = requiredDate.map((item, index) => moment(value.datePicker).weekday(index).format('YYYY-MM-DD')));

    return [
      {
        title: '区域',
        dataIndex: 'areaName',
        key: 'areaName',
        width: 100,
        fixed: 'left',
        render: (text, row, index) => {
          const obj = {
            children: text,
            props: {},
          };
          if (index === 0 && quyuA[0]) {
            obj.props.rowSpan = quyuA[0];
          } else if ((index === quyuA[0]) && quyuA[1]) {
            obj.props.rowSpan = quyuA[1];
          } else if ((index === (quyuA[0] + quyuA[1])) && quyuA[2]) {
            obj.props.rowSpan = quyuA[2];
          } else if ((index === (quyuA[0] + quyuA[1] + quyuA[2])) && quyuA[3]) {
            obj.props.rowSpan = quyuA[3];
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '门店',
        className: 'm-tabletitle',
        dataIndex: 'storeName',
        key: 'storeName',
        width: 80,
        fixed: 'left',
        render: (text, row, index) => {
          const obj = {
            children: text,
            props: {},
          };
          if (index % 4 === 0) {
            obj.props.rowSpan = 4;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '项目',
        dataIndex: 'itemName',
        className: 'm-tabletitle',
        key: 'itemName',
        width: 80,
        fixed: 'left',
      },
      {
        title: <DateTitle reda={requiredDate[0] || nodate[0]} getRefreshData={this.getRefreshData} />,
        children: [{
          title: '业务量',
          dataIndex: 'listN1',
          key: 'listN1',
          width: 80,
        },
        {
          title: '业务收入',
          dataIndex: 'listA1',
          key: 'listA1',
          width: 80,
        },
        ],
      },
      {
        title: <DateTitle reda={requiredDate[1] || nodate[1]} getRefreshData={this.getRefreshData} />,
        children: [{
          title: '业务量',
          dataIndex: 'listN2',
          key: 'listN2',
          width: 80,
        },
        {
          title: '业务收入',
          dataIndex: 'listA2',
          key: 'listA2',
          width: 80,
        },
        ],
      },
      {
        title: <DateTitle reda={requiredDate[2] || nodate[2]} getRefreshData={this.getRefreshData} />,
        children: [{
          title: '业务量',
          dataIndex: 'listN3',
          key: 'listN3',
          width: 80,
        },
        {
          title: '业务收入',
          dataIndex: 'listA3',
          key: 'listA3',
          width: 80,
        }],
      },
      {
        title: <DateTitle reda={requiredDate[3] || nodate[3]} getRefreshData={this.getRefreshData} />,
        children: [{
          title: '业务量',
          dataIndex: 'listN4',
          key: 'listN4',
          width: 80,
        },
        {
          title: '业务收入',
          dataIndex: 'listA4',
          key: 'listA4',
          width: 80,
        }],
      },
      {
        title: <DateTitle reda={requiredDate[4] || nodate[4]} getRefreshData={this.getRefreshData} />,
        children: [{
          title: '业务量',
          dataIndex: 'listN5',
          key: 'listN5',
          width: 80,
        },
        {
          title: '业务收入',
          dataIndex: 'listA5',
          key: 'listA5',
          width: 80,
        }],
      },
      {
        title: <DateTitle reda={requiredDate[5] || nodate[5]} getRefreshData={this.getRefreshData} />,
        children: [{
          title: '业务量',
          dataIndex: 'listN6',
          key: 'listN6',
          width: 80,
        }, {
          title: '业务收入',
          dataIndex: 'listA6',
          key: 'listA6',
          width: 80,
        }],
      },
      {
        title: <DateTitle reda={requiredDate[6] || nodate[6]} getRefreshData={this.getRefreshData} />,
        children: [{
          title: '业务量',
          dataIndex: 'listN7',
          key: 'listN7',
          width: 80,
        },
        {
          title: '业务收入',
          dataIndex: 'listA7',
          key: 'listA7',
          width: 80,
        }],
      },
      {
        title: '总计',
        children: [{
          title: '业务量',
          dataIndex: 'listNw',
          key: 'listNw',
          width: 100,
        },
        {
          title: '业务收入',
          dataIndex: 'listAw',
          key: 'listAw',
          width: 100,
        }],
      },
    ];
  }
  disabledStartDate = (sValue) => {
    const { endValue } = this.state;
    if (!sValue) {
      return false;
    }

    const tomorrow = moment().hour(24).set({ 'hour': '0', 'minute': '0', 'second': '0' });
    if (sValue.valueOf() > tomorrow.valueOf()) {
      return true;
    }

    if (!endValue) {
      return false;
    }
    return sValue.valueOf() > endValue.valueOf() ||
      (sValue.valueOf() <= moment(endValue).add(-31, 'days').valueOf());
  }

  disabledEndDate = (eValue) => {
    const { startValue } = this.state;
    const tomorrow = moment().hour(24).set({ 'hour': '0', 'minute': '0', 'second': '0' });
    if (eValue && eValue.valueOf() > tomorrow.valueOf()) {
      return true;
    }
    if (!eValue || !startValue) {
      return false;
    }

    return (eValue.valueOf() <= startValue.valueOf()) ||
      (eValue.valueOf() > moment(startValue).add(31, 'days').valueOf()) ||
      (eValue.valueOf() > tomorrow.valueOf());
  }

  render () {
    const {
      shopTreeSelect,
      dataSource,
      dcvisible,
      confirmLoading,
      showbutton,
      dcdate,
    } = this.state;
    const columns = this.getColumns();
    const RequirementInfo = {
      formItems: [
        {
          formName: 'DayPicker',
          formInfo: {
            dateRange: false,
          },
        }, {
          formName: 'ShopTreeSelect',
          formInfo: {},
        },
      ],
      getRequireData: this.getRequireData,
      shopTreeSelect,
    };
    return (
      <MenuComp activeTab={2} subTitle="门店收入日报">
        <div>
          <Requirement {...RequirementInfo} />
          <div className='m-income'>
            <Button
              onClick={this.showdcModal}
              className='m-btn2'
              type="primary"
              size='large'
              style={{ width: '80px', marginBottom: '10px' }}
            >导出</Button>
            <div className='m-table'>
              <Table
                size='middle'
                dataSource={dataSource}
                rowKey="keys"
                pagination={false}
                columns={columns}
                scroll={{ x: 1550, y: 450 }}
                bordered
                width={''}
              />
              <Modal
                wrapClassName='vertical-center-modal'
                visible={dcvisible}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
                maskClosable={false}
                okText='确认'
                footer={null}
                >
                <span>导出以下时段数据为Excel（最大时间跨度为31天)</span>
                <br />
                <div>
                开始时间：<DatePicker
                  onChange={this.onbChange}
                  disabledDate={this.disabledStartDate}
                  format={'YYYY-MM-DD'}
                  allowClear={false}
                  />
                  <br />
                结束时间：<DatePicker
                  onChange={this.oneChange}
                  disabledDate={this.disabledEndDate}
                  format={'YYYY-MM-DD'}
                  allowClear={false}
                  />
                </div>
                <Button
                  onClick={this.dcClick}
                  disabled={showbutton}
                  className='m-btn2'
                  type="primary"
                  size='large'
                >导出</Button>
              </Modal>
            </div>
          </div>
          <form
            action={config[config.current] + 'income/excel/export'}
            encType="multipart/form-data"
            method="post"
            style={{ display: 'none' }}>
            开始时间:
              <input type="text" name="beginDate" value={dcdate.beginDate} readOnly /><br />
            结束时间:<br />
            <input type="text" name="endDate" value={dcdate.endDate} readOnly /><br />
            <input type="submit" value="Submit" ref="submit" />
          </form>
        </div>
      </MenuComp>
    );
  }
}

ReactDOM.render(<PageComponent />, document.getElementById('app'));
