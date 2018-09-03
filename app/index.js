import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import storage from 'electron-json-storage';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';

storage.get('HostState-xu', (error, initialState) => {
  let store = configureStore();
  if (Object.keys(initialState).length > 0) {
    // 说明不是初始化
    store = configureStore(initialState);
  }
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );

  if (module.hot) {
    module.hot.accept('./containers/Root', () => {
      const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
      render(
        <AppContainer>
          <NextRoot store={store} history={history} />
        </AppContainer>,
        document.getElementById('root')
      );
    });
  }
});
