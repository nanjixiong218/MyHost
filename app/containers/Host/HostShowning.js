// @flow
import React, { Component } from 'react';
import CodeMirror from 'react-cmirror'; // TODO: 新人开源的库，有待考察, 不行就自己封装
import 'codemirror/mode/yaml/yaml';
// import { bindActionCreators } from 'redux';
import bindActionCreators from 'Utils/bindActionCreators';
import * as Utils from 'Utils/utils';
import { Link } from 'react-router-dom';
import routes from 'Constants/routes.json';
import { connect } from 'react-redux';
import * as HostMenuActions from 'Actions/host/menus';
import * as HostSystemActions from 'Actions/host/systemHost';
import * as HostSelectors from 'Selectors/hostSelectors';
import type { menuItemType } from 'Reducers/host/menus';
import { Tabs, Tree, Icon, Modal, Input } from 'antd';

import styles from './Host.scss';

function mapStateToProps(state) {
  const { getSystemHost, getCurrentHostShowing } = HostSelectors;
  return {
    systemHost: getSystemHost(state),
    currentHostShowning: getCurrentHostShowing(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(HostMenuActions, dispatch),
    ...bindActionCreators(HostSystemActions, dispatch),
    dispatch
  };
}

type Props = {
  currentHostShowning: string,
  systemHost: string,
  setSystemHost: (content: string) => any
};

class HostShowing extends Component<Props> {
  props: Props;

  componentDidMount() {}

  // TODO: 切换tab不执行unmount 奇怪
  componentWillUnmount() {
    console.log('unmount');
  }

  // 手动同步到host文件
  sync = () => {
    const { currentHostShowning, systemHost, setSystemHost } = this.props;
    if (currentHostShowning !== systemHost) {
      setSystemHost(currentHostShowning);
    }
  };

  render() {
    const { currentHostShowning } = this.props;
    return (
      <div className={styles.setting}>
        <CodeMirror
          width="100%"
          height="100%"
          value={currentHostShowning}
          options={{
            lineNumbers: true,
            readOnly: 'nocursor',
            mode: 'yaml'
          }}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HostShowing);
