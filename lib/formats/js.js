const files = require('../files')

function getLangs(inputPath) {
    const filesName = files.getFiles(inputPath)
    const langs = []
    for (const fileName of filesName) {
        const output = getOutput(inputPath, fileName)
        if (output) {
            langs.push(fileName.split('.')[0])
        }
    }
    return langs
}

function fromJs(inputPath) {
    // get files from dir
    const filesName = files.getFiles(inputPath)

    // get output from each file
    const outputs = []
    const langs = []
    for (const fileName of filesName) {
        const output = getOutput(inputPath, fileName)
        if (output) {
            langs.push(fileName.split('.')[0])
            outputs.push(output)
        }
    }

    // merge outputs
    const result = mergeOutputs(langs, outputs)

    // return merged outputs
    return result
}

function toJs(output, outputPath) {
    for (const [lang, translations] of Object.entries(output)) {
        const filePath = outputPath + '/' + lang + '.js'

        // Capture key double quotes
        const regex = /(?<=^[\s]*)"|(?<!\\)"(?=:)/gm
        const stringifiedOutput = JSON.stringify(translations, null, '   ').replace(regex, '')

        files.writeFile(filePath, 'export default ' + stringifiedOutput, 'File created at ' + filePath)
    }
}

function getOutput(inputPath, file) {
    const filePath = inputPath + '/' + file

    let data = files.readFile(filePath)

    data = data.replace(/^[^\{]+/gs, '')

    // HACK: Transform into json
    const translations = eval('(' + data + ')')

    return flatObject(translations)
}

function flatObject(obj, keyPrefix = '') {
    let flatted = {}
    for (const [key, value] of Object.entries(obj)) {
        const completeKey = keyPrefix + (keyPrefix ? '.' : '') + key
        if (typeof value === 'object') {
            flatted = Object.assign(flatted, flatObject(value, completeKey))
        } else {
            flatted[completeKey] = value
        }
    }
    return flatted
}

function mergeOutputs(langs, outputs) {
    const result = {}
    for (let i = 0; i < outputs.length; i++) {
        const currentLang = langs[i]
        for (const [key, value] of Object.entries(outputs[i])) {
            if (!result.hasOwnProperty(key)) {
                result[key] = {}
            }
            result[key][currentLang] = value
        }
    }
    return result
}

module.exports = { getLangs, fromJs, toJs }