// @flow
import { handleActions, combineActions } from 'redux-actions';
import {
  changeSystemHost,
  changeOriginHost,
  changeAuthored
} from 'Actions/host/systemHost';
import type { actionType, systemHostStateType } from '../types';

export default handleActions(
  {
    [combineActions(changeSystemHost, changeOriginHost, changeAuthored)]: (
      state: systemHostStateType,
      action: actionType
    ) => {
      const newSystem = action.payload;
      return {
        ...state,
        ...newSystem
      };
    }
  },
  {
    hasAuthored: false,
    systemHost: '',
    originHost: ''
  }
);
