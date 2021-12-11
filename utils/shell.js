// 复制模板之后执行脚本
const spawn = require('cross-spawn');
const output = require('./output');
const Inquiry = require('./inquiry')

// runShell
function runShell(command, args, options) {
    try {
        const child = spawn.sync(command, args, options);
        const { status } = child;
        if (status !== 0) {
            return false;
        }
        return true;
    } catch (err) {
        output.error(err);
    }
}

// 初始化git
async function gitInit(cwd = './') {
    // 1. 通过命令把这个目录变成git可以管理的仓库：
    // git init 

    //2.关联到远程库，这里的远程仓库选择Clone with HTTPS的地址。
    // git remote add origin https://github.com/deepthan/Angular-demo.git
    try {
        const res = runShell('git init', [], { cwd, stdio: 'inherit' });
        if (!res) {
            output.danger("git init 执行失败");
            return res;
        }
        const { useRemote } = await new Inquiry({
             type: 'confirm',
             name: 'useRemote',
             message: '是否添加远程仓库地址！'
         })
         if (!useRemote) return true;
         const { remote } = await new Inquiry({
            type: 'input',
            name: 'remote',
            message: '请输入远程仓库地址！'
        })
        if (!remote) {
            output.danger('远程地址输入为空,暂时不添加远程地址！');
            return true;
        }
        return runShell('git remote add origin', [remote], { cwd, stdio: 'inherit' });
    } catch (err) {
        output.error(err);
    }
}
// 安装依赖
function installDependencies(cwd = './') {
    const res = runShell('yarn', [], { cwd, stdio: 'inherit' });
    if (!res) {
        output.error('依赖安装失败');
    }
    return res;
}
module.exports = {
    runShell,
    gitInit,
    installDependencies,
};