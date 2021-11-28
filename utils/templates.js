// 根据模板创建项目文件
const util = require('util');
const path = require('path');
// const ejs = require('ejs');
const fs = require('fs-extra');
const download = util.promisify(require('download-git-repo')); // 不支持 Promise
const output = require('./output');
const templatesConfig = require('../config/template');
const Inquiry = require('./inquiry');
const Loadding = require('./loadding');

const template = {
    useTemplate,
    writePackageJsonFile,
    downTemplates,
};

// 获取模板请求地址
async function getTemplateUrl(template) {
    if (!templatesConfig[template]) {
        const res = await new Inquiry({
            type: 'confirm',
            name: 'useDefault',
            message: `模板${template}不存在，是否使用默认模板？`
        })
        if (res && res['useDefault']) {
            return templatesConfig['default'];
        }
        throw `模板${template}错误,退出主程序！`;
    }
    return templatesConfig[template];
}

// 下载模板
async function downTemplates(projectPath, template, force = false) {
    try {
        if (force) {
            fs.removeSync(projectPath);
        } else if (fs.pathExistsSync(projectPath)) {
            const res = await new Inquiry({
                type: 'confirm',
                name: 'del',
                message: `${projectPath}目录已存在,是否覆盖？`
            })
            if (res && res['del']) {
                fs.removeSync(projectPath);
            } else {
                throw '当前目录已存在同名的文件夹,退出主程序';
            }
        }
        const url = await getTemplateUrl(template); // 请求地址
        const options = { // 下载参数
            clone: true,
        };
        const loadding = new Loadding('下载代码模板！');
        loadding.start();
        await download(url, projectPath, options);
        loadding.stop();
    } catch (err) {
        output.error(err);
    }
}

function writePackageJsonFile(projectName, projectPath) {
    try {
        const packageJsonPath = path.join(projectPath, '/package.json');
        const packageJson = fs.readJSONSync(packageJsonPath);
        packageJson.name = projectName;
        packageJson.version = '0.0.0';
        fs.writeJSONSync(packageJsonPath, packageJson);
        // output.success('package.json 写入成功');
    } catch (err) {
        output.error(err);
    }
}
// 主函数
async function useTemplate(project) {
    const {
        name: projectName, path: projectPath, template, force,
    } = project;
    await downTemplates(projectPath, template, force);
    this.writePackageJsonFile(projectName, projectPath);
}

module.exports = template;
