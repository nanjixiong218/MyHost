// @flow
import * as Utils from 'Utils/utils';
import { createSelector } from 'reselect';

export const getMenuTree = state => state.host.menus.menuTree;
export const getActiveKey = state => state.host.menus.activeKey;
export const getCheckedKeys = state => state.host.menus.checkedKeys;
export const getSystemHost = state => state.host.systemHost.systemHost;

export const getCurrentHostShowing = createSelector(
  [getMenuTree, getCheckedKeys],
  (menuTree, checkedKeys) => {
    let result = '';
    Utils.treeTravel(menuTree, null, (key, item) => {
      if (checkedKeys.includes(item.key)) {
        result += `#### ${item.title} \n\n`;
        result += item.hostText;
        result += `\n\n`;
      }
    });
    return result;
  }
);

export const getCurrentHostText = createSelector(
  [getMenuTree, getActiveKey],
  (menuTree, activeKey) => {
    let result = '';
    Utils.treeTravel(menuTree, null, (key, item) => {
      if (item.key === activeKey) {
        result = item.hostText;
        return true;
      }
    });
    return result;
  }
);
