import * as fs from 'fs'

const parseInput = fileName => fs.readFileSync(fileName, 'utf8')

const DO_STRING = 'do()'
const DONT_STRING = `don't()`
const MUL_REGEX = /mul\(\d+,\d+\)/g
const NUM_REGEX = /\d+/g

const processMulInstructions = rawInstructions =>
  [...rawInstructions.matchAll(MUL_REGEX)].reduce((acc, cur) => {
    const [a, b] = cur[0].match(NUM_REGEX).map(Number)
    return acc + a * b
  }, 0)

const partA = fileName => processMulInstructions(parseInput(fileName))

const partB = fileName =>
  parseInput(fileName)
    .split(DO_STRING)
    .reduce((acc, section) => acc + processMulInstructions(section.split(DONT_STRING)[0]), 0)

const process = (part, sampleFile, expectedAnswer, fn) => {
  const sampleAnswer = fn(sampleFile)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_03/input.txt'))
}

process('A', './day_03/sample_input_a.txt', 161, partA)
process('B', './day_03/sample_input_b.txt', 48, partB)
