// 复制模板之后执行脚本
const spawn = require('cross-spawn');
const output = require('./output');

function installDependencies(cwd = './') {
    const child = spawn.sync('yarn', [], { cwd, stdio: 'inherit' });
    const { status } = child;
    if (status !== 0) {
        output.error('依赖安装失败');
        return false;
    }
    // output.success('依赖安装成功');
    return true;
}
module.exports = {
    installDependencies,
};
