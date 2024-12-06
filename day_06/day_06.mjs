import { dir } from 'console'
import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => line.split(''))

const getStartingPosition = grid => {
  const row = grid.findIndex(
    row => row.includes('^') || row.includes('v') || row.includes('<') || row.includes('>')
  )

  const col = grid[row].findIndex(
    cell => cell === '^' || cell === 'v' || cell === '<' || cell === '>'
  )

  return [row, col]
}

const getNextPosition = (row, col, direction) => {
  const [dRow, dCol] = { '^': [-1, 0], v: [1, 0], '<': [0, -1], '>': [0, 1] }[direction]
  return [row + dRow, col + dCol]
}

const getNextDirection = direction => ({ '^': '>', v: '<', '<': '^', '>': 'v' }[direction])

const isInBounds = (row, col, grid) =>
  row >= 0 && col >= 0 && row < grid.length && col < grid[0].length

const traverseGrid = (grid, checkRevisited = false) => {
  const visited = new Set()
  let [row, col] = getStartingPosition(grid)
  let direction = grid[row][col]

  while (isInBounds(row, col, grid)) {
    const key = checkRevisited ? `${row},${col},${direction}` : `${row},${col}`

    if (checkRevisited && visited.has(key)) return -1
    visited.add(key)

    const [nextRow, nextCol] = getNextPosition(row, col, direction)

    if (isInBounds(nextRow, nextCol, grid) && grid[nextRow][nextCol] === '#') {
      direction = getNextDirection(direction)
    } else {
      ;[row, col] = [nextRow, nextCol]
    }
  }

  return visited.size
}

const partA = fileName => traverseGrid(parseInput(fileName))

const partB = fileName =>
  parseInput(fileName).reduce(
    (total, row, rowI, grid) =>
      total +
      row.reduce((rowTotal, _, colI) => {
        if (grid[rowI][colI] !== '.') return rowTotal

        const gridClone = grid.map(row => [...row])
        gridClone[rowI][colI] = '#'

        return rowTotal + (traverseGrid(gridClone, true) === -1 ? 1 : 0)
      }, 0),
    0
  )

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_06/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_06/input.txt'))
}

process('A', 41, partA)
process('B', 6, partB)
