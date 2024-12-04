import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => line.split(''))

const swapXY = grid => grid[0].map((_, i) => grid.map(row => row[i]))

const findMatches = str => [
  ...str.matchAll(new RegExp('XMAS', 'gi')),
  ...str.matchAll(new RegExp('SAMX', 'gi'))
]

const getDiagonals = (grid, ascending = true) => {
  const result = []
  const numRows = grid.length
  const numCols = grid[0].length

  for (let d = 0; d < numRows + numCols - 1; d++) {
    const diagonal = []
    for (let row = 0; row <= d; row++) {
      const col = d - row
      if (row < numRows && col >= 0 && col < numCols) {
        if (ascending) {
          diagonal.push(grid[row][col])
        } else {
          diagonal.push(grid[numRows - 1 - row][col])
        }
      }
    }
    result.push(diagonal)
  }

  return result
}

const partA = fileName => {
  const grid = parseInput(fileName)
  const reducer = (acc, row) => acc + findMatches(row.join('')).length

  return (
    grid.reduce(reducer, 0) +
    swapXY(grid).reduce(reducer, 0) +
    getDiagonals(grid).reduce(reducer, 0) +
    getDiagonals(grid, false).reduce(reducer, 0)
  )
}

const partB = fileName => {
  const grid = parseInput(fileName)

  let count = 0

  for (let i = 1; i < grid.length - 1; i++) {
    for (let j = 1; j < grid[i].length - 1; j++) {
      if (grid[i][j] === 'A') {
        const topLeft = grid[i - 1][j - 1]
        const topRight = grid[i - 1][j + 1]
        const bottomLeft = grid[i + 1][j - 1]
        const bottomRight = grid[i + 1][j + 1]

        if (
          (topLeft === 'M' && topRight === 'M' && bottomLeft === 'S' && bottomRight === 'S') ||
          (topLeft === 'S' && topRight === 'S' && bottomLeft === 'M' && bottomRight === 'M') ||
          (topLeft === 'M' && topRight === 'S' && bottomLeft === 'M' && bottomRight === 'S') ||
          (topLeft === 'S' && topRight === 'M' && bottomLeft === 'S' && bottomRight === 'M')
        ) {
          count++
        }
      }
    }
  }

  return count
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_04/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_04/input.txt'))
}

process('A', 18, partA)
process('A', 9, partB)
