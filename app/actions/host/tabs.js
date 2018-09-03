// @flow
import { createAction } from 'redux-actions';
import type { actionType } from '../../reducers/types';

export const changeTab: (key: string) => actionType = createAction(
  'CHANGE_TYPE'
);
export default changeTab;
