const inquirer = require('./lib/inquirer')
const formatters = require('./lib/formats/index')
const files = require('./lib/files')
const logger = require('./lib/logger')

const run = async () => {
    const args = process.argv
        .slice(2)
        .map(arg => arg.split('='))
        .reduce((args, [value, key]) => {
            args[value] = key;
            return args;
        }, {});

    logger.openingMessage()

    const action = args.type || (await inquirer.requestAction()).action // export

    const inputPath = args.input || (await inquirer.requestInputPath()).inputPath // js files

    const outputPath = args.output || await inquirer.requestOutputPath().outputPath // csv

    if (!files.directoryExists(inputPath)) {
        logger.errorMessage('Error: input path inserted does not exist.')
        return
    }

    if (!files.directoryExists(outputPath)) {
        logger.errorMessage('Error: output path inserted does not exist.')
        return
    }


    if (action === 'export') {
        const output = formatters.jsFormatter.fromJs(inputPath)
        const langs = formatters.jsFormatter.getLangs(inputPath)
        formatters.csvFormatter.toCsv(output, outputPath, langs)
    }

    if (action === 'import') {
        const output = formatters.csvFormatter.fromCsv(inputPath)
        formatters.jsFormatter.toJs(output, outputPath)
    }
}

run();
