import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .reduce(
      (acc, cur) => {
        const [l, r] = cur.split('   ')
        acc[0].push(l)
        acc[1].push(r)
        return acc
      },
      [[], []]
    )

const partA = fileName => {
  const [left, right] = parseInput(fileName)
  right.sort()

  return left.sort().reduce((acc, cur, i) => acc + Math.abs(cur - right[i]), 0)
}

const partB = fileName => {
  const [left, right] = parseInput(fileName)

  const rightCounts = right.reduce((acc, cur) => {
    acc.set(cur, (acc.get(cur) || 0) + 1)
    return acc
  }, new Map())

  return left.reduce((acc, cur) => acc + cur * (rightCounts.get(cur) || 0), 0)
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_01/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_01/input.txt'))
}

process('A', 11, partA)
process('B', 31, partB)
