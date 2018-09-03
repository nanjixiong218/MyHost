// @flow
import { combineReducers } from 'redux';
import tabs from './tabs';
import menus from './menus';
import systemHost from './systemHost';

export default combineReducers({
  tabs,
  menus,
  systemHost
});
