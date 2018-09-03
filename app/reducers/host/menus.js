// @flow
import { handleActions, combineActions } from 'redux-actions';
import Utils from 'Utils/utils'; // TODO: eslint 仍然不兼容alias
import {
  addMenuItem,
  changeMenuItem,
  deleteMenuItem,
  changeActiveKey,
  changeCheckedKeys
} from 'Actions/host/menus';
import type { actionType, menuItemType, menuStateType } from '../types';

export default handleActions(
  {
    [addMenuItem]: (state: menuStateType, action: actionType) => {
      const { parentKey, newItem } = action.payload;
      const newMenuTree = state.menuTree.slice();
      const { isGroup } = newItem;
      const defaultItem = {
        key: '',
        title: '',
        showOpts: false,
        isEditing: false,
        isGroup: false,
        hostText: '## 可在此处添加host说明',
        children: isGroup
          ? [
              {
                key: String(Date.now()),
                title: 'demo',
                showOpts: false,
                isEditing: false,
                isGroup: false,
                hostText: '## 可在此处添加host说明',
                children: []
              }
            ]
          : []
      };

      Utils.treeAdd(newMenuTree, parentKey, { ...defaultItem, ...newItem });
      return {
        ...state,
        ...{
          menuTree: newMenuTree
        }
      };
    },
    // reducer的复用，action 拆分为多个，reducer复用
    [combineActions(
      changeMenuItem.isEditingToggle,
      changeMenuItem.showOptsToggle,
      changeMenuItem.isGroupToggle,
      changeMenuItem.changeTitle,
      changeMenuItem.changeHostText
    )]: (state: menuStateType, action: actionType) => {
      const { currentKey, newItem } = action.payload;
      const newMenuTree = state.menuTree.slice();
      Utils.treeTravel(newMenuTree, null, (key, item) => {
        const currentNode = item;
        if (currentKey === key) {
          Object.assign(currentNode, newItem);
          return true;
        }
        return false;
      });
      return {
        ...state,
        ...{
          menuTree: newMenuTree
        }
      };
    },
    [deleteMenuItem]: (state: menuStateType, action: actionType) => {
      const { key: deleteKey } = action.payload;
      const newMenuTree = state.menuTree.slice();
      Utils.treeDelete(newMenuTree, deleteKey);
      return {
        ...state,
        ...{
          menuTree: newMenuTree
        }
      };
    },
    [changeActiveKey]: (state: menuStateType, action: actionType) => {
      const activeKey = action.payload;
      return {
        ...state,
        activeKey
      };
    },
    [changeCheckedKeys]: (state: menuStateType, action: actionType) => {
      const checkedKeys = action.payload;
      return {
        ...state,
        checkedKeys
      };
    }
  },
  {
    activeKey: '1',
    checkedKeys: ['1'],
    menuTree: [
      {
        key: '1',
        title: 'default',
        showOpts: false,
        isEditing: false,
        isGroup: false,
        hostText: 'localhost 127.0.0.1',
        children: []
      }
    ]
  }
);
