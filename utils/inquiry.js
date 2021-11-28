const inquirer = require('inquirer');
const output = require('./output');

class Inquiry {
    constructor(option, callback) {
        return inquirer.prompt([option])
        .then(answers => {
            // 打印互用输入结果
            const res = answers;
            if (callback && typeof callback === 'function') {
                res = callback(answers);
            }
            return res;
        })
        .catch(error => {
            output.error(error)
        })
    }
}

module.exports = Inquiry;
// 实例
// async function main() {
//     const inq = await new Inquiry({
//         type: 'confirm',
//         name: 'shigou',
//         message: '是否'
//     }, callback)
//     console.log(inq)
// }

// function callback(ask) {
//     console.log(ask);
//     return ask;
// }
// main();