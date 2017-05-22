import React, { Component } from 'react';
import 'scss/base.scss';
import 'scss/SupplyExpend/index.scss';
import PropTypes from 'prop-types';
import RequestUtil from 'extend/common/RequestUtil';
import { Table } from 'antd';
import moment from 'moment';

export default class Record extends Component {
  static propTypes = {
    goodsEntityId: PropTypes.string,
  }
  constructor (props) {
    super(props);
    this.state = {
      goodsEntityId: this.props.goodsEntityId,
      jlSoures: [],
      jlcolumns: [
        {
          title: '门店',
          dataIndex: 'storeName',
          key: 'storeName',
          width: 80,
        },
        {
          title: '使用部门',
          dataIndex: 'storeDep',
          key: 'storeDep',
          width: 80,
        },
        {
          title: '责任人',
          dataIndex: 'charge',
          key: 'charge',
          width: 80,
        },
        {
          title: '领用时间',
          dataIndex: 'useDate',
          key: 'useDate',
          width: 100,
        },
        {
          title: '归还/报废时间',
          dataIndex: 'returnDate',
          key: 'returnDate',
          width: 100,
          render: (text, row, index) => {
            if (text === '') {
              return '未归还';
            }
            return (moment(text).format(' YYYY-MM-DD '));
          },
        },
        {
          title: '本次累计支出',
          dataIndex: 'outcomeTotal',
          key: 'outcomeTotal',
          width: 80,
        },
      ],
    };
  }

  turnData = (e) => {
    let jieguodata = [];
    let dataSource = e.resultData.list;
    const myMap = new Map();
    myMap.set(dataSource);
    myMap.forEach(function (value, key) {
      jieguodata = key;
      jieguodata.forEach(function (value, key) {
        value.key = key;
      });
    });
    this.setState({
      jlSoures : jieguodata,
    });
    return jieguodata;
  }

  componentDidMount () {
    const that = this;
    const goodsEntityId = this.state.goodsEntityId;
    let paramjl = {
      url : 'outcome/goods/record',
      method : 'POST',
      data: { goodsEntityId },
      successFn : function (data) {
        if (RequestUtil.isResultSuccessful(data)) {
          that.turnData(data);
        }
      },
      errorFn : function () {
        console.error(arguments);
      },
    };
    RequestUtil.fetch(paramjl);
  }

  render () {
    return (
      <Table
        size='middle'
        dataSource={this.state.jlSoures}
        rowKey="key"
        columns={this.state.jlcolumns}
        bordered
              />);
  }
}
