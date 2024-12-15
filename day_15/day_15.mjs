import * as fs from 'fs'
import { process } from '../utils.mjs'

const parseInput = fileName => {
  const [rawGrid, rawMoves] = fs.readFileSync(fileName, 'utf8').split(/\r?\n\r?\n/)

  return {
    grid: rawGrid.split(/\r?\n/).map(row => row.split('')),
    moves: rawMoves.replace(/\r?\n/g, '').split('')
  }
}

const findRobot = grid => {
  const robotRow = grid.findIndex(row => row.includes('@'))
  const robotCol = grid[robotRow].indexOf('@')
  return [robotRow, robotCol]
}

const processMove = (grid, move) => {
  // find the robot's current position
  const [robotRow, robotCol] = findRobot(grid)

  let rowCoord = robotRow
  let colCoord = robotCol

  // check the spaces between the robot and the next wall. If there is an empty space, shift things around
  switch (move) {
    case '^':
      while (['@', 'O'].includes(grid[rowCoord][robotCol])) rowCoord--

      if (grid[rowCoord][robotCol] === '#') break // wall. nothing changes.

      // empty space, shift boxes up and move robot
      for (let row = rowCoord; row < robotRow; row++) {
        grid[row][robotCol] = grid[row + 1][robotCol]
      }
      grid[robotRow][robotCol] = '.'

      break
    case 'v':
      while (['@', 'O'].includes(grid[rowCoord][robotCol])) rowCoord++

      if (grid[rowCoord][robotCol] === '#') break // wall. nothing changes.

      // empty space, shift boxes down and move robot
      for (let row = rowCoord; row > robotRow; row--) {
        grid[row][robotCol] = grid[row - 1][robotCol]
      }
      grid[robotRow][robotCol] = '.'

      break
    case '>':
      while (['@', 'O'].includes(grid[robotRow][colCoord])) colCoord++

      if (grid[robotRow][colCoord] === '#') break // wall. nothing changes.

      // empty space, shift boxes right and move robot
      for (let col = colCoord; col > robotCol; col--) {
        grid[robotRow][col] = grid[robotRow][col - 1]
      }
      grid[robotRow][robotCol] = '.'

      break
    case '<':
      while (['@', 'O'].includes(grid[robotRow][colCoord])) colCoord--

      if (grid[robotRow][colCoord] === '#') break // wall. nothing changes.

      // empty space, shift boxes left and move robot
      for (let col = colCoord; col < robotCol; col++) {
        grid[robotRow][col] = grid[robotRow][col + 1]
      }
      grid[robotRow][robotCol] = '.'

      break
  }
}

const gpsSum = grid =>
  grid.reduce(
    (sum, row, rowIndex) =>
      sum +
      row.reduce(
        (rowSum, cell, colIndex) => (cell === 'O' ? rowSum + 100 * rowIndex + colIndex : rowSum),
        0
      ),
    0
  )

const partA = fileName => {
  const { grid, moves } = parseInput(fileName)
  moves.forEach(move => processMove(grid, move))
  return gpsSum(grid)
}

process(15, 'A', 10092, partA)
