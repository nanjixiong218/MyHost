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
import { Tabs, Checkbox, Radio, Form, Tree, Icon, Modal, Input } from 'antd';

import NodeTitle from './NodeTitle';
import styles from './Host.scss';

const { TabPane } = Tabs;
const { TreeNode } = Tree;
const { Item: FormItem } = Form;
const { Group: RadioGroup } = Radio;

const formItemWrapper = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};

function mapStateToProps(state) {
  const {
    getMenuTree,
    getActiveKey,
    getCheckedKeys,
    getCurrentHostText,
    getCurrentHostShowing
  } = HostSelectors;
  return {
    menuTree: getMenuTree(state),
    activeKey: getActiveKey(state),
    checkedKeys: getCheckedKeys(state),
    currentHostText: getCurrentHostText(state),
    currentHostShowning: getCurrentHostShowing(state),
    systemHost: state.host.systemHost.systemHost
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
  addMenuItem: (parentKey: string, newItem: menuItemType) => void,
  deleteMenuItem: (deleteKey: string) => void,
  changeActiveKey: (activeKey: string) => void,
  changeCheckedKeys: (checkedKeys: Array<string>) => void,
  changeMenuItem: {
    isEditingToggle: (currentKey: string, isEditing: boolean) => void,
    showOptsToggle: (currentKey: string, isShowing: boolean) => void,
    changeTitle: (currentKey: string, title: string) => void,
    changeHostText: (currentKey: string, hostText: string) => void
  },
  dispatch: Function,
  menuTree: Array<menuItemType>,
  activeKey: string,
  checkedKeys: Array<string>,
  systemHost: string,
  currentHostText: string,
  currentHostShowning: string
};

class HostSet extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.newKey = '';
    this.state = {
      addModalVisible: false
    };
  }

  add = e => {
    const { changeMenuItem } = this.props;
    const newTitle = e.target.value;
    changeMenuItem.changeTitle(this.newKey, newTitle);
  };

  isGroupChange = e => {
    const { changeMenuItem } = this.props;
    const { value } = e.target;
    changeMenuItem.isGroupToggle(this.newKey, value === '1');
  };

  showAddModal = () => {
    const { addMenuItem } = this.props;
    this.newKey = String(Date.now());
    addMenuItem(null, {
      key: this.newKey,
      title: ''
    });
    this.setState({
      addModalVisible: true
    });
  };

  onAddModalOk = () => {
    this.setState({
      addModalVisible: false
    });
  };

  onTreeSelect = (selectedKeys, e) => {
    const { changeActiveKey } = this.props;
    if (e.selected) {
      changeActiveKey(selectedKeys[0]);
    } else {
      changeActiveKey('');
    }
  };

  // 让当前host生效
  onTreeCheck = (checkedKeys, e) => {
    const { currentHostShowning, changeCheckedKeys } = this.props;
    changeCheckedKeys(checkedKeys);
  };

  onAddModalCancel = () => {
    const { deleteMenuItem } = this.props;
    deleteMenuItem(this.newKey);
    this.setState({
      addModalVisible: false
    });
  };

  onCodemirrorChange = (inst, obj) => {
    const {
      systemHost,
      activeKey,
      changeMenuItem,
      currentHostShowning
    } = this.props;
    const newValue = inst.getValue();
    changeMenuItem.changeHostText(activeKey, newValue);
  };

  renderTreeNode(treeData, parentNode) {
    const { dispatch } = this.props;
    return treeData.map(node => {
      if (node.children && node.children.length > 0) {
        return (
          <TreeNode
            selectable={!node.isGroup}
            title={
              <NodeTitle
                node={node}
                pNode={parentNode}
                actions={bindActionCreators(HostMenuActions, dispatch)}
              />
            }
            key={node.key}
          >
            {this.renderTreeNode(node.children, node)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={
            <NodeTitle
              node={node}
              pNode={parentNode}
              actions={bindActionCreators(HostMenuActions, dispatch)}
            />
          }
          key={node.key}
        />
      );
    });
  }

  getNewItem(newKey) {
    const { menuTree } = this.props;
    let newItem;
    Utils.treeTravel(menuTree, null, (key, item) => {
      if (item.key === newKey) {
        newItem = item;
        return true;
      }
    });
    return newItem;
  }

  render() {
    const { addModalVisible } = this.state;
    const { menuTree, activeKey, checkedKeys, currentHostText } = this.props;
    const newItem = this.getNewItem(this.newKey);
    return (
      <div className={styles.setting}>
        <div className={styles.mainNav}>
          <Tree
            defaultExpandAll
            checkable
            checkedKeys={checkedKeys}
            selectedKeys={[activeKey]}
            className={styles.nametree}
            onSelect={this.onTreeSelect}
            onCheck={this.onTreeCheck}
          >
            {this.renderTreeNode(menuTree, null)}
          </Tree>
          <div className={styles.operater}>
            <span
              tabIndex="0"
              role="button"
              className={styles['operater--plus']}
              onClick={this.showAddModal}
              onKeyDown={() => {}}
            >
              <Icon type="plus" />
            </span>
          </div>
        </div>
        <div className={styles.hostEdit}>
          {activeKey === '' ? (
            '请在左侧选择要设置的host'
          ) : (
            <CodeMirror
              width="100%"
              height="100%"
              value={currentHostText}
              onChange={this.onCodemirrorChange}
              options={{
                lineNumbers: true,
                mode: 'yaml'
              }}
            />
          )}
        </div>

        <Modal
          visible={addModalVisible}
          title="创建一个新的host或者group"
          onOk={this.onAddModalOk}
          onCancel={this.onAddModalCancel}
        >
          <Form>
            <FormItem label="是否创建为group" {...formItemWrapper}>
              <RadioGroup
                value={newItem && newItem.isGroup ? '1' : '0'}
                onChange={this.isGroupChange}
              >
                <Radio key="1" value="1">
                  是
                </Radio>
                <Radio key="0" value="0">
                  否
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="名字" {...formItemWrapper}>
              <Input value={newItem && newItem.title} onChange={this.add} />
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HostSet);
