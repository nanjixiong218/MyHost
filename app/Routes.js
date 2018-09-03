/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes.json';
import App from './containers/App';
import Home from './containers/Home/Home';
import Counter from './containers/Counter/Counter';
import Host from './containers/Host/Host';

export default () => (
  <App>
    <Switch>
      <Route path={routes.COUNTER} component={Counter} />
      <Route path={routes.HOST} component={Host} />
      <Route path={routes.HOME} component={Host} />
    </Switch>
  </App>
);
