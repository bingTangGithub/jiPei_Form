import React, { Component } from 'react';
import { Table, Button } from 'antd';
import PropTypes from 'prop-types';
import Util from 'extend/common/Util';
import config from '../../config/config.json';

export default class ShZhTable extends Component {
  static propTypes = {
    bbSours: PropTypes.array,
    reportDate: PropTypes.array,
    datalength: PropTypes.number,
    quyuA: PropTypes.array,
    dcvalue: PropTypes.object,
    showdc: PropTypes.bool,
  }

  constructor (props) {
    super(props);
    this.state = {
      bbSours: this.props.bbSours,
      repDate: this.props.reportDate,
      reportDate: this.props.reportDate,
      datalength: this.props.datalength,
      dcvalue: this.props.dcvalue,
      dw: window.innerWidth,
      showdc : this.props.showdc,
    };
  }

  btnClick = (e) => {
    let submitButton = this.refs.submit;
    submitButton.click();
  }

  handleResize = (e) => {
    this.setState({ dw: window.innerWidth });
    // console.log(this.state.windowWidth);
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize);
  }

  getDateElem = () => {
    const { reportDate, datalength, quyuA } = this.props;
    let columns1 = [{
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
      dataIndex: 'storeName',
      key: 'storeName',
      width: 100,
      fixed: 'left',
      render: (text, row, index) => {
        const obj = {
          children: text,
          props: {},
        };
        if (index % 3 === 0) {
          obj.props.rowSpan = 3;
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      },
    },
    {
      title: '业务量',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 80,
      fixed: 'left',
    },
    ];
    let columns2 = [{
      title: '区域',
      dataIndex: 'areaName',
      key: 'areaName',
      width: 150,
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
      dataIndex: 'storeName',
      key: 'storeName',
      width: 150,
      render: (text, row, index) => {
        const obj = {
          children: text,
          props: {},
        };
        if (index % 3 === 0) {
          obj.props.rowSpan = 3;
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      },
    },
    {
      title: '业务量',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 150,
    },
    ];
    const columns = datalength > 600 ? Util.deepClone(columns1) : Util.deepClone(columns2);
    const clonedDate = Util.deepClone(reportDate);
    let { dw } = this.state;
    let ddw = dw - 320;
    for (let n = 0; n < reportDate.length; n++) {
      let colms = {};
      let dataIndexs = 'list.' + reportDate[n];
      let cpwidth = (ddw - datalength) > 0 ? (ddw - 290) / reportDate.length : 120;
      colms = {
        title: <span>
          <span>{clonedDate.shift()}</span>
        </span>,
        dataIndex: dataIndexs,
        key: dataIndexs,
        width: cpwidth,
        render: (text, row, index) => {
          if (text < 0) {
            return (
              <div style={{ color: '#FF5E5A' }}>
                <span>{text}</span>
              </div>
            );
          } else {
            return (
              <div>
                <span>{text}</span>
              </div>
            );
          }
        },
      };
      columns.push(colms);
    }
    return columns;
  }

  render () {
    const { bbSours, datalength, dcvalue, showdc } = this.props;
    const columns = this.getDateElem();
    return (
      <div className="m-tible">
        <Button
          onClick={this.btnClick}
          className='m-btn2'
          disabled={showdc}
          type="primary"
          size='large'
          style={{ width: '80px', marginBottom: '10px' }}
          >
          导出
          </Button>
        <div className='m-footer'>
          <Table
            size='middle'
            pagination={false}
            dataSource={bbSours}
            columns={columns}
            scroll={{ x: datalength, y: 700 }}
            bordered
            rowKey={'key'}
          />
          <form
            action={config[config.current] + 'overall/detailReport/export'}
            encType="multipart/form-data"
            method="post"
            style={{ display: 'none' }}>
            查询开始时间:<br />
            <input type="text" name="beginDate" value={dcvalue.beginDate} readOnly />
            <br />
            查询结束时间:<br />
            <input type="text" name="endDate" value={dcvalue.endDate} readOnly />
            <br />
            查询时间单位:<br />
            <input type="text" name="unit" value={dcvalue.unit} readOnly />
            <br />
            门店Id拼接的字符串:<br />
            <input type="text" name="storeIds" value={dcvalue.storeIds} readOnly />
            <br />
            <input type="submit" value="Submit" ref="submit" />
          </form>
        </div>
      </div>
    );
  }
}
