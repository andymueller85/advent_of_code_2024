import * as fs from 'fs'
import { process } from '../utils.mjs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => line.split(''))

const forwardRegex = new RegExp('XMAS', 'gi')
const reverseRegex = new RegExp('SAMX', 'gi')

const swapXY = grid => grid[0].map((_, i) => grid.map(row => row[i]))

const matchCount = str => [...str.matchAll(forwardRegex), ...str.matchAll(reverseRegex)].length

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
  const reducer = (acc, row) => acc + matchCount(row.join(''))

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

process(4, 'A', 18, partA)
process(4, 'B', 9, partB)
