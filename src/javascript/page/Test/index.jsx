import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MenuComp from 'components/MenuComp/MenuComp';
import Requirement from 'components/Requirement/Requirement';
import RequestUtil from 'extend/common/RequestUtil';
import { Upload, Button, Icon } from 'antd';
import config from '../../config/config.json';
import 'scss/base.scss';
import 'scss/Test/index.scss';

class PageComponent extends Component {
  constructor (props) {
    super(props);

    this.state = {
      requireData: {},
      shopTreeSelect: [],
      typeTreeSelect: [],
      conditionTreeSelect: [],
    };
  }

  componentDidMount () {
    const that = this;
    this.setState({
      shopTreeSelect: [],
      typeTreeSelect: [
        {
          label: '下沙小区门店',
          value: 'xiashaxiaoqu',
          key: '0-0',
        }, {
          label: '下沙大学门店',
          value: 'xiashadaxue',
          key: '0-1',
        },
      ],
      conditionTreeSelect: [
        {
          label: '在库',
          value: 'zaiku',
          key: '0-0',
        }, {
          label: '使用中',
          value: 'shiyongzhong',
          key: '0-1',
        }, {
          label: '报废',
          value: 'baofei',
          key: '0-2',
        },
      ],
    });

    let param = {
      url : 'shop/query',
      method : 'POST',
      data: {},
      successFn : function (data) {
        if (RequestUtil.isResultSuccessful(data)) {
          console.log(data.resultData);
          that.setState({
            shopTreeSelect: [
              {
                label: '下沙小区门店',
                value: '下沙小区门店',
                key: '0-0',
                children: [{
                  label: '云水苑',
                  value: '云水苑',
                  key: '0-0-0',
                }, {
                  label: '新加坡科技园',
                  value: '新加坡科技园',
                  key: '0-0-1',
                }],
              }, {
                label: '下沙大学门店',
                value: '下沙大学门店',
                key: '0-1',
                children: [{
                  label: '杭师',
                  value: '杭师',
                  key: '0-1-0',
                }, {
                  label: '钱江湾',
                  value: '钱江湾',
                  key: '0-1-1',
                }],
              },
            ],
          });
        }
      },
      errorFn : function () {
        console.error(arguments);
      },
    };
    RequestUtil.fetch(param);
  }

  getRequireData = (value) => {
    console.log(value);
    alert('点击“筛选”按键的回调函数');
  }

  render () {
    // 收入数据
    const { shopTreeSelect } = this.state;
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

    const props = {
      name: 'file',
      action: config[config.current] + '/income/excel/import',
      data: { date: '2017-05-03' },
      onChange: (info) => {
        console.log(info);
      },
    };
    return (
      <MenuComp activeTab={1} subTitle="测试页面">
        <div>
          <Requirement {...RequirementInfo} />
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> Click to Upload
            </Button>
          </Upload>
        </div>
      </MenuComp>
    );
  }
}

ReactDOM.render(<PageComponent />, document.getElementById('app'));
