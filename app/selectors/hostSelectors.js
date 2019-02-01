// @flow
import * as Utils from 'Utils/utils';
import { createSelector } from 'reselect';

export const getMenuTree = state => state.host.menus.menuTree;
export const getActiveKey = state => state.host.menus.activeKey;
export const getCheckedKeys = state => state.host.menus.checkedKeys;
export const getSystemHost = state => state.host.systemHost.systemHost;

// TODO: window 换行是/r/n, mac下是/n/n

const ctrlForWindow = '\r\n';
const ctrlForMac = '/n/n';
export const getCurrentHostShowing = createSelector(
  [getMenuTree, getCheckedKeys],
  (menuTree, checkedKeys) => {
    let result = '';
    Utils.treeTravel(menuTree, null, (key, item) => {
      if (checkedKeys.includes(item.key)) {
        result += `#### ${item.title} ${ctrlForWindow}`;
        result += `${item.hostText}`.replace(/\n/g,'\r\n');
        result += `${ctrlForWindow}`;
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
