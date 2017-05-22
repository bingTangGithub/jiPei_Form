import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MenuComp from 'components/MenuComp/MenuComp';
import Record from 'components/Record/Record';
import SubFrom from 'components/SubFrom/SubFrom';
import Requirement from 'components/Requirement/Requirement';
import RequestUtil from 'extend/common/RequestUtil';
import { Table, Button, Modal, Popover, Select } from 'antd';
import config from '../../config/config.json';
import 'scss/base.scss';
import 'scss/SupplyExpend/index.scss';

const SOption = Select.Option;

class PageComponent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ghbfdatas: '',
      ackghbfdatas: '',
      texts: '',
      lyvisible: false,
      jlvisible: false,
      ghbfvisible: false,
      lyokvisible: false,
      ackghbfvisible: false,
      confirmLoading: false,
      lytext: '恭喜你领用成功',
      pageNo: 1,
      pageSize: 10,
      totalSize: 0,
      totalPage: 0,
      wzSoures: [],
      requireData: {},
      conditionTreeSelect: [
        {
          label: '在库',
          value: '0',
          key: '0-0',
        }, {
          label: '使用中',
          value: '1',
          key: '0-1',
        }, {
          label: '报废',
          value: '2',
          key: '0-2',
        },
      ],
      childseo:[],
      wzid:'',
      wzvalue:{},
      showdc: true,
    };
  }
  showlyModal = (e) => {
    this.setState({
      lyvisible: true,
      wzid: e,
    });
  }
  showjlModal = (e) => {
    this.setState({
      jlvisible: true,
      wzid: e,
    });
  }
  ghbfdata = (e) => {
    let text = '于 ' + e.returnDate + ' ' + this.state.texts + e.goodsName + '(';
    text += e.goodsId + ') ,本次使用' + e.useDays + '日，总支出' + e.outcomeTotal + '元';
    return text;
  }

  verifyghbf = (e, text) => {
    this.setState({
      wzid: e.id,
      texts: text,
      ackghbfdatas: '请确认，是否' + text + e.goodsName + (e.goodsId ? (' 编号：(' + e.goodsId + ')。') : ('。')),
      ackghbfvisible: true,
    });
  }

  showghbfModal = (e) => {
    this.setState({
      ghbfvisible: true,
      ackghbfvisible: false,
      wzid: e,
    });
    let that = this;
    let paramghbf = {
      url : 'outcome/goods/return',
      method : 'POST',
      data: {
        goodsEntityId : e,
        type : (that.state.texts === '归还') ? '1' : '2',
      },
      successFn : function (data) {
        if (RequestUtil.isResultSuccessful(data)) {
          let ghbfdatas = that.ghbfdata(data.resultData);
          that.setState({
            ghbfdatas: ghbfdatas,
          });
        }
      },
      errorFn : function () {
        console.error(2222, arguments);
      },
    };
    RequestUtil.fetch(paramghbf);
  }

  handleCancel = () => {
    this.setState({
      lyvisible: false,
      jlvisible: false,
      ghbfvisible: false,
      ackghbfvisible: false,
      yokvisible: false,
    });
  }

  handleOK = () => {
    let that = this;
    this.setState({
      lyvisible: false,
      jlvisible: false,
      ghbfvisible: false,
      lyokvisible: false,
    }, () => {
      that.pagehandle(this.state.pageNo, this.state.pageSize);
    });
  }

  componentDidMount () {
    this.getRequireData({});
    this.getshop();
  }

  pagehandle = (page, pageSize) => {
    let pages = page;
    let pageSizes = pageSize;
    let { wzvalue } = this.state;
    let cxdata = {};
    let that = this;
    if (JSON.stringify(wzvalue) === '{}') {
      cxdata = {
        pageNo: pages,
        pageSize: pageSizes,
      };
    } else {
      cxdata = {
        goodsBrand: wzvalue.goodsBrand,
        goodsId: wzvalue.goodsId,
        goodsModel: wzvalue.goodsModel,
        goodsName: wzvalue.goodsName,
        pageNo: pages,
        pageSize: pageSizes,
        useState: wzvalue.condition,
      };
    };
    let paramwz = {
      url : 'outcome/goods/list',
      method : 'POST',
      data: cxdata,
      successFn : function (data) {
        if (RequestUtil.isResultSuccessful(data)) {
          that.turnData(data);
        }
      },
      errorFn : function () {
        console.error(arguments);
      },
    };
    RequestUtil.fetch(paramwz);
  }

  getRequireData = (value) => {
    let { pageSize } = this.state;
    let that = this;
    that.setState({
      wzvalue: value,
    }, () => {
      this.pagehandle(1, pageSize);
    });
  }

  btnClick = (e) => {
    let submitButton = this.refs.submit;
    submitButton.click();
  }

  turnData = (e) => {
    let jieguodata = [];
    let dataSource = e.resultData;
    let that = this;
    let pageNo = dataSource.pageNo;
    let pageSize = dataSource.pageSize;
    let totalSize = dataSource.totalSize;
    let totalPage = dataSource.totalPage;
    let showdc = false;
    const myMap = new Map();
    myMap.set(dataSource.list);
    if (totalSize === 0) {
      showdc = true;
    };
    myMap.forEach(function (value, key) {
      jieguodata = key;
    });
    that.setState({
      wzSoures : jieguodata,
      pageNo,
      pageSize,
      totalSize,
      totalPage,
      showdc,
    });
    return jieguodata;
  }

  getcolumns = () => {
    return [
      {
        title: '名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: 80,
      },
      {
        title: '品牌',
        dataIndex: 'goodsBrand',
        key: 'goodsBrand',
        width: 80,
      },
      {
        title: '型号',
        dataIndex: 'goodsModel',
        key: 'goodsModel',
        width: 80,
      },
      {
        title: '编号',
        dataIndex: 'goodsId',
        key: 'goodsId',
        width: 80,
      },
      {
        title: '单价 （元）',
        dataIndex: 'goodsPrice',
        key: 'goodsPrice',
        width: 80,
      },
      {
        title: '折旧率 （月）',
        dataIndex: 'depreciationRate',
        key: 'depreciationRate',
        width: 80,
      },
      {
        title: '购买时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width: 80,
      },
      {
        title: '日均折旧支出（元）',
        dataIndex: 'depOutcomeAvg',
        key: 'depOutcomeAvg',
        width: 80,
      },
      {
        title: '日均维修支出（元）',
        dataIndex: 'repairOutcomeAvg',
        key: 'repairOutcomeAvg',
        width: 80,
      },
      {
        title: <span>
          <span>
            剩余价值（折旧率+维修）
          </span>
          <Popover content={<span>剩余价值在申请归还或报废时重新计算</span>} title="提示" />
        </span>,
        dataIndex: 'surplusValue',
        key: 'surplusValue',
        width: 80,
      },
      {
        title: '使用状况',
        dataIndex: 'useState',
        key: 'useState',
        width: 80,
        render: (text, row, index) => {
          switch (text) {
            case '0':
              return '在库';
            case '1':
              return '使用中';
            case '2':
              return '报废';
            default:
              return '其他状态或数据错误';
          }
        },
      },
      {
        title: '操作',
        key: 'id',
        width: 80,
        render: (text, row, index) => {
          let goodsEntityId = row.id;
          if (row.useState === '0') {
            if (row.usedDays === 0 || row.usedDays === '0') {
              return (
                <a className='atags' onClick={() => { this.showlyModal(goodsEntityId); }}>领用</a>
              );
            } else {
              return (
                <span>
                  <a className='atags' onClick={() => { this.showlyModal(goodsEntityId); }}>领用</a>
                  <Popover
                    placement="topRight"
                    title='使用记录'
                    content={<Record goodsEntityId={goodsEntityId} />}
                    >&nbsp;&nbsp;
                    <a className='atags'>记录</a>
                  </Popover>
                </span>
              );
            }
          }
          if (row.useState === '1') {
            return (
              <span>
                <a className='atags' onClick={() => { this.verifyghbf(row, '归还'); }}>归还&nbsp;</a>
                <a className='atags' onClick={() => { this.verifyghbf(row, '报废'); }}>报废&nbsp;</a>
                <Popover
                  placement="topRight"
                  title='使用记录'
                  content={<Record goodsEntityId={goodsEntityId} />}
                  >
                  <a className='atags'>记录</a>
                </Popover>
              </span>
            );
          }
          if (row.useState === '2') {
            return (
              <span>
                <Popover
                  placement="topRight"
                  title='使用记录'
                  content={<Record goodsEntityId={goodsEntityId} />}
                  >
                  <a className='atags'>记录</a>
                </Popover>
              </span>
            );
          }
        },
      },
    ];
  }
  seldata = (Source) => {
    let jieguodata = [];
    let i = 0;
    let dataSource = Source.resultData;
    const myMap = new Map();
    let that = this;
    myMap.set(dataSource);
    myMap.forEach(function (value, key) {
      key.forEach(function (value, key) {
        let lists = value.list;
        lists.forEach(function (value, key) {
          jieguodata.push(<SOption key={i} value={value.id}>{value.name}</SOption>);
          i++;
        });
        that.setState({
          childseo : jieguodata,
        });
        return jieguodata;
      });
    });
  }

  getshop = () => {
    const that = this;
    const childseo = [];
    let paramsh = {
      url : 'shop/query',
      method : 'POST',
      data: {},
      successFn : function (data) {
        if (RequestUtil.isResultSuccessful(data)) {
          that.seldata(data);
        }
      },
      errorFn : function () {
        console.error(arguments);
      },
    };
    RequestUtil.fetch(paramsh);
    return childseo;
  }
