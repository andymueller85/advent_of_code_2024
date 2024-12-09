import * as fs from 'fs'

const parseInput = fileName => fs.readFileSync(fileName, 'utf8').trim().split('').map(Number)

const gapsExist = diskMap => diskMap.includes('.')
const fillGap = diskMap => {
  const num = diskMap.pop()
  if (num !== '.') {
    const emptyIndex = diskMap.indexOf('.')
    diskMap[emptyIndex] = num
  }
}

const partA = fileName => {
  const diskMap = []

  parseInput(fileName).forEach((num, i) => {
    if (i % 2 === 0) {
      Array.from({ length: num }).forEach(() => diskMap.push(i / 2))
    } else {
      diskMap.push(...Array.from({ length: num }).map(() => '.'))
    }
  })

  while (gapsExist(diskMap)) fillGap(diskMap)

  return diskMap.reduce((acc, num, i) => acc + num * i, 0)
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_09/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_09/input.txt'))
}

process('A', 1928, partA)
