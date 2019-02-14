// @flow
import fs from 'fs';
import util from 'util';
import shell from 'shelljs';
import os from 'os';
// import { exec } from 'child_process';
import { exec } from 'child-process-promise';
import { message } from 'antd';
import { createActions } from 'redux-actions';
import * as menuActions from 'Actions/host/menus';
import type { actionType } from '../../reducers/types';

// TODO: shelljs 兼容electron 的写法，后续shelljs会支持: https://github.com/shelljs/shelljs/wiki/Electron-compatibility
const nodeWindowPath = 'E:\\Program Files\\nvm\\v10.15.0';
const nodeMacPath = '/Users/xuhuiyuan/.nvm/versions/node/v10.9.0/bin/node';

const HostFileForWindow = 'C:\\Windows\\System32\\drivers\\etc\\hosts';
const HostFileBakForWindow = 'C:\\Windows\\System32\\drivers\\etc\\hosts.bak';
const HostFileForMac = '/private/etc/hosts';
const HostFileBakForMac = '/private/etc/hosts.bak';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const copyFile = util.promisify(fs.copyFile);

const etcPathForWindow = 'C:\\Windows\\System32\\drivers\\etc\\';
const etcPathForMac = '/private/etc/';

const platform = os.platform()
console.log('platform: ', platform);
let HostFile = HostFileForMac;
let HostFileBak = HostFileBakForMac;
let etcPath = etcPathForMac 
shell.config.execPath = nodeMacPath
if(platform === 'win32') {
  shell.config.execPath = nodeWindowPath
  HostFile = HostFileForWindow;
  HostFileBak = HostFileBakForWindow;
  etcPath = etcPathForWindow;
}


export const {
  changeSystemHost,
  changeAuthored,
  changeOriginHost
} = createActions({
  changeSystemHost: (content: string) => ({
    systemHost: content
  }),
  changeOriginHost: (content: string) => ({
    originHost: content
  }),
  changeAuthored: (authored: boolean) => ({
    hasAuthored: authored
  })
});

// not a action
function getSystemHost() {
  return readFile(HostFile, 'utf-8')
    .then(content => {
      console.log(content);
      return content;
    })
    .catch(e => {
      message.error(`读取host文件失败: ${e.message}`);
    });
}

export function setSystemHost(content) {
  return async (dispatch, getState) =>
    writeFile(HostFile, content)
      .then(() => {
        dispatch(changeSystemHost(content));
        message.info('host重置成功!');
        return content;
      })
      .catch(e => {
        // 文件写入需要打开权限
        message.error(`写入host文件失败: ${e.message}`);
        dispatch(changeAuthored(false));
      });
}

// 程序初始时，authored为false，会进行授权操作，授权后不在进入这里：TODO:  这里不符合单一职责原则，做了很多副作用的事情
export function getAuthored(password) {
  return async (dispatch, getState) => {
    const execObj = shell.exec(`echo "${password}" | sudo -S chmod 777 ${etcPath}`)
    console.log('execObj:', execObj)
    dispatch(changeAuthored(true))
    exec(`echo "${password}" | sudo -S chmod 777 ${etcPath}`)
    .then(result => {
      console.log(`stdout: ${result.stdout}`);
      console.log(`stderr: ${result.stderr}`);
      return exec(
        `echo "${password}" | sudo -S chmod 777 /private/etc/hosts`
      );
    })
    .then(result => {
      dispatch(changeAuthored(true));
      message.info('权限已开!');
      copyFile(HostFile, HostFileBak)
        .then(() => {
          message.info('已生成 host.bak 备份文件');
          return null;
        })
        .catch(e => {
          message.error(`备份文件创建失败: ${e.message}`);
          dispatch(changeAuthored(false));
        });
      getSystemHost()
        .then(content => {
          console.log('content', content);
          dispatch(changeOriginHost(content));
          dispatch(menuActions.changeMenuItem.changeHostText('1', content));
          return null;
        })
        .catch(e => {
          message.error(`读取host文件失败: ${e.message}`);
          dispatch(changeAuthored(false));
        });
      return true;
    })
    .catch(error => {
      if (error.message.indexOf('Password:Sorry, try again') !== -1) {
        message.error(`密码错误请重新输入`);
      } else {
        console.error(`exec error: ${error.message}`);
      }
    });
    const chmodEtc = await exec(
      `echo "${password}" | sudo -S chmod 777 ${etcPath}`
    );
    // if(execObj.code === 0) {
    //   dispatch(changeAuthored(true))
    //   message.error('权限已开!')
    // } else {
    //   message.error('密码错误!')
    // }
  };
}
