import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => line.split(' ').map(Number))

const isSorted = (arr, comparator) => arr.every((num, i) => i === 0 || comparator(arr[i - 1], num))
const isAscending = arr => isSorted(arr, (a, b) => a <= b)
const isDescending = arr => isSorted(arr, (a, b) => a >= b)
const isBetween = (num, min, max) => num >= min && num <= max
const isGradual = arr =>
  arr.every((num, i) => i === 0 || isBetween(Math.abs(arr[i - 1] - num), 1, 3))
const isSafe = arr => (isAscending(arr) || isDescending(arr)) && isGradual(arr)

const partA = fileName => parseInput(fileName).filter(isSafe).length

const partB = fileName =>
  parseInput(fileName).filter(
    report =>
      isSafe(report) ||
      report.some((_, i) => isSafe([...report.slice(0, i), ...report.slice(i + 1)]))
  ).length

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_02/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_02/input.txt'))
}

process('A', 2, partA)
process('B', 4, partB)
