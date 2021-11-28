const { exec } = require('child_process');
const { exit } = require('process');

const username = 'admin';
const password = 'BOnc258..';
const email = 'admin@example.org';

// 获取登录信息
function getUserName() {
    const whoami = exec('npm whoami --registry=http://yum.bonc.local/nexus/repository/npm-hosted');
    whoami.stdout.on('data', (name) => {
        if (name && typeof name === 'string' && name.trim() === username) {
            console.log(`当前登录的用户是组件库的npm账户可以直接publish， 账户名称：${name}`);
            exit();
        } else if (name) {
            logout();
        }
    });

    whoami.stderr.on('data', (error) => {
        if (error && error.includes('ERR! code ENEEDAUTH')) {
            login();
        }
    });
}

// 退出登录
function logout() {
    const npmLogout = exec('npm logout --registry=http://yum.bonc.local/nexus/repository/npm-hosted');
    npmLogout.stdout.on('data', (data) => {
        if (data) {
            console.log('退出登录成功，开始登录npm账号');
            login();
        }
    });
    npmLogout.stderr.on('data', (data) => {
        if (data && data.includes('ERR! Not logged in to')) {
            console.error('npm 未登录，现在开始登陆。');
            login();
        }
    });
}

// 登录
function login() {
    const inputArr = [
        `${username}\n`,
        `${password}\n`,
        `${email}\n`,
    ];

    const npmLogin = exec('npm login --registry=http://yum.bonc.local/nexus/repository/npm-hosted');

    npmLogin.stdout.on('data', (data) => {
        const cmd = inputArr.shift();
        if (cmd) {
            console.log(`输入信息: ${cmd}`);
            npmLogin.stdin.write(cmd);
        } else {
            npmLogin.stdin.end();
            console.log('登陆成功');
            exit();
        }
    });

    npmLogin.stderr.on('data', (error) => {
        if (error) {
            console.log(`npm login 失败，错误信息：${error}`);
        }
    });
}

// 主程序
function main() {
    getUserName();
}

main();
