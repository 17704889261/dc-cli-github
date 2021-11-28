/**
 * LOGO 打印
 */

const figlet = require('figlet');

// 使用 figlet 绘制 Logo
function logoDefault(word) {
    console.log(`\r\n${figlet.textSync(word || 'BONC', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 100,
        whitespaceBreak: true,
    })}`);
}

module.exports = {
    logoDefault,
};
