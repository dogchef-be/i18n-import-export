const files = require('../files')
const logger = require('../logger')
const merge = require('merge-deep')

function fromCsv(filePath) {
    const data = files.readFile(filePath + '/translation.csv')

    const lines = data.split(/\r?\n/)
    const langs = {}
    for (const lang of lines.shift().split(',').slice(1)) {
        langs[lang] = {}
    }

    for (const line of lines) {
        // Split only the the correct commas
        const entries = line.split(/(?<=^[^"]*(?:"[^"]*"[^"]*)*),/g)

        const key = entries.shift()

        for (const [index, entry] of entries.entries()) {
            langs[Object.keys(langs)[index]][key] = entry
        }
    }

    let output = {}
    for (const [langKey, langObj] of Object.entries(langs)) {
        output[langKey] = stretchObject(langObj)
    }

    return output
}

function toCsv(output, outputPath, langs) {
    // Header
    let data = 'keys'
    for (const lang of langs) {
        data += ',' + lang
    }
    data += '\n'

    // Lines
    for (const [key, object] of Object.entries(output)) {
        let line = ''
        let nbEntries = 0
        for (const [lang, value] of Object.entries(object)) {
            line += ',"' + value.replace(/"/g, '""') + '"'
            nbEntries++
        }

        // Handle missing entries in any lang file
        while (nbEntries < langs.length) {
            line += ',""'
            nbEntries++
        }

        data += key + line + '\n'
    }

    // Create the .csv file
    const filePath = outputPath + '/translation.csv'
    files.writeFile(filePath, data, 'File created at ' + filePath)
}

function stretchObject(obj) {
    const stretched = {}

    // REGEX: Only capture first dot
    const regex = /(?<![\.].*)\./

    for (const [key, value] of Object.entries(obj)) {
        // Only capture first dot
        const subKeys = key.split(regex)

        if (subKeys.length > 1) {
            const subObj = {}
            subObj[subKeys[1]] = value

            stretched[subKeys[0]] = stretched[subKeys[0]]
                ? merge(stretched[subKeys[0]], stretchObject(subObj))
                : stretchObject(subObj)
        } else {
            // Transform 2 double quotes into 1 double quotes
            // and remove start and end double quotes
            stretched[key] = value
                .replace(/(?<=^".*)""(?=.*"$)/g, '"')
                .replace(/^"|"$/g, '')
        }
    }
    return stretched
}

module.exports = { fromCsv, toCsv }