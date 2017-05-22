import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CookieUtil from 'extend/common/CookieUtil';
import { Layout, Input, Button, Form } from 'antd';
import Sha1 from 'extend/algorithm/Sha1.jsx';
// import LOGO from '../../../../res/images/Login/tubobo_Logo.png';
import 'scss/base.scss';
import 'scss/Login/index.scss';
const { Content } = Layout;
const FormItem = Form.Item;

const loginCookieName = 'jipei-statements-login';
const loginCookieValue = '513189e514aa66e1a5f3ca32abdf3b3bddff57e0';
const COOKIE_EXPIRE_SECONDS = 30 * 60;
const COOKIEDOMAIN = location.hostname;

class PageComponent extends Component {
  constructor (props) {
    super(props);

    if (CookieUtil.getCookie(loginCookieName) === loginCookieValue) {
      location.replace('../Statements/index.html');
      return;
    }

    this.state = {
      validateStatus: '',
      help: '',
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { passWord } = this.state;

    let shaPassWord = !passWord ? '' : new Sha1().hexSha1(passWord);
    if (shaPassWord === loginCookieValue) {
      CookieUtil.setCookie(loginCookieName, shaPassWord, COOKIE_EXPIRE_SECONDS, '/', COOKIEDOMAIN);
      location.replace('../Statements/index.html');
      return;
    }
    this.setState({
      validateStatus: 'error',
      help: '请输入正确的验证信息',
    });
  }

  handleChange = (e) => {
    this.setState({
      validateStatus: '',
      help: '',
      passWord: e.target.value,
    });
  }

  render () {
    let { validateStatus, help } = this.state;
    return (
      <Layout style={{ height: '100vh' }}>
        <Content
          style={{ background: '#282828', padding: '24px', position: 'relative' }}
        >
          <div className="content-box">
            <img src="http://tubobo-qd.oss-cn-shanghai.aliyuncs.com/images/tubobo_Logo.png" />

            <Form layout="inline" onSubmit={this.handleSubmit} style={{ width: '300px' }}>
              <FormItem
                validateStatus={validateStatus || ''}
                help={help || ''}
                style={{ width: 200 }}
              >
                <Input type="password" placeholder="请输入验证信息" style={{ width: 200 }} onChange={this.handleChange} />
              </FormItem>
              <FormItem style={{ width: 80 }} >
                <Button
                  style={{ width: 80 }}
                  type="primary"
                  htmlType="submit"
                >
                  登陆
                </Button>
              </FormItem>
            </Form>
            <div className="recommend-browser">为保证体验，推荐使用 Chrome 或 Firefox 浏览器</div>
          </div>
        </Content>
      </Layout>
    );
  }
}

ReactDOM.render(<PageComponent />, document.getElementById('app'));
