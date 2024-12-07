import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => {
      const [rawTestValue, rawNumbers] = line.split(': ')
      return [Number(rawTestValue), rawNumbers.split(' ').map(Number)]
    })

const calculate = (baseN, numbers) =>
  baseN.reduce((acc, bit, i) => {
    const nextNumber = numbers[i + 1]
    switch (bit) {
      case 0:
        return acc + nextNumber
      case 1:
        return acc * nextNumber
      case 2:
        return Number(acc.toString().concat(nextNumber))
      default:
        return acc
    }
  }, numbers[0])

const toBaseNArray = (num, base, upperLimit) =>
  num
    .toString(base)
    .padStart((upperLimit - 1).toString(base).length, '0')
    .split('')
    .map(Number)

const doMaths = (fileName, base) =>
  parseInput(fileName).reduce((total, [testValue, numbers]) => {
    const upperLimit = base ** (numbers.length - 1)
    const matchFound = Array.from({ length: upperLimit }).reduce(
      (found, _, i) => found || calculate(toBaseNArray(i, base, upperLimit), numbers) === testValue,
      false
    )

    return total + (matchFound ? testValue : 0)
  }, 0)

const partA = fileName => doMaths(fileName, 2)
const partB = fileName => doMaths(fileName, 3)

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_07/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_07/input.txt'))
}

process('A', 3749, partA)
process('B', 11387, partB)
