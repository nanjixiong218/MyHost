// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import cs from 'classnames';
import routes from 'Constants/routes.json';
import { connect } from 'react-redux';
import * as CounterActions from 'Actions/counter';
import * as HostTabActions from 'Actions/host/tabs';
import type { menuItemType } from 'Reducers/types';
import { Tabs, Icon, Input, Modal } from 'antd';

import styles from './Host.scss';

const { TabPane } = Tabs;

type Props = {
  node: menuItemType,
  pNode: menuItemType | null,
  actions: {
    addMenuItem: (parentKey: string, newItem: menuItemType) => void,
    deleteMenuItem: (deleteKey: string) => void,
    changeMenuItem: {
      isEditingToggle: (currentKey: string, isEditing: boolean) => void,
      showOptsToggle: (currentKey: string, isShowing: boolean) => void,
      changeTitle: (currentKey: string, title: string) => void,
      changeHostText: (currentKey: string, hostText: string) => void
    }
  }
};

class HostTitle extends Component<Props> {
  props: Props;

  add = e => {
    e.stopPropagation();
    const {
      node,
      pNode,
      actions: { addMenuItem }
    } = this.props;
    addMenuItem(node.key, {
      key: String(Date.now()),
      title: '',
      isEditing: true
    });
  };

  delete = () => {
    const {
      node,
      actions: { deleteMenuItem }
    } = this.props;
    Modal.confirm({
      title: '你确定要删除此host设置么？',
      onOk: () => {
        deleteMenuItem(node.key);
      }
    });
  };

  edit = e => {
    e.stopPropagation();
    const {
      node,
      actions: { changeMenuItem }
    } = this.props;
    changeMenuItem.isEditingToggle(node.key, true);
  };

  onNodeTitileChange = e => {
    const {
      node,
      actions: { changeMenuItem }
    } = this.props;
    const newTitle = e.target.value;
    changeMenuItem.changeTitle(node.key, newTitle);
  };

  onNodeKeyDown = e => {
    const {
      node,
      actions: { changeMenuItem }
    } = this.props;
    if (e.keyCode === 13) {
      changeMenuItem.isEditingToggle(node.key, false);
    }
  };

  onInputBlur = e => {
    const {
      node,
      actions: { changeMenuItem }
    } = this.props;
    changeMenuItem.isEditingToggle(node.key, false);
  };

  render() {
    const { node, pNode } = this.props;
    const nodeCs = cs({
      [styles.node]: true
      // [styles['']: true,
    });
    return (
      <div className={styles.node}>
        {node.isEditing ? (
          <Input
            size="small"
            value={node.title}
            autoFocus
            onChange={this.onNodeTitileChange}
            onKeyDown={this.onNodeKeyDown}
            onBlur={this.onInputBlur}
          />
        ) : (
          [
            <div key="1" className={styles['node--text']} title={node.title}>
              {node.title}
            </div>,
            <div key="2" className={styles['node--edit']}>
              <Icon type="edit" onClick={this.edit} />
            </div>,
            node.isGroup ? (
              <div key="3" className={styles['node--plus']}>
                <Icon type="plus-circle" onClick={this.add} />
              </div>
            ) : null,
            <div key="4" className={styles['node--delete']}>
              <Icon type="delete" onClick={this.delete} />
            </div>
          ]
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tabList: state.host.tabs.tabList,
    activeKey: state.host.tabs.activeKey
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(HostTabActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HostTitle);
