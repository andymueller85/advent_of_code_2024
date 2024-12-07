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

const calculateResult = (baseN, numbers) =>
  baseN.reduce((acc, bit, index) => {
    switch (bit) {
      case 0:
        return acc + numbers[index + 1]
      case 1:
        return acc * numbers[index + 1]
      case 2:
        return parseInt(acc.toString().concat(numbers[index + 1]))
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

    const matchFound = Array.from({ length: upperLimit }).reduce((found, _, i) => {
      if (found) return true
      return calculateResult(toBaseNArray(i, base, upperLimit), numbers) === testValue
    }, false)

    return total + (matchFound ? testValue : 0)
  }, 0)

const process = (part, expectedAnswer, base) => {
  const sampleAnswer = doMaths('./day_07/sample_input.txt', base)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, doMaths('./day_07/input.txt', base))
}

process('A', 3749, 2)
process('B', 11387, 3)
