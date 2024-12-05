import * as fs from 'fs'

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
  processPages(fileName, (pages, sortedPages) =>
    arraysAreEqual(pages, sortedPages) ? pages[Math.floor(pages.length / 2)] : 0
  )

const partB = fileName =>
  processPages(fileName, (pages, sortedPages) =>
    arraysAreEqual(pages, sortedPages) ? 0 : sortedPages[Math.floor(sortedPages.length / 2)]
  )

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_05/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_05/input.txt'))
}

process('A', 143, partA)
process('B', 123, partB)
