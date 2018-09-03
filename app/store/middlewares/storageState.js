// @flow
import storage from 'electron-json-storage';
// 同步 store 到某个文件的持久化存储中间件, 基于electron-json-storage做存储
const storageState = store => dispatch => action => {
  dispatch(action);
  const nextState = store.getState();
  const { menuTree, checkedKeys } = nextState.host.menus;
  const { systemHost } = nextState.host.systemHost;
  const defaultDataPath = storage.getDefaultDataPath();
  const dataPath = storage.getDataPath();
  console.log('paths:', defaultDataPath, dataPath);
  storage.set('HostState-xu', nextState); // 会创建一个HostState-xu.json的文件，尽可能保证唯一性，不与其他应用冲突
};
export default storageState;
