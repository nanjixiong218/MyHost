// @flow
import { handleAction } from 'redux-actions';
import { changeTab } from 'Actions/host/tabs';
import type { actionType, tabItemType, tabStateType } from '../types';

export default handleAction(
  changeTab,
  (state: tabsStateType, action: actionType) => {
    const activeKey = action.payload;
    return {
      ...state,
      activeKey
    };
  },
  {
    activeKey: '1',
    tabList: [
      {
        key: '1',
        title: 'host设置',
        isActive: true
      },
      {
        key: '2',
        title: '当前生效的host',
        isActive: false
      },
      {
        key: '3',
        title: '原始host',
        isActive: false
      }
    ]
  }
);
