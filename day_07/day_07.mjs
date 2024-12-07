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

const calculate = (baseNArr, numbers) =>
  baseNArr.reduce((acc, bit, i) => {
    if (bit === 0) return acc + numbers[i + 1]
    if (bit === 1) return acc * numbers[i + 1]
    return Number(acc.toString().concat(numbers[i + 1]))
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
    const matchFound = Array.from({ length: upperLimit }, (_, i) => i).some(
      i => calculate(toBaseNArray(i, base, upperLimit), numbers) === testValue
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