// 获取
  getFormpush = (value) => {
    const { pageNo, pageSize } = this.state;
    const that = this;
    let paramly = {
      url : 'outcome/goods/use',
      method : 'POST',
      data: value,
      successFn : function (data) {
        if (RequestUtil.isResultSuccessful(data)) {
          that.setState({
            lyvisible: false,
            // lyokvisible: true,
            lytext: '恭喜你 领用成功',
          }, () => {
            that.pagehandle(pageNo, pageSize);
          });
        }
      },
      errorFn : function () {
        console.error(arguments);
        that.setState({
          lyvisible: false,
          lyokvisible: true,
          lytext: '抱歉 领用失败',
        }, () => {
          that.pagehandle(pageNo, pageSize);
        });
      },
    };
    RequestUtil.fetch(paramly);
    that.setState({
      lyvisible: false,
    });
  }

  render () {
    const { conditionTreeSelect, wzSoures, lyvisible, ghbfvisible, texts,
      lyokvisible, ackghbfvisible, confirmLoading, ghbfdatas, lytext,
      ackghbfdatas, childseo, wzid, showdc } = this.state;
    const columns = this.getcolumns();
    const { pageNo, pageSize, totalSize } = this.state;
    const RequirementInfo = {
      formItems: [
        {
          formName: 'Input',
          formInfo: [
            {
              label: '物资名称',
              id: 'goodsName',
            }, {
              label: '物资品牌',
              id: 'goodsBrand',
            }, {
              label: '物资型号',
              id: 'goodsModel',
            }, {
              label: '物资编号',
              id: 'goodsId',
            },
          ],
        },
        {
          formName: 'conditionTreeSelect',
          form: {},
        },
      ],
      getRequireData: this.getRequireData,
      conditionTreeSelect,
    };
    const SubFromInfo = {
      childseo: childseo,
      getFormpush: this.getFormpush,
      wzid: wzid,
      handleCancel: this.handleCancel,
    };
    return (
      <MenuComp activeTab={4} subTitle="物资使用">
        <div>
          <Requirement {...RequirementInfo} />
          <div className='m-supplyexpend'>
            <Button
              onClick={this.btnClick}
              className='m-btn2'
              disabled={showdc}
              type="primary"
              size='large'
              style={{ width: '80px', marginBottom: '10px' }}
              >导出</Button>
            <div className='m-footer'>
              <Table
                size='middle'
                rowKey='id'
                dataSource={wzSoures}
                pagination={{
                  defaultPageSize: pageSize,
                  pageSize: pageSize,
                  current: pageNo,
                  total: totalSize,
                  size: 'middle',
                  onChange: (pages, pageSizes) => { this.pagehandle(pages, pageSizes); },
                }}
                columns={columns}
                scroll={{ x: 1200, y: 400 }}
                bordered
                width={'1500'}
              />
              <Modal
                wrapClassName='vertical-center-modal'
                title="领用"
                visible={lyvisible}
                confirmLoading={confirmLoading}
                footer={null}
                onCancel={this.handleCancel}
                maskClosable={false}
                >
                <SubFrom {...SubFromInfo} />
              </Modal>
              <Modal
                title="领用"
                wrapClassName='vertical-center-modal'
                visible={lyokvisible}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
                onOk={this.handleOK}
                maskClosable={false}
                >
                <h1>{lytext}</h1>
              </Modal>
              <Modal
                title={texts}
                wrapClassName='vertical-center-modal'
                visible={ghbfvisible}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
                maskClosable={false}
                footer={null}
              >
                <p>{ghbfdatas}</p>
                <div className="place-holder" style={{ height: 32 }}>
                  <Button
                    onClick={this.handleOK}
                    type="primary"
                    size='large'
                    style={{ float: 'right', width: 80 }}
                  >
                    确定
                  </Button>
                </div>
              </Modal>
              <Modal
                title={texts}
                wrapClassName='vertical-center-modal'
                visible={ackghbfvisible}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
                maskClosable={false}
                footer={null}
                >
                <p>{ackghbfdatas}</p>
                <div className="m-btnfather">
                  <div className="lingyong-confirm">
                    <Button
                      onClick={this.handleCancel}
                      size='large'
                      className='m-btnqx'
                      >
                      取消
                    </Button>
                    <Button
                      onClick={() => { this.showghbfModal(wzid); }}
                      type="primary"
                      size='large'
                      className="m-btn3"
                      >
                      确定
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
          <form
            action={config[config.current] + '/outcome/goods/export'}
            encType="multipart/form-data"
            method="post"
            style={{ display: 'none' }}>
            使用状态:<br />
            <input type="text" name="useState" value={this.state.wzvalue.condition} readOnly />
            <br />
            品牌:<br />
            <input type="text" name="goodsBrand" value={this.state.wzvalue.goodsBrand} readOnly />
            <br />
            编号:<br />
            <input type="text" name="goodsId" value={this.state.wzvalue.goodsId} readOnly />
            <br />
            型号:<br />
            <input type="text" name="goodsModel" value={this.state.wzvalue.goodsModel} readOnly />
            <br />
            名称:<br />
            <input type="text" name="goodsName" value={this.state.wzvalue.goodsName} readOnly />
            <br />
            <input type="submit" value="Submit" ref="submit" />
          </form>
        </div>
      </MenuComp>
    );
  }
}

ReactDOM.render(<PageComponent />, document.getElementById('app'));
