import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'scss/base.scss';
import 'scss/Income/index.scss';
import MenuComp from 'components/MenuComp/MenuComp';
import incomepage from 'incomepage.json';
import { Table } from 'antd';

let reportDate = [];

function reData () {
  let jieguodata = [];
  let i = 0;
  let dataSource = incomepage.resultData;
  const myMap = new Map();
  myMap.set(dataSource);
  myMap.forEach(function (value, key) {
    key.forEach(function (value, key) {
      let areaName = value.areaName;
      let areaID = value.areaID;
      let list = value.list;
      list.forEach(function (value, key) {
        let storeName = value.storeName;
        let storeID = value.storeID;
        let lists = value.list;
        let chepeiA = [];
        let chepeiN = [];
        let paijianA = [];
        let paijianN = [];
        let shoujianA = [];
        let shoujianN = [];
        let zhongbaoA = [];
        let zhongbaoN = [];
        let listA = [];
        let listN = [];
        let listP;
        let listAw;
        let listNw;
        for (let j = 0; j < lists.length; j++) {
          chepeiA.push(lists[j].chepeiAmount);
          chepeiN.push(lists[j].chepeiNum);
          paijianA.push(lists[j].paijianAmount);
          paijianN.push(lists[j].paijianNum);
          shoujianA.push(lists[j].shoujianAmount);
          shoujianN.push(lists[j].shoujianNum);
          zhongbaoA.push(lists[j].zhongbaoAmount);
          zhongbaoN.push(lists[j].zhongbaoNum);
          reportDate.push(lists[j].reportDate);
        }
        for (var n = 0; n < 4; n++) {
          if (n === 0) {
            listA = shoujianA;
            listN = shoujianN;
            listP = '快件收件';
            listAw = value.wShoujianAmount;
            listNw = value.wShoujianNum;
          } else if (n === 1) {
            listA = paijianA;
            listN = paijianN;
            listP = '快件派件';
            listAw = value.wPaijianAmount;
            listNw = value.wPaijianNum;
          } else if (n === 2) {
            listA = chepeiA;
            listN = chepeiN;
            listP = '车配网';
            listAw = value.wChepeiAmount;
            listNw = value.wChepeiNum;
          } else if (n === 3) {
            listA = zhongbaoA;
            listN = zhongbaoN;
            listP = '众包';
            listAw = value.wZhongbaoAmount;
            listNw = value.wZhongbaoNum;
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
            'listAw'    : listAw,
            'listNw'    : listNw,
            'keys'      : i,
          };
          i++;
        }
      });
    });
  });
  return jieguodata;
};
let jieguodata = reData();

class DateTitle extends Component {
  state = {
    visible: false,
    reda : reportDate.shift(),
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.setState({
      ModalText: 'The modal dialog will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  }
  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }
  alimport (index) {
    return function () {
      alert('123');
    };
  }
  render () {
    let Mtit = '请上传 ' + this.state.reda + ' 业务数据  ';
    console.log('请上传 ' + this.state.reda + ' 业务数据  ');
    return (
      <span className='m-dateicon'>
        <span>{this.state.reda}</span>
        <img src='bg.png' height='20px' width='20px' onClick={this.showModal} />
        <Modal
          className='m-modal'
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          okText='上传'
          footer={null}
        >
          <span>{Mtit}</span>
          <a href='#'><u>下载模板</u></a>
          <Button>上传</Button>
        </Modal>
      </span>
    );
  }
}

const columns = [{
  title: '区域',
  dataIndex: 'areaName',
  className: 'm-tabletitle',
  key: 'areaName',
  width: 100,
  fixed: 'left',
  // colSpan: 2,
  render: (text, row, index) => {
    const obj = {
      children: text,
      props: {},
    };
    if (index % 8 === 0) {
      obj.props.rowSpan = 8;
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
  title: <DateTitle />,
  children: [{
    title: '业务量',
    dataIndex: 'listN1',
    key: 'listN1',
    width: 60,
  },
  {
    title: '业务收入',
    dataIndex: 'listA1',
    key: 'listA1',
    width: 60,
  },
  ],
},
{
  title: <DateTitle />,
  children: [{
    title: '业务量',
    dataIndex: 'listN2',
    key: 'listN2',
    width: 60,
  },
  {
    title: '业务收入',
    dataIndex: 'listA2',
    key: 'listA2',
    width: 60,
  },
  ],
},
{
  title: <DateTitle />,
  children: [{
    title: '业务量',
    dataIndex: 'listN3',
    key: 'listN3',
    width: 60,
  }, {
    title: '业务收入',
    dataIndex: 'listA3',
    key: 'listA3',
    width: 60,
  }] }, {
    title: <DateTitle />,
    children: [{
      title: '业务量',
      dataIndex: 'listN4',
      key: 'listN4',
      width: 60,
    }, {
      title: '业务收入',
      dataIndex: 'listA4',
      key: 'listA4',
      width: 60,
    }] }, {
      title: <DateTitle />,
      children: [{
        title: '业务量',
        dataIndex: 'listN5',
        key: 'listN5',
        width: 60,
      }, {
        title: '业务收入',
        dataIndex: 'listA5',
        key: 'listA5',
        width: 60,
      }] }, {
        title: <DateTitle />,
        children: [{
          title: '业务量',
          dataIndex: 'listN6',
          key: 'listN6',
          width: 60,
        }, {
          title: '业务收入',
          dataIndex: 'listA6',
          key: 'listA6',
          width: 60,
        }] }, {
          title: <DateTitle />,
          children: [{
            title: '业务量',
            dataIndex: 'listN7',
            key: 'listN7',
            width: 60,
          }, {
            title: '业务收入',
            dataIndex: 'listA7',
            key: 'listA7',
            width: 60,
          }] }, {
            title: 'w13',
  // fixed: 'right',
            children: [{
              title: '业务量',
              dataIndex: 'listNw',
              key: 'listNw',
              width: 60,
    // fixed: 'right',
            }, {
              title: '业务收入',
              dataIndex: 'listAw',
              key: 'listAw',
              width: 60,
            }],
          },

];

class PageComponent extends Component {
  constructor (props) {
    super(props);

    this.state = {};
  }

  render () {
    return (
      <MenuComp activeTab={2}>
        <div className='m-income'>

          <div className='m-header'>
            <div className='h-title' />
          </div>
          <div className='m-body' />
          <div className='m-footer'>
            <Table
              size='middle'
              dataSource={jieguodata}
              columns={columns}
              scroll={{ x: 1200, y: 400 }}
              bordered
              width={''}
        />
          </div>
        </div>
      </MenuComp>
    );
  }
}

ReactDOM.render(<PageComponent />, document.getElementById('app'));
