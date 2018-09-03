export type counterStateType = {
  +counter: number
};

// dispatch function type
export type dispatchFunType = () => void;
export type actionType = {
  +type: stirng,
  payload?: any,
  meta?: any,
  error?: any
};

// tabs
export type tabItemType = {
  key: string,
  title: string
};
export type tabsStateType = {
  activeKey: string,
  tabList: Array<tabItemType>
};

// menus

export type menuItemType = {
  key: string,
  title: string,
  showOpts: boolean,
  isEditing: boolean,
  isGroup: boolean,
  hostText: string,
  children: Array<menuItemType>
};

export type menuStateType = {
  activeKey: string,
  checkedKeys: Array<string>,
  menuTree: Array<menuItemType>
};

// systemHost

export type systemHostStateType = {
  hasAuthored: boolean,
  systemHost: string
};
