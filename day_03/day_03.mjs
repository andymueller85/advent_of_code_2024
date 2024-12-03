import * as fs from 'fs'

const parseInput = fileName => fs.readFileSync(fileName, 'utf8').split(/\r?\n/).filter(Boolean)

const mulRegex = /mul\(\d+,\d+\)/g
const numRegex = /\d+/g
const doString = 'do()'
const dontString = `don't()`

const partA = fileName =>
  [...parseInput(fileName).join('').matchAll(mulRegex)].reduce((acc, cur) => {
    const [a, b] = cur[0].match(numRegex).map(Number)
    return acc + a * b
  }, 0)

const partB = fileName =>
  parseInput(fileName)
    .join('')
    .split(doString)
    .reduce((total, section) => {
      const rawInstructions = section.includes(dontString)
        ? section.substring(0, section.indexOf(dontString))
        : section

      const matches = [...rawInstructions.matchAll(mulRegex)]

      return (
        total +
        matches.reduce((acc, cur) => {
          const [a, b] = cur[0].match(numRegex).map(Number)
          return acc + a * b
        }, 0)
      )
    }, 0)

const process = (part, sampleFile, expectedAnswer, fn) => {
  const sampleAnswer = fn(sampleFile)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_03/input.txt'))
}

process('A', './day_03/sample_input.txt', 161, partA)
process('B', './day_03/sample_input_b.txt', 48, partB)
