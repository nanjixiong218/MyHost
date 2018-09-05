/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import oPath from 'path';
import { app, globalShortcut, Menu, Tray, BrowserWindow } from 'electron';
import MenuBuilder from './menu';
// import hostIcon from '../resources/host16x16.png';
// const hostIcon = require('../resources/host16x16.png');


let mainWindow = null;
let tray = null;

// function getResourcePath() {
//   if(process.env.NODE_ENV === 'development') {
//     return oPath.join(__dirname, '../resources')
//   } 
//     return oPath.join(__dirname, '/resources')
  
// }

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  // if (process.platform !== 'darwin') {
  //   app.quit();
  // }
  mainWindow = null;
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  } else if (mainWindow) mainWindow.show();
});

const isSecondInstance = app.makeSingleInstance(
  (commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
        mainWindow.focus();
      }
    }
  }
);

if (isSecondInstance) {
  app.quit();
}

app.on('before-quit', () => {
  app.isQuiting = true;
});

app.on('will-quit', () => {
  // 清空所有快捷键
  globalShortcut.unregisterAll();
});

app.on('ready', createWindow);

async function createWindow() {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  if (!tray) {
    tray = new Tray(oPath.join(__dirname, '../resources/host16x16.png'));
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出MyHost',
      click() {
        app.quit();
      }
    }
  ]);
  tray.setToolTip('MyHost');
  // tray.setContextMenu(contextMenu) // 回覆盖click行为，click默认为popUp
  tray.on('click', () => {
    mainWindow.show();
  });
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.show()
  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.once('ready-to-show', () => {
    if (mainWindow) mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('close', event => {
    if (!app.isQuiting) {
      // 点 X 的时候仅触发close 不进行真正关闭; cmd + Q 的时候先触发 app的before-quit， isQuiting设置为true, 进行真正关闭
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
}
