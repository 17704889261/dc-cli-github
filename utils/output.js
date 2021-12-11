const chalk = require('chalk');

const output = {
    success: (msg) => { console.log(chalk.green(msg)); },
    error: (msg) => { console.log(chalk.red(msg)); process.exit(); },
    danger: (msg) => { console.log(chalk.red(msg)); },
    info: (msg) => { console.log(chalk.white(msg)); },
};

module.exports = output;
