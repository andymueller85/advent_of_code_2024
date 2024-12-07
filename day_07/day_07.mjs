import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => line.split(': '))

const doMaths = (fileName, base) => {
  let total = 0
  parseInput(fileName).forEach(([rawTestValue, rawNumbers]) => {
    const testValue = Number(rawTestValue)
    const numbers = rawNumbers.split(' ').map(Number)

    const upperLimit = base ** (numbers.length - 1)

    let counted = false
    for (let i = 0; i < upperLimit && !counted; i++) {
      const baseN = i
        .toString(base)
        .padStart((upperLimit - 1).toString(base).length, '0')
        .split('')
        .map(Number)

      const result = baseN.reduce((acc, bit, index) => {
        switch (bit) {
          case 0:
            return acc + numbers[index + 1]
          case 1:
            return acc * numbers[index + 1]
          case 2:
            return parseInt(acc.toString().concat(numbers[index + 1]))
        }
      }, numbers[0])

      if (result === testValue) {
        total += testValue
        counted = true
      }
    }
  })

  return total
}

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
