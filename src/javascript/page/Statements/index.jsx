import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MenuComp from 'components/MenuComp/MenuComp';
import Requirement from 'components/Requirement/Requirement';
import RequestUtil from 'extend/common/RequestUtil';
import ShZhTable from 'components/ShZhTable/ShZhTable';
import { Card, Col, Row, Tabs } from 'antd';
import LineComponent from 'components/Statements/Line';
import RoundComponent from 'components/Statements/Round';
import HistogramComponent from 'components/Statements/Histogram';
import moment from 'moment';
import 'scss/base.scss';
import 'scss/Statements/index.scss';

const TabPane = Tabs.TabPane;

class PageComponent extends Component {
  constructor (props) {
    super(props);

    this.state = {
      tabKey: '1',
      date: [],
      lineData: [],
      income: [],
      come: [],
      value: {},
      requireData: {},
      shopTreeSelect: [],
      typeTreeSelect: [],
      conditionTreeSelect: [],
      bbSours: [],
      reportDate:[],
      datalength:1,
      totalMenDian: [],
      quyuA: [],
      showdc: true,
    };
  }

  componentDidMount () {
    const that = this;
    let param = {
      url: 'shop/query',
      method: 'POST',
      data: {},
      successFn: function (data) {
        if (RequestUtil.isResultSuccessful(data)) {
          let arr = data.resultData;
          let mendianList = [];
          let totalMenDian = [];
          arr.map(function (item, index) {
            let list = item.list;
            let children = [];
            let num = index;
            mendianList.push({
              label: item.name,
              value: item.id,
              key: `0-${index}`,
              children: children,
            });
            list.map(function (item, index) {
              children.push({
                label: item.name,
                value: item.id,
                key: `0-${num}-${index}`,
              });
              totalMenDian.push(item.id);
            });
          });
          that.setState({
            shopTreeSelect: mendianList,
            totalMenDian: totalMenDian,
          }, () => {
            that.sendRequest();
          });
        }
      },
      errorFn: function () {
        console.error(arguments);
      },
    };
    RequestUtil.fetch(param);
  }

  callBack = (key) => {
    this.setState({
      tabKey: key,
    }, () => {
      this.sendRequest();
    });
  }

  getRequireData = (value) => {
    this.setState({
      value: value,
    }, () => {
      this.sendRequest();
    });
  }

