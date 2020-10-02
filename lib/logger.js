const figlet = require('figlet')
const chalk = require('chalk')
const clear = require('clear')

module.exports = {

    openingMessage() {
        clear();
        console.log(
            chalk.yellow(
                figlet.textSync('i18n-import-export', { horizontalLayout: 'full' })
            )
        );
    },

    successMessage(message) {
        console.log(
            chalk.bgGreen('\n' + message)
        )
    },

    errorMessage(message) {
        console.log(
            chalk.bgRed('\n' + message)
        )
    }
}