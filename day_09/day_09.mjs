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

const getFirstEmptyGroupOfSize = (diskMap, size, beforeIndex) => {
  let cursor = 0

  while (cursor < beforeIndex) {
    cursor = diskMap.findIndex((val, i) => i >= cursor && val === '.')

    if (cursor === -1 || cursor >= beforeIndex) {
      return { firstEmptyIndex: -1, firstEmptyGroupLength: 0 }
    }

    const testIndex = diskMap.findIndex((val, i) => i > cursor && val !== '.')
    const lastIndexOfEmptyGroup = testIndex === -1 ? diskMap.length - 1 : testIndex - 1

    if (lastIndexOfEmptyGroup - cursor + 1 >= size) {
      return { firstEmptyIndex: cursor, firstEmptyGroupLength: lastIndexOfEmptyGroup - cursor + 1 }
    }

    cursor = lastIndexOfEmptyGroup + 1
  }

  return { firstEmptyIndex: -1, firstEmptyGroupLength: 0 }
}

const getAllFiles = diskMap => {
  let cursor = 0
  let files = []
  while (cursor < diskMap.length) {
    cursor = diskMap.findIndex((num, i) => i >= cursor && num !== '.')
    const val = diskMap[cursor]

    const testIndex = diskMap.findIndex((num, i) => i >= cursor && num !== val)

    const lastIndexOfFirstGroup = testIndex === -1 ? diskMap.length - 1 : testIndex - 1
    files.push({ val, startingIndex: cursor, length: lastIndexOfFirstGroup - cursor + 1 })
    cursor = lastIndexOfFirstGroup + 1
  }

  return files
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

const partB = fileName => {
  let testNumber = Infinity

  let diskMap = []

  parseInput(fileName).forEach((num, i) => {
    if (i % 2 === 0) {
      Array.from({ length: num }).forEach(() => diskMap.push(i / 2))
    } else {
      diskMap.push(...Array.from({ length: num }).map(() => '.'))
    }
  })

  const files = getAllFiles(diskMap).reverse()

  files.forEach(file => {
    if (file.val > testNumber) console.log('WARNGING', file.val, testNumber)
    testNumber = file.val

    const { firstEmptyIndex } = getFirstEmptyGroupOfSize(diskMap, file.length, file.startingIndex)

    if (firstEmptyIndex > -1) {
      // fill the gap
      diskMap.splice(
        firstEmptyIndex,
        file.length,
        ...Array.from({ length: file.length }).map(() => file.val)
      )

      // replace the file from the end with empty groups
      diskMap.splice(
        file.startingIndex,
        file.length,
        ...Array.from({ length: file.length }).map(() => '.')
      )
    }
  })

  return diskMap.reduce((acc, val, i) => acc + (val !== '.' ? val * i : 0), 0)
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
process('B', 2858, partB)
