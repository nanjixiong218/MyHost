// @flow
import { createActions } from 'redux-actions';
import type { actionType, menuItemType } from '../../reducers/types';

const changeItemProp = (propName: string) => (
  currentKey: string,
  value: any
) => {
  const newItem = {
    [propName]: value
  };
  if (propName === 'isGroup') {
    // 非group变成group默认添加一条子元素, 暂时不存在group变成非group的场景
    newItem.children = [
      {
        key: String(Date.now()),
        title: 'demo',
        showOpts: false,
        isEditing: false,
        isGroup: false,
        hostText: '## 可在此处添加host说明',
        children: []
      }
    ];
  }
  return {
    currentKey,
    newItem
  };
};

const actions = createActions(
  {
    // 这里的设计要思考把payload的生成交给view层处理还是在action层里, 交给业务调用层，那么基本所有的action都是Identity Action
    // 我倾向于放在这里更合适，暴露给view层调用方的是更简洁直观的函数，业务逻辑封装在Action中, 同时更方便测试
    // 不过也要权衡action的复杂性
    ADD_MENU_ITEM: (parentKey: string | null, newItem: any): any => ({
      parentKey,
      newItem
    }),
    // 这里同样值得思考，menuItem的改变会有很多种，改名字，改isEditing的状态，改showOpt的状态，改hostText
    // 那么可以只用这一个action， 把menuItem的变化处理教给调用处，也可以设计多个action，最终都是进行menuItem的更新
    // TODO: 这里就需要权衡下了，增加action好，还是增加调用处的逻辑好, 我之前的做法都是减少action， 这次选择增加action
    // 增加action可是使用combineActions进行reduce 复用，所以这个设计更合理
    CHANGE_MENU_ITEM: {
      // TODO: 这里的前四个action实际上内部行为一直，要不要抽象一下，可以考虑
      IS_EDITING_TOGGLE: (key: string, isEditing: boolean) =>
        changeItemProp('isEditing')(key, isEditing),
      SHOW_OPTS_TOGGLE: (key: string, isShow: boolean) =>
        changeItemProp('showOpts')(key, isShow),
      CHANGE_TITLE: (key: string, title: string) =>
        changeItemProp('title')(key, title),
      CHANGE_HOST_TEXT: (key: string, hostText: string) =>
        changeItemProp('hostText')(key, hostText),
      IS_GROUP_TOGGLE: (key: string, isGroup: boolean) =>
        changeItemProp('isGroup')(key, isGroup)
    },

    DELETE_MENU_ITEM: (deleteKey: string): any => ({
      key: deleteKey
    })
  },
  'CHANGE_ACTIVE_KEY',
  'CHANGE_CHECKED_KEYS'
);
export default actions;
