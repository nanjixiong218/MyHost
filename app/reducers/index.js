// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import host from './host/host';

const rootReducer = combineReducers({
  counter,
  host,
  router
});

export default rootReducer;
