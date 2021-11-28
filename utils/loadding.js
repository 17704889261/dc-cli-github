const ora = require('ora');

class Loadding {
    constructor(message) {
        const spinner = ora(message);
        this.start = () => {
            spinner.start();
        },
        this.stop = () => {
            if (!spinner) return;
            spinner.stop();
        }
    }
}
module.exports = Loadding;
