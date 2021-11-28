#! /usr/bin/env node

const program = require('commander');
const pack = require('../package.json');
const project = require('./project');
// 定义命令和参数
program
    .command('create <app-name>')
    .description('create a new project')
    .option('-f, --force', 'overwrite target directory if it exist', false)
    .option('-t, --template <tempalte>', 'select a temaplte', 'default')
    .action((name, options) => {
        project.create(name, options);
    });

// 配置版本号信息
program
    .version(`v${pack.version}`)
    .usage('<command> [option]');

program
    .on('--help', () => {
        project.logo();
    });
// 解析用户执行命令传入参数
program.parse(process.argv);