  sendRequest = () => {
    let that = this;
    let value = this.state.value;
    let menDianTotal = this.state.totalMenDian;
    let dateYM = moment().format('YYYY-MM');
    let date = `${dateYM}-01`;
    let str = '';
    menDianTotal.map(function (item) {
      str += `${item},`;
    });
    let beginDate = date;
    let endDate = moment().format('YYYY-MM-DD');
    let unit = 'D';

    if (value.shop) {
      str = '';
      value.shop.map(function (item) {
        str += `${item},`;
      });
    }

    if (value.pickerUnit) {
      let units = value.pickerUnit;
      let endUnit = `${units}PickerEnd`;
      let beginUnit = `${units}PickerStart`;
      beginDate = value[beginUnit];
      if (units === 'Month') {
        beginDate = moment(value[beginUnit]).date(1).format('YYYY-MM-DD');
      }
      endDate = value[endUnit];
      unit = value.pickerUnit.substr(0, 1);
    }

    let sendData = {
      beginDate: beginDate,
      endDate: endDate,
      unit: unit,
      storeIds: str.substr(0, str.length - 1),
    };

    that.setState({
      dcvalue: sendData,
    });

    const dateStrStart = unit === 'D' ? 5 : 0;
    switch (this.state.tabKey) {
      case '1':
        let param1 = {
          url: 'overall/summarization',
          method: 'POST',
          data: sendData,
          successFn: function (data) {
            if (RequestUtil.isResultSuccessful(data)) {
              let incomeArr = data.resultData.incomeList;
              let outcomeArr = data.resultData.outcomeList;
              let date = []; // 就是values
              let lineData = []; // 就是linedate
              let lineDataRight = [];

              const dataArr = {
                income: incomeArr,
                outcome: outcomeArr,
              };
              const maxFlag = dataArr.income.length > dataArr.outcome.length ? 'income' : 'outcome';

              for (let i = 0; i < dataArr[maxFlag].length; i++) {
                const re = /-/g;
                let dateSub = dataArr[maxFlag][i].date.substr(dateStrStart).replace(re, '.');
                date.push(dateSub);

                // 若不存在 则变为空对象
                !incomeArr[i] && (incomeArr[i] = {});
                !outcomeArr[i] && (outcomeArr[i] = {});

                // 收支情况
                lineData.push({
                  'date': dateSub,
                  'money': incomeArr[i].amount || 0,
                  'type': '收入',
                });
                lineData.push({
                  'date': dateSub,
                  'money': outcomeArr[i].amount || 0,
                  'type': '支出',
                });

                // 收入走势
                lineDataRight.push({
                  'date': dateSub,
                  'money': incomeArr[i].chepeiAmount || 0,
                  'type': '车配',
                });
                lineDataRight.push({
                  'date': dateSub,
                  'money': incomeArr[i].shoujianAmount || 0,
                  'type': '收件',
                });
                lineDataRight.push({
                  'date': dateSub,
                  'money': incomeArr[i].paijianAmount || 0,
                  'type': '派件',
                });
                lineDataRight.push({
                  'date': dateSub,
                  'money': incomeArr[i].zhongbaoAmount || 0,
                  'type': '众包',
                });
              };

              let resultData = {
                date: date,
                lineData: lineData,
                lineDataRight: lineDataRight,
                totalIncome: data.resultData.totalIncome,
                totalOutcome: data.resultData.totalOutcome,
                totalProfit: data.resultData.totalProfit,
                totalProfitRate: data.resultData.totalProfitRate,
              };
              that.setState({
                requireData: resultData,
              });
            }
          },
          errorFn: function () {
            console.error(arguments);
          },
        };
        RequestUtil.fetch(param1);
        break;
      case '2':
        let param2 = {
          url: 'overall/constitute',
          method: 'POST',
          data: sendData,
          successFn: function (data) {
            if (RequestUtil.isResultSuccessful(data)) {
              let roundData = {
                incomeList: data.resultData.incomeList,
                outcomeList: data.resultData.outcomeList,
              };
              that.setState({
                requireData: roundData,
              });
            }
          },
          errorFn: function () {
            console.error(arguments);
          },
        };
        RequestUtil.fetch(param2);
        break;
      case '3':
        let param3 = {
          url: 'overall/storeReport',
          method: 'POST',
          data: sendData,
          successFn: function (data) {
            if (RequestUtil.isResultSuccessful(data)) {
              let histogramData = {
                incomeList: data.resultData.incomeList,
                outcomeList: data.resultData.outcomeList,
              };
              that.setState({
                requireData: histogramData,
              });
            }
          },
          errorFn: function () {
            console.error(arguments);
          },
        };
        RequestUtil.fetch(param3);
        break;
      case '4':
        let parambb = {
          url : 'overall/detailReport',
          method : 'POST',
          data : sendData,
          successFn : function (data) {
            if (RequestUtil.isResultSuccessful(data)) {
              that.runData(data);
            }
          },
          errorFn : function () {
            console.error(arguments);
          },
        };
        RequestUtil.fetch(parambb);
        break;
      default:
        console.log('it comes another world');
    }
  }

