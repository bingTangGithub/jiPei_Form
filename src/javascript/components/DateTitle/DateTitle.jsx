import PropTypes from 'prop-types';
// import bianjiimg from 'images/Income/bianji.png';
import React, { Component } from 'react';
import { Modal, Button, Upload, Icon } from 'antd';
import config from '../../config/config.json';
import 'scss/base.scss';
import 'scss/Income/index.scss';
import moment from 'moment';
export default class DateTitle extends Component {
  static propTypes = {
    reda: PropTypes.string,
    getRefreshData: PropTypes.func,
  }
  state = {
    scvisible: false,
    days : '2017-05-03',
    sctexts: '',
    reportDate: [],
    dataSource: [],
    postdata: {
      'date' : '2017-05-03',
      // 'file' : bianjiimg,
    },
    fileList: [],
  }

  showscModal = () => {
    this.setState({
      scvisible: true,
    });
  }

  handlescOk = () => {
    this.setState({
      scvisible: false,
      upvisible: true,
    });
  }

  handupleOk = () => {
    this.setState({
      upvisible: false,
    }, () => {
      this.props.getRefreshData();
    });
  }

  handleCancel = () => {
    this.setState({
      scvisible: false,
      upvisible: false,
      screvisible: false,
    });
  }

  scre = (text) => {
    setTimeout(
      () => {
        this.setState({
          upvisible: false,
          sctexts: text,
          screvisible: true,
        }, () => {
          this.props.getRefreshData();
        });
      }, 500);
  }

  handleChange = (info) => {
    let fileList = info.fileList;
    fileList = fileList.slice(-2);
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    fileList = fileList.filter((file) => {
      if (file.response) {
        if (file.response.resultCode === '0') {
          this.scre('上传成功');
        } else {
          this.scre('上传失败');
        }
        return file.response.status === 'success';
      }
      return true;
    });
    this.setState({ fileList });
  }
  render () {
    const { scvisible, confirmLoading, upvisible, screvisible, sctexts } = this.state;
    const { reda } = this.props;
    let Mdate = moment(reda).format('YYYY-MM-DD');
    let Mtit = '请上传 ' + Mdate + ' 业务数据  ';
    let propsUpload = {
      name: 'file',
      action: config[config.current] + '/income/excel/import',
      data: {
        date: reda,
      },
      // defaultFileList: [],
      onChange: this.handleChange,
    };
    return (
      <span className='m-dateicon'>
        <span>{Mdate}</span>
        <img src="http://tubobo-qd.oss-cn-shanghai.aliyuncs.com/images/bianji.png"
          height='20px'
          width='20px'
          onClick={this.showscModal}
         />
        <Modal
          wrapClassName='m-modals'
          visible={scvisible}
          onOk={this.handlescOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          okText='上传'
          footer={null}
          >
          <span>{Mtit}</span>
          <a
            className='atags'
            href="http://tubobo-qa.oss-cn-shanghai.aliyuncs.com/%E6%94%B6%E5%85%A5%E6%A8%A1%E7%89%88.xlsx"
            target='__blank'
            download="模板"
            >
            <u>
            下载模板
            </u>
          </a>
          <br />
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
                onClick={this.handlescOk}
                type="primary"
                size='large'
                className='m-btn3'
                >
                确定
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          wrapClassName='vertical-center-modal'
          visible={upvisible}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          okText='确定'
          maskClosable={false}
          footer={null}
        >
          <Upload {...propsUpload} fileList={this.state.fileList}>
            <Button>
              <Icon type="upload" />上传文件
            </Button>
          </Upload>
          <Button
            onClick={this.handleCancel}
            type="primary"
            size='large'
            className='m-btn2'
            >
              确定
            </Button>
        </Modal>
        <Modal
          wrapClassName='vertical-center-modal'
          visible={screvisible}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          maskClosable={false}
          footer={null}
        >{sctexts}
          <br />
          <Button
            onClick={this.handleCancel}
            type="primary"
            size='large'
            className='m-btn2'
            >
            确定
          </Button>
        </Modal>
      </span>
    );
  }
}
