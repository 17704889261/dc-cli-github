# 一、使用
## 1. 安装脚手架 DC-CLI
```npm i -g dc-cli@0.0.2 --registry=http://yum.bonc.local/nexus/repository/npm-public```
> 提示：目前只有版本 0.0.2 可以使用

## 2. 使用脚手架创建项目

使用命令 `dc-cli create` 项目名字  
> 两个参数：
> 1. -f/--force  
是否覆盖与项目同名的目录,默认: `false` 加上 `-f` 等价于`--fore=true`
`dc-cli create vue -f`

> 2. -t/--template  
后面跟项目的模板名称 类似 vite 那种形式 默认: vue2-ts-webpack 
`dc-cli create vue --template=vue2-ts-webpack`

# 二、开发维护优化

## 1. 目录结构
```
├── bin               -------   cli 入口目录
│   ├── cli.js        -------   cli入口文件 对应 packages.json bin 字段
│   └── project.js    -------   项目的文件
├── build             -------   打包以及发布的目录
│   └── login.js      -------   登录npm 文件
├── config            -------   配置文件
│   └── template.js   -------   模板 远程链接配置文件 key/value 形式
├── utils             -------   工具类目录
│   ├── loadding.js   -------   终端laodding 动画 用的是 ora 
│   ├── logo.js       -------   打印 bonclogo  用的是 figlet
│   ├── output.js     -------   终端输出美化 用的是 chalk
│   ├── shell.js      -------   node 执行shell cross-spawn
│   └── templates.js  -------   远程下载 模板文件 复制目录文件
```
## 2. 整体设计思路
1. 用户交互 (收集用户信息)  
2. 下载合适的模板
3. 个性化需求 (安装插件、多模版组合、模板文件修改等等，所有的自定义操作在这时候执行)
4. 安装依赖
5. 推包到私有npm仓库
### 1. 用户交互 (收集用户信息)  
交互方式：  
a. 用户主动输入  
b. 程序主动询问
#### a. 用户主动输入（使用commander 包）
```
const program = require('commander');  
program
.command('create <app-name>') // 注册命令
.description('create a new project') // 命令描述
.option('-f, --force', 'overwrite target directory if it exist', false) // 添加命令参数
.option('-t, --template <tempalte>', 'select a temaplte', 'default') // 同上
.action((name, options) => { // 命令执行回调
    project.create(name, options);
});

```
#### 添加loadding
导入loadding.js
```
const loadding = new Loadding('下载代码模板！');
loadding.start();
laodding 期间执行的东西
loadding.stop();
```
### b.  程序主动询问（使用 inquirer 包）
```
const Inquiry = require('./inquiry'); // 导入 inquiry.js
const res = await new Inquiry({ // 获取询问结果
    type: 'confirm',
    name: 'del',
    message: `${projectPath}目录已存在,是否覆盖？`
})
if (res && res['del']) {
    fs.removeSync(projectPath);
} else {
    throw '当前目录已存在同名的文件夹,退出主程序';
}
```
> 提示：一定要在 async 修饰的函数中执行。

### 2. 下载合适的模板

```
// 添加模板配置
config/tempaltes.js 找到以下代码，在后面添加一调数据即可
const templatesConfig = {
    default: `${baseUrl}vue2-ts-webpack.git`,
    'vue2-ts-webpack': `${baseUrl}vue2-ts-webpack.git`,
    'vue3-ts-webpack': `${baseUrl}vue3-ts-webpack.git`,
}
// 下载模板
const download = util.promisify(require('download-git-repo')); // 不支持 Promise
const url = await getTemplateUrl(template); // 请求gitlab地址
const options = { // 下载参数
    clone: true,
};
const loadding = new Loadding('下载代码模板！');
loadding.start();
await download(url, projectPath, options); // 异步操作
loadding.stop();
```

### 3. 个性化需求
```
utils/templates.js
// 模板部分的主函数
async function useTemplate(project) {
    const {
        name: projectName, path: projectPath, template, force,
    } = project;
    await downTemplates(projectPath, template, force); // 下载模板文件
    ... 在这里桌个性化需求，下面的修改package.json 就是自定义需求。
    this.writePackageJsonFile(projectName, projectPath); // 修改package.json的name
}

// 多模版组合
多模板混合使用fs-extra 复制指定文件到项目的目录即可。`fs.copySync()`
```
### 4. 安装依赖
```
// cross-spawn 执行脚本 yarn 安装依赖
const spawn = require('cross-spawn');
// 安装依赖
function installDependencies(cwd = './') {
    const child = spawn.sync('yarn', [], { cwd, stdio: 'inherit' });
    const { status } = child;
    if (status !== 0) {
        output.error('依赖安装失败');
        return false;
    }
    return true;
}
```
### 5. 推包到私有npm仓库
提交完代码之后，执行 `npm run pub` 即可 不需要手动登录。
> 提示： 这个命令不可以用yarn 执行。

# 三、npm 私有仓库
账号: admin  
密码: BOnc258..  
上传npm包地址: http://yum.bonc.local/nexus/repository/npm-hosted  
安装npm包地址：http://yum.bonc.local/nexus/repository/npm-public  
> 上传和下载两个地址不一样需要加以区分。
# 四、参考文章 
https://juejin.cn/post/6966119324478079007
# 五、存在的问题
1.下载模板期间可能会询问，git的用户名和密码。如果这个时候出错 或者是 推出程序。需要手动在终端 ctrl + C 终止程序。
2.目前 npm 安装只能用 dc-cli@0.0.2 这种形式 必须加上版本号。
3.更新全局包需要手动卸载在安装。