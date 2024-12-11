import * as fs from 'fs'
import { process } from '../utils.mjs'

const parseInput = fileName => fs.readFileSync(fileName, 'utf8').split(/\r?\n\r?\n/)

const parseSection = (section, delimiter) =>
  section.split(/\r?\n/).map(line => line.split(delimiter).map(Number))

const comparatorFactory = orderingRules => (a, b) => {
  const rule = orderingRules.find(rule => rule.includes(a) && rule.includes(b))
  if (!rule) return 0
  return a === rule[0] ? -1 : 1
}

const arraysAreEqual = (a, b) => a.length === b.length && a.every((val, i) => val === b[i])

const processPages = (fileName, adder) => {
  const [rawOrderingRules, rawPagesToProduce] = parseInput(fileName)
  const comparator = comparatorFactory(parseSection(rawOrderingRules, '|'))

  return parseSection(rawPagesToProduce, ',').reduce((acc, curPages) => {
    const curSortedPages = [...curPages].sort(comparator)
    return acc + adder(curPages, curSortedPages)
  }, 0)
}

const partA = fileName =>
  processPages(fileName, (a, b) => (arraysAreEqual(a, b) ? a[Math.floor(a.length / 2)] : 0))

const partB = fileName =>
  processPages(fileName, (a, b) => (arraysAreEqual(a, b) ? 0 : b[Math.floor(b.length / 2)]))

process(5, 'A', 143, partA)
process(5, 'B', 123, partB)