  runData = (data) => {
    let that = this;
    let jieguodata = [];
    let i = 0;
    let showdc = false;
    let quyu = 0;
    let quyuA = [];
    let dataSource = data.resultData;
    let reportDate = [];
    let redate = true;
    let datalength = 10;
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
          let income = {};
          let outcome = {};
          let profit = {};
          let datalist = {};
          let itemName = '';
          if (lists.length !== 0) {
            lists.forEach(function (item, index) {
              income[item.date] = item.income;
              outcome[item.date] = item.outcome;
              profit[item.date] = item.profit;
            });
            if (redate) {
              lists.forEach(function (item, index) {
                reportDate.push(item.date);
              });
              datalength = 120 * (reportDate.length + 3) - 80;
              redate = false;
            }
            for (var n = 0; n < 3; n++) {
              if (n === 0) {
                itemName = '收入';
                datalist = income;
              }
              if (n === 1) {
                itemName = '支出';
                datalist = outcome;
              }
              if (n === 2) {
                itemName = '利润';
                datalist = profit;
              }
              jieguodata[i] = {
                'areaName'  : areaName,
                'areaID'    : areaID,
                'storeName' : storeName,
                'storeID'   : storeID,
                'itemName'  : itemName,
                'list'      : datalist,
                'key'       : i,
              };
              quyu++;
              i++;
            };
          };
        });
        quyuA.push(quyu);
        quyu = 0;
      });
    });
    if (jieguodata.length === 0) {
      showdc = true;
    }
    that.setState({
      quyuA: quyuA,
      reportDate: reportDate,
      datalength: datalength,
      bbSours: jieguodata,
      showdc,
    });
    return jieguodata;
  }
  render () {
    const { shopTreeSelect, bbSours, reportDate, datalength, quyuA, dcvalue, showdc } = this.state;
    const RequirementInfo = {
      formItems: [
        {
          formName: 'DayPicker',
          formInfo: {
            dateRange: true,
            dateUnit: 'All',
          },
        }, {
          formName: 'ShopTreeSelect',
          formInfo: {},
        },
      ],
      getRequireData: this.getRequireData,
      shopTreeSelect,
    };

    const cardData = [
      { title: '总收入', data: this.state.requireData.totalIncome, unit: '元' },
      { title: '总支出', data: this.state.requireData.totalOutcome, unit: '元' },
      { title: '总利润', data: this.state.requireData.totalProfit, unit: '元' },
      { title: '利润率', data: this.state.requireData.totalProfitRate, unit: '%' },
    ];
    return (
      <MenuComp activeTab={1} subTitle="收支报表">
        <div>
          <Requirement {...RequirementInfo} />

          <Tabs defaultActiveKey="1" onChange={this.callBack} tabBarStyle={{ backgroundColor: 'white' }}>
            <TabPane tab="收支走势" key="1">
              <Row gutter={16}>
                {cardData.map((item, index) => (
                  <Col span="6" key={index}>
                    <Card>
                      <div className="display-money">
                        <p>{item.title}</p>
                        <p><b>{item.data || '0.00'}</b>{item.unit}</p>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
              <Row gutter={16} style={{ marginTop: 18 }}>
                <Col md={{ span: 24 }} lg={{ span:12 }}>
                  <Card>
                    <p style={{ fontSize:16 }}>收支情况</p>
                    <LineComponent
                      date={this.state.requireData.date || []}
                      lineData={this.state.requireData.lineData || []}
                      lineIndex={1}
                    />
                  </Card>
                </Col>
                <Col md={{ span: 24 }} lg={{ span:12 }}>
                  <Card>
                    <p style={{ fontSize:16 }}>收入走势</p>
                    <LineComponent
                      date={this.state.requireData.date || []}
                      lineData={this.state.requireData.lineDataRight || []}
                      lineIndex={2}
                    />
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="收支构成" key="2">
              <Row gutter={16}>
                <Col span={12}>
                  <Card style={{ height: 400 }}>
                    <p style={{ fontSize:16 }}>收入构成 - 项目</p>
                    <RoundComponent income={this.state.requireData.incomeList || []} roundIndex={0} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card style={{ height: 400 }}>
                    <p style={{ fontSize:16 }}>支出构成</p>
                    <RoundComponent income={this.state.requireData.outcomeList || []} roundIndex={1} />
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="门店情况" key="3">
              <Row gutter={16}>
                <Col span={12}>
                  <Card style={{ height: 400 }}>
                    <p style={{ fontSize:16 }}>收入情况</p>
                    <HistogramComponent come={this.state.requireData.incomeList || []} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card style={{ height: 400 }}>
                    <p style={{ fontSize:16 }}>支出情况</p>
                    <HistogramComponent come={this.state.requireData.outcomeList || []} />
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="收支报表" key="4">
              <ShZhTable
                bbSours={bbSours}
                reportDate={reportDate}
                datalength={datalength}
                quyuA={quyuA}
                dcvalue={dcvalue}
                showdc={showdc}
                />
            </TabPane>
          </Tabs>
        </div>
      </MenuComp>
    );
  }
}

ReactDOM.render(<PageComponent />, document.getElementById('app'));
