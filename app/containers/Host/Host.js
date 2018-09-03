// @flow
import React, { Component } from 'react';
import _ from 'underscore';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import routes from 'Constants/routes.json';
import { connect } from 'react-redux';
import * as HostSystemActions from 'Actions/host/systemHost';
import * as HostTabActions from 'Actions/host/tabs';
import * as HostSelectors from 'Selectors/hostSelectors';

import { Tabs, Input, Modal } from 'antd';

import HostSet from './HostSet';
import HostShowning from './HostShowning';
import OriginHost from './OriginHost';
import styles from './Host.scss';

const { TabPane } = Tabs;

type Props = {
  changeTab: (key: string) => void,
  getAuthored: (password: string) => void,
  tabList: Array<tabItemType>,
  activeKey: string,
  setSystemHost: (content: string) => void,
  systemHost: string,
  currentHostShowning: string,
  hasAuthored: boolean
};

function mapStateToProps(state) {
  const { getCurrentHostShowing } = HostSelectors;
  return {
    tabList: state.host.tabs.tabList,
    activeKey: state.host.tabs.activeKey,
    hasAuthored: state.host.systemHost.hasAuthored,
    currentHostShowning: getCurrentHostShowing(state),
    systemHost: state.host.systemHost.systemHost
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(HostTabActions, dispatch),
    ...bindActionCreators(HostSystemActions, dispatch)
  };
}

class Host extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    const { setSystemHost } = props;
    this.state = {
      password: ''
    };
    this.syncHostDebounce = _.debounce(setSystemHost, 2 * 1000, false);
  }

  componentDidMount() {}

  componentDidUpdate = async preProps => {
    const { currentHostShowning, changeCheckedKeys, systemHost } = this.props;
    if (currentHostShowning !== systemHost) {
      // TODO: 一旦权限更改失败，这里会进入死循环
      this.syncHostDebounce(currentHostShowning);
    }
  };

  onAuthModalOk = () => {
    const { getAuthored } = this.props;
    const { password } = this.state;
    getAuthored(password);
  };

  onPasswordChange = e => {
    const password = e.target.value;
    this.setState({
      password
    });
  };

  render() {
    const { password } = this.state;
    const { tabList, activeKey, hasAuthored, changeTab } = this.props;
    return (
      <div className={styles.host}>
        {hasAuthored ? (
          <Tabs activeKey={activeKey} onChange={changeTab}>
            {tabList.map(tab => (
              <TabPane tab={tab.title} key={tab.key}>
                {tab.key === '1' ? <HostSet /> : null}
                {tab.key === '2' ? <HostShowning /> : null}
                {tab.key === '3' ? <OriginHost /> : null}
              </TabPane>
            ))}
          </Tabs>
        ) : null}

        <Modal
          visible={!hasAuthored}
          title="请输入电脑用户密码"
          onOk={this.onAuthModalOk}
        >
          <Input
            type="password"
            value={password}
            onChange={this.onPasswordChange}
          />
        </Modal>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Host);
