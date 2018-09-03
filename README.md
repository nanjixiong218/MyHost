# MyHost

最简单的host切换工具！[切换英文](https://github.com/nanjixiong218/MyHost/blob/master/README-zh.md)

## 描述 

之前在阿里内部使用 iHost 进行host管理，简单易用。出来后发现其并没有开放，同类型的产品没有太好用的，索性自己写一个。（目前只支持mac）

## 主要技术栈 

基于 electron-react-boilerplate 生成基础架子，进行一些改造。

1. react 16.x + react-router 4.x + redux 4.x + redux-thunk 2.x
2. antdesign 3.x
3. reselect 3.x
4. redux-actions 3.x
5. webpack 4.x
6. sass

重新定义了几个点：

1. containers 作为页面入口，不在只是redux 关联层。
2. components 作为通用组件层，而非页面渲染层。
3. 改写了 redux的 [bindActionCreators](https://github.com/nanjixiong218/MyHost/blob/master/app/utils/bindActionCreators.js), 使它支持redux-actions, 原来的 bindActionCreators 不支持 actionCreator的对象嵌套 

## Screenshot

![](http://img.shadowvip.com/myHost.png)

## 参与开发

开发环境启动

```bash
$ yarn dev
```

可以独立启动 render 进程和主进程,可以在两个控制台 分别运行以下两个命令:

```bash
$ yarn start-renderer-dev
$ yarn start-main-dev
```

如果你不想在文件改变的时候自动focus, 可以在运行 `dev` 添加 `WITHOUT_FOCUS=true` 的环境变量 

```bash
$ WITHOUT_FOCUS=true yarn dev
```

## 打包 

当前平台打包:

```bash
$ yarn package
```

所有平台打包:

请先阅读参考链接: [Multi Platform Build](https://www.electron.build/multi-platform-build) .


```bash
$ yarn package-all
```

打包时进行一些配置

```bash
$ yarn package -- --[option]
```

端到端测试

```bash
$ yarn build
$ yarn test-e2e
```

想要调试你打包后的程序只需要在打包时添加`DEBUG_PROD=true`的环境变量即可:

```bash
DEBUG_PROD=true yarn package
```

## 如果添加一个模块 


###  模块结构

此 boilerplate 使用了 [two package.json structure](https://github.com/electron-userland/electron-builder/wiki/Two-package.json-Structure). 这意味着会有两个`package.json` 文件.

1. `./package.json` 在项目根目录 
2. `./app/package.json` 在app文件夹 

### 应该使用哪一个 `package.json` 

**主要规则** is: 除了`native`模块, 或者模块带有`native`依赖， 所有的三方模块都应该加入到 `./package.json`. `native`模块或者带有`native`依赖的模块需要加入到 `./app/package.json`.

1. 如果一个模块是和平台管理的native模块(如node-postgres),它应该加入到 `./app/package.json` 的 `dependencies` 中， 
2. 如果一个模块仅仅是被另一个模块 `import`, 它应该加入到 `./package.json` 的 `dependencies` 中 . 请看[this ESLint rule](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md). 比如这些模块`material-ui`, `redux-form`, 和`moment`.
3. 除此之外, 用于打包、测试、调试开发的模块应该加入到 `./package.json` 的 `devDependencies` 中。 

### 进一步阅读 

理解更多关于native 模块的信息，查看此wiki [Module Structure — Two package.json Structure](https://github.com/chentsulin/electron-react-boilerplate/wiki/Module-Structure----Two-package.json-Structure).

一个依赖 native 模块的例子 , see [erb-sqlite-example](https://github.com/amilajack/erb-sqlite-example).

## CSS Modules


除了`.global.css`, 所有的 `.css` 文件都会使用css-modules

如果你有全局样式，添加在`.global.css`不会走css-modules处理，比如`app.global.css`

如果你想要引入全局css包（如 `bootstrap`）, 只需要写在 `.global.css`中

```css
@import '~bootstrap/dist/css/bootstrap.css';
```

## Sass support

把`.css` 改为 `.scss` 即可支持 sass 编译:

```js
import './app.global.scss';
```

## 镜头类型检测 


本项目使用flow进行静态类型检测, 在开发过程中获取 [get Flow errors as ESLint errors](https://github.com/amilajack/eslint-plugin-flowtype-errors), [type errors during runtime](https://github.com/codemix/flow-runtime).

## 主进程中dipatch actions 

查看 [#118](https://github.com/chentsulin/electron-react-boilerplate/issues/118) ,[#108](https://github.com/chentsulin/electron-react-boilerplate/issues/108)

## License

MIT © [nanjixiong218](https://github.com/nanjixiong218)

## TODO

1. 添加测试, 主要逻辑在store层, 所以主要进行redux相关测试，view层测试有时间可以基于jest做一些
2. window 兼容，目前只支持mac