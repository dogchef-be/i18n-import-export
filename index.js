const inquirer = require('./lib/inquirer')
const formatters = require('./lib/formats/index')
const files = require('./lib/files')
const logger = require('./lib/logger')

const run = async () => {

    logger.openingMessage()

    const actionRes = await inquirer.requestAction() // export

    const inputPathRes = await inquirer.requestInputPath() // js files

    const outputPathRes = await inquirer.requestOutputPath() // csv

    if (!files.directoryExists(inputPathRes.inputPath)) {
        logger.errorMessage('Error: input path inserted does not exist.')
        return
    }

    if (!files.directoryExists(outputPathRes.outputPath)) {
        logger.errorMessage('Error: output path inserted does not exist.')
        return
    }


    if (actionRes.action === 'export') {
        const output = formatters.jsFormatter.fromJs(inputPathRes.inputPath)
        const langs = formatters.jsFormatter.getLangs(inputPathRes.inputPath)
        formatters.csvFormatter.toCsv(output, outputPathRes.outputPath, langs)
    }

    if (actionRes.action === 'import') {
        const output = formatters.csvFormatter.fromCsv(inputPathRes.inputPath)
        formatters.jsFormatter.toJs(output, outputPathRes.outputPath)
    }
}

run();