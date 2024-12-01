import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(d => d)
    .reduce(
      (acc, cur) => {
        const [lArr, rArr] = acc
        const [l, r] = cur.split('   ')

        return [
          [...lArr, l],
          [...rArr, r]
        ]
      },
      [[], []]
    )

const partA = fileName => {
  const [left, right] = parseInput(fileName)
  right.sort()

  return left.sort().reduce((acc, cur, i) => acc + Math.abs(cur - right[i]), 0)
}

// could be made more efficient by keeping track of duplicate values on left
const partB = fileName => {
  const [left, right] = parseInput(fileName)

  return left.reduce((acc, cur) => acc + cur * right.filter(x => x === cur).length, 0)
}

const process = (part, sampleFile, expectedAnswer, fn) => {
  const sampleAnswer = fn(sampleFile)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_01/input.txt'))
}

process('A', './day_01/sample_input.txt', 11, partA)
process('B', './day_01/sample_input.txt', 31, partB)
