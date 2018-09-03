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
  return {
    originHost: state.host.systemHost.originHost
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

type Props = {
  originHost: string
};

class OriginHost extends Component<Props> {
  props: Props;

  render() {
    const { originHost } = this.props;
    return (
      <div className={styles.setting}>
        <CodeMirror
          width="100%"
          height="100%"
          value={originHost}
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
)(OriginHost);
