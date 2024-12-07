import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => line.split(': '))

const partA = fileName => {
  let total = 0
  parseInput(fileName).forEach(([rawTestValue, rawNumbers]) => {
    const testValue = Number(rawTestValue)
    const numbers = rawNumbers.split(' ').map(Number)

    const upperLimit = 2 ** (numbers.length - 1)

    let counted = false
    for (let i = 0; i <= upperLimit && !counted; i++) {
      const binaryI = i
        .toString(2)
        .padStart((upperLimit - 1).toString(2).length, '0')
        .split('')
        .map(Number)

      const result = binaryI.reduce((acc, bit, index) => {
        return bit === 0 ? acc + numbers[index + 1] : acc * numbers[index + 1]
      }, numbers[0])

      if (result === testValue) {
        total += testValue
        counted = true
      }
    }
  })

  return total
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_07/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_07/input.txt'))
}

process('A', 3749, partA)
