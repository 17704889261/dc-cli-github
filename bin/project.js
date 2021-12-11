const path = require('path');
const output = require('../utils/output');
const { logoDefault } = require('../utils/logo');
const template = require('../utils/templates');
const { installDependencies, gitInit } = require('../utils/shell');

const project = {
    name: '',
    path: '',
    template: '',
    force: false,
    create: createProject,
    logo: logoDefault,
};

// 创建项目主函数
async function createProject(projectName, options) {
    // output.info('开始执行cli');
    try {
        if (!projectName) {
            return;
        }
        /**
         * 1
         * 获取 命令参数
         */
        const cwdpath = process.cwd(); // 当前终端目录
        this.name = projectName; // 项目名称
        if (['.', './'].includes(projectName)) {
            this.name = cwdpath.split('/').pop();
        }
        this.path = path.join(cwdpath, this.name); // 要创建的项目的路径

        // 设置参数
        const { force, template: templateName } = options;
        this.template = templateName; // 项目使用的模板
        this.force = force;

        /**
         * 2
         * 使用模板
         */
        await template.useTemplate(this);

        /**
         * 3
         * git init -> 安装依赖
         */
        const initRes = await gitInit(this.path);
        if (!initRes) {
            output.error('git 初始化失败！');
        }
        const res = installDependencies(this.path);
        if (res) {
            output.success('项目创建成功！');
            output.info(`CD ${projectName}`);
            output.info('yarn serve');
        } else {
            output.error('项目创建失败！');
        }
    } catch (error) {
        output.error(error);
    }
}

module.exports = project;
