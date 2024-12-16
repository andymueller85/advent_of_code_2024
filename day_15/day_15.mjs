import * as fs from 'fs'
import { process } from '../utils.mjs'

const parseInputPartA = fileName => {
  const [rawGrid, rawMoves] = fs.readFileSync(fileName, 'utf8').split(/\r?\n\r?\n/)

  return {
    grid: rawGrid.split(/\r?\n/).map(row => row.split('')),
    moves: rawMoves.replace(/\r?\n/g, '').split('')
  }
}

const parseInputPartB = fileName => {
  const [rawGrid, rawMoves] = fs.readFileSync(fileName, 'utf8').split(/\r?\n\r?\n/)

  const preResizedGrid = rawGrid.split(/\r?\n/).map(row => row.split(''))
  const resizedGrid = preResizedGrid.reduce((acc, row) => {
    return [
      ...acc,
      row
        .reduce((rowAcc, cell) => {
          if (cell === '#') return rowAcc + '##'
          if (cell === 'O') return rowAcc + '[]'
          if (cell === '.') return rowAcc + '..'
          return rowAcc + '@.'
        }, '')
        .split('')
    ]
  }, [])

  return {
    grid: resizedGrid,
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

const getBoxesToMoveUp = (grid, row, col, boxes = new Set()) => {
  const cell = grid[row][col]

  if (cell === '[' || cell === ']') {
    let colSpan = []

    // at a box. push and keep going up
    if (cell === '[') {
      boxes.add(`${row},${col}`)
      colSpan = [col, col + 1]
    } else {
      boxes.add(`${row},${col - 1}`)
      colSpan = [col - 1, col]
    }

    const leftAboveCell = grid[row - 1][colSpan[0]]
    const rightAboveCell = grid[row - 1][colSpan[1]]

    // if there's a wall above, break all the way out of the recursion
    if (leftAboveCell === '#' || rightAboveCell === '#') throw new Error('Break recursion')

    // if there's empty space above, return the boxes we've already found
    if (leftAboveCell === '.' && rightAboveCell === '.') return boxes

    if (['[', ']'].includes(leftAboveCell)) {
      boxes = getBoxesToMoveUp(grid, row - 1, colSpan[0], boxes)
    }
    if (rightAboveCell === '[') {
      boxes = getBoxesToMoveUp(grid, row - 1, colSpan[1], boxes)
    }

    return boxes
  }

  return new Set()
}

const getBoxesToMoveDown = (grid, row, col, boxes = new Set()) => {
  const cell = grid[row][col]

  if (cell === '[' || cell === ']') {
    let colSpan = []

    // at a box. push and keep going down
    if (cell === '[') {
      boxes.add(`${row},${col}`)
      colSpan = [col, col + 1]
    } else {
      boxes.add(`${row},${col - 1}`)
      colSpan = [col - 1, col]
    }

    const leftBelowCell = grid[row + 1][colSpan[0]]
    const rightBelowCell = grid[row + 1][colSpan[1]]

    // if there's a wall below, break all the way out of the recursion
    if (leftBelowCell === '#' || rightBelowCell === '#') throw new Error('Break recursion')

    // if there's empty space below, return the boxes we've already found
    if (leftBelowCell === '.' && rightBelowCell === '.') return boxes

    if (['[', ']'].includes(leftBelowCell)) {
      boxes = getBoxesToMoveDown(grid, row + 1, colSpan[0], boxes)
    }
    if (rightBelowCell === '[') {
      boxes = getBoxesToMoveDown(grid, row + 1, colSpan[1], boxes)
    }

    return boxes
  }

  // should never reach this point
  return new Set()
}

const getBoxesToMoveRight = (grid, row, col, boxes = []) => {
  const cell = grid[row][col]

  // if we're at a wall, return empty array
  if (cell === '#') return []

  // empty space, return the boxes we've already found
  if (grid[row][col] === '.') return boxes

  // if we're at a box, push the box and keep going right
  if (cell === '[') {
    boxes.push([row, col])
    boxes = getBoxesToMoveRight(grid, row, col + 2, boxes)
  }

  return boxes
}

const getBoxesToMoveLeft = (grid, row, col, boxes = []) => {
  const cell = grid[row][col]

  // if we're at a wall, return empty array
  if (cell === '#') return []

  // empty space, return the boxes we've already found
  if (cell === '.') return boxes

  // if we're at a box, push the box and keep going left
  if (cell === ']') {
    boxes.push([row, col - 1])
    boxes = getBoxesToMoveLeft(grid, row, col - 2, boxes)
  }

  return boxes
}

const moveBoxesUp = (grid, boxes) => {
  Array.from(boxes)
    .map(box => box.split(',').map(Number))
    .sort(([rowA], [rowB]) => rowA - rowB)
    .forEach(([row, col]) => {
      grid[row - 1][col] = grid[row][col]
      grid[row - 1][col + 1] = grid[row][col + 1]
      grid[row][col] = '.'
      grid[row][col + 1] = '.'
    })
}

const moveBoxesDown = (grid, boxes) => {
  Array.from(boxes)
    .map(box => box.split(',').map(Number))
    .sort(([rowA], [rowB]) => rowB - rowA)
    .forEach(([row, col]) => {
      grid[row + 1][col] = grid[row][col]
      grid[row + 1][col + 1] = grid[row][col + 1]
      grid[row][col] = '.'
      grid[row][col + 1] = '.'
    })
}

const moveBoxesRight = (grid, boxes) => {
  boxes
    .sort((a, b) => b[1] - a[1])
    .forEach(([row, col]) => {
      grid[row][col + 2] = grid[row][col + 1]
      grid[row][col + 1] = grid[row][col]
      grid[row][col] = '.'
    })
}

const moveBoxesLeft = (grid, boxes) => {
  boxes
    .sort((a, b) => a[1] - b[1])
    .forEach(([row, col]) => {
      grid[row][col - 1] = grid[row][col]
      grid[row][col] = grid[row][col + 1]
      grid[row][col + 1] = '.'
    })
}

const moveRobotUp = (grid, robotRow, robotCol) => {
  if (grid[robotRow - 1][robotCol] === '.') {
    grid[robotRow][robotCol] = '.'
    grid[robotRow - 1][robotCol] = '@'
  }
}

const moveRobotDown = (grid, robotRow, robotCol) => {
  if (grid[robotRow + 1][robotCol] === '.') {
    grid[robotRow][robotCol] = '.'
    grid[robotRow + 1][robotCol] = '@'
  }
}

const moveRobotRight = (grid, robotRow, robotCol) => {
  if (grid[robotRow][robotCol + 1] === '.') {
    grid[robotRow][robotCol] = '.'
    grid[robotRow][robotCol + 1] = '@'
  }
}

const moveRobotLeft = (grid, robotRow, robotCol) => {
  if (grid[robotRow][robotCol - 1] === '.') {
    grid[robotRow][robotCol] = '.'
    grid[robotRow][robotCol - 1] = '@'
  }
}

const processMovePartB = (grid, move) => {
  // find the robot's current position
  const [robotRow, robotCol] = findRobot(grid)

  switch (move) {
    case '^':
      if (['[', ']'].includes(grid[robotRow - 1][robotCol])) {
        let boxesToMoveUp = []

        try {
          boxesToMoveUp = getBoxesToMoveUp(grid, robotRow - 1, robotCol)
        } catch (e) {
          if (e.message === 'Break recursion') {
            boxesToMoveUp = []
          }
        }
        moveBoxesUp(grid, boxesToMoveUp)
      }
      moveRobotUp(grid, robotRow, robotCol)

      break
    case 'v':
      if (['[', ']'].includes(grid[robotRow + 1][robotCol])) {
        let boxesToMoveDown = []

        try {
          boxesToMoveDown = getBoxesToMoveDown(grid, robotRow + 1, robotCol)
        } catch (e) {
          if (e.message === 'Break recursion') {
            boxesToMoveDown = []
          }
        }
        moveBoxesDown(grid, boxesToMoveDown)
      }
      moveRobotDown(grid, robotRow, robotCol)

      break
    case '>':
      let boxesToMoveRight = []

      try {
        boxesToMoveRight = getBoxesToMoveRight(grid, robotRow, robotCol + 1)
      } catch (e) {
        if (e.message === 'Break recursion') {
          boxesToMoveRight = []
        }
      }

      moveBoxesRight(grid, boxesToMoveRight)
      moveRobotRight(grid, robotRow, robotCol)

      break
    case '<':
      let boxesToMoveLeft = []

      try {
        boxesToMoveLeft = getBoxesToMoveLeft(grid, robotRow, robotCol - 1)
      } catch (e) {
        if (e.message === 'Break recursion') {
          boxesToMoveLeft = []
        }
      }

      moveBoxesLeft(grid, boxesToMoveLeft)
      moveRobotLeft(grid, robotRow, robotCol)

      break
  }
}

const gpsSum = (grid, boxChar = 'O') =>
  grid.reduce(
    (sum, row, rowIndex) =>
      sum +
      row.reduce(
        (rowSum, cell, colIndex) =>
          cell === boxChar ? rowSum + 100 * rowIndex + colIndex : rowSum,
        0
      ),
    0
  )

const partA = fileName => {
  const { grid, moves } = parseInputPartA(fileName)
  moves.forEach(move => processMove(grid, move))
  return gpsSum(grid)
}

const partB = fileName => {
  const { grid, moves } = parseInputPartB(fileName)

  moves.forEach(move => processMovePartB(grid, move))

  return gpsSum(grid, '[')
}

process(15, 'A', 10092, partA)
process(15, 'B', 9021, partB)
