import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CookieUtil from 'extend/common/CookieUtil';
import UrlUtil from 'extend/common/UrlUtil';
import pageList from 'data/pageList.json';
import { Layout, Menu, Icon } from 'antd';
import './MenuComp.scss';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const loginCookieName = 'jipei-statements-login';
const loginCookieValue = '513189e514aa66e1a5f3ca32abdf3b3bddff57e0';

export default class MenuComp extends Component {
  constructor (props) {
    super(props);

    if (CookieUtil.getCookie(loginCookieName) !== loginCookieValue) {
      location.replace('../Login/index.html');
      return;
    }

    this.state = {
      showMenu: true,
    };
  }

  showMenu = () => {
    let { showMenu } = this.state;
    this.setState({
      showMenu: !showMenu,
    });
  }

  handleMenuClick ({ item, key, selectedKeys }) {
    console.log(pageList.pages[key - 1]);
    location.href = UrlUtil.getPageUrlByPageName(pageList.pages[key - 1].name);
  }

  render () {
    let { children, activeTab } = this.props;
    let { showMenu } = this.state;
    let showMenuClazz = 'menu-bar' + (showMenu ? ' showMenu' : '');
    let { key: activeTabKey, subKey: activeTabSubkey } = pageList.pages[activeTab - 1].index;

    return (
      <Layout style={{ height: '100vh' }}>
        <Header className='header' style={{ position: 'fixed', width: '100%' }}>
          <div
            className='logo'
            style={{
              float: 'left',
              width: '150px',
              height: '54px',
              lineHeight: '90px',
              backgroundImage: 'url(http://tubobo-qd.oss-cn-shanghai.aliyuncs.com/images/logo.png)',
              backgroundSize: 'auto 64px',
              backgroundRepeat: 'no-repeat',
              verticalAlign: 'middle',
              margin: '5px 20px 0 -20px',
            }}
          />
          <div
            className='title'
            style={{ float: 'left', color: '#fff', fontSize: '20px', lineHeight: '64px' }}
          >| 极配透明报表系统</div>
        </Header>
        <Layout style={{ marginTop: 64 }}>
          <Sider mode='inline' width={showMenu ? 200 : 0} style={{ background: '#404040', position: 'relative' }}>
            <div
              className={showMenuClazz}
              onClick={this.showMenu}
              style={{
                position: 'absolute',
                top: 40,
                right: -15,
                height: 80,
                backgroundColor: '#404040',
                borderTop: '15px solid #ececec',
                borderLeft: '15px solid #404040',
                borderBottom: '15px solid #ececec',
                cursor: 'pointer',
              }} />
            <Menu
              theme='dark'
              mode='inline'
              defaultSelectedKeys={[activeTabKey]}
              defaultOpenKeys={[activeTabSubkey]}
              style={{ height: '100%' }}
              onSelect={this.handleMenuClick}
            >
              <Menu.Item key='1'><Icon type='area-chart' />收支报表</Menu.Item>
              <Menu.Item key='2'><Icon type='pay-circle' />收入数据</Menu.Item>
              <SubMenu key='sub3' title={<span><Icon type='calculator' />支出数据</span>}>
                <Menu.Item key='3'>物资采购</Menu.Item>
                <Menu.Item key='4'>物资使用</Menu.Item>
                <Menu.Item key='5'>其他支出</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout>
            <Header
              style={{
                background: '#545454',
                padding: 0,
                textAlign: 'center',
                fontSize: '16px',
                lineHeight: '40px',
                height: '40px',
                color: '#fff',
              }}
            >
              {this.props.subTitle}
            </Header>
            <Content
              style={{
                background: '#ececec',
                padding: '24px',
                margin: 0,
                minHeight: 280,
                overflow: 'hidden',
                overflowY: 'scroll',
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

MenuComp.propTypes = {
  children: PropTypes.element.isRequired,
  activeTab: PropTypes.number.isRequired,
  subTitle: PropTypes.string.isRequired,
};
