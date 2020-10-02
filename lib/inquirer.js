const inquirer = require('inquirer');

module.exports = {
    requestAction: () => {
        return inquirer.prompt(
            {
                name: 'action',
                type: 'input',
                message: 'Enter what action you pretend to perform (import or export):',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter what action you pretend to perform (import or export).';
                    }
                }
            }
        )
    },

    requestInputPath: () => {
        return inquirer.prompt(
            {
                name: 'inputPath',
                type: 'input',
                message: 'Enter the path to the directory where the input file(s) are stored:',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter the path to the directory where the input file(s) are stored.';
                    }
                }
            }
        )
    },

    requestOutputPath: () => {
        return inquirer.prompt(
            {
                name: 'outputPath',
                type: 'input',
                message: 'Enter the path to the directory where the output file(s) will be stored:',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter the path to the directory where the output file(s) will be stored.';
                    }
                }
            }
        )
    },
}