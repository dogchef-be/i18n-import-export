const fs = require('fs-extra');
const logger = require('./logger');

module.exports = {
    directoryExists: (filePath) => {
        return fs.existsSync(filePath);
    },

    getFiles: (dir) => {
        return fs.readdirSync(dir)
    },

    readFile: (filePath) => {
        return fs.readFileSync(filePath, { encoding: 'utf8' })
    },

    writeFile: (filePath, data, successMessage) => {
        fs.writeFile(filePath, data, (err) => {
            if (err) throw err

            logger.successMessage(successMessage)
        })
    }
};
