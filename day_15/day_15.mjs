import * as fs from 'fs'
import { process } from '../utils.mjs'

const WALL = '#'
const EMPTY = '.'
const PART_A_BOX = 'O'
const PART_B_BOX_LEFT = '['
const PART_B_BOX_RIGHT = ']'
const ROBOT = '@'
const UP = '^'
const DOWN = 'v'
const RIGHT = '>'
const LEFT = '<'
const BREAK_RECURSION = 'Break recursion'

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
          if (cell === WALL) return rowAcc + WALL + WALL
          if (cell === PART_A_BOX) return rowAcc + PART_B_BOX_LEFT + PART_B_BOX_RIGHT
          if (cell === EMPTY) return rowAcc + EMPTY + EMPTY
          return rowAcc + ROBOT + EMPTY
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
  const robotRow = grid.findIndex(row => row.includes(ROBOT))
  const robotCol = grid[robotRow].indexOf(ROBOT)
  return [robotRow, robotCol]
}

const moveRobotAndShiftBoxes = (grid, robotRow, robotCol, direction) => {
  let rowCoord = robotRow
  let colCoord = robotCol

  const isVertical = direction === UP || direction === DOWN
  const isPositive = direction === DOWN || direction === RIGHT
  const increment = isPositive ? 1 : -1

  while (
    [ROBOT, PART_A_BOX].includes(isVertical ? grid[rowCoord][robotCol] : grid[robotRow][colCoord])
  ) {
    if (isVertical) {
      rowCoord += increment
    } else {
      colCoord += increment
    }
  }

  if (isVertical ? grid[rowCoord][robotCol] === WALL : grid[robotRow][colCoord] === WALL) {
    return // wall. nothing changes.
  }

  // empty space, shift boxes and move robot
  if (isVertical) {
    for (let row = rowCoord; isPositive ? row > robotRow : row < robotRow; row -= increment) {
      grid[row][robotCol] = grid[row - increment][robotCol]
    }
  } else {
    for (let col = colCoord; isPositive ? col > robotCol : col < robotCol; col -= increment) {
      grid[robotRow][col] = grid[robotRow][col - increment]
    }
  }

  grid[robotRow][robotCol] = EMPTY
}

const processMove = (grid, move) => {
  const [robotRow, robotCol] = findRobot(grid)

  switch (move) {
    case UP:
      moveRobotAndShiftBoxes(grid, robotRow, robotCol, UP)
      break
    case DOWN:
      moveRobotAndShiftBoxes(grid, robotRow, robotCol, DOWN)
      break
    case RIGHT:
      moveRobotAndShiftBoxes(grid, robotRow, robotCol, RIGHT)
      break
    case LEFT:
      moveRobotAndShiftBoxes(grid, robotRow, robotCol, LEFT)
      break
  }
}

const getBoxesToMoveVertical = (grid, row, col, direction, boxes = new Set()) => {
  const cell = grid[row][col]

  if (cell === PART_B_BOX_LEFT || cell === PART_B_BOX_RIGHT) {
    let colSpan = []

    // at a box. push and keep going in the specified direction
    if (cell === PART_B_BOX_LEFT) {
      boxes.add(`${row},${col}`)
      colSpan = [col, col + 1]
    } else {
      boxes.add(`${row},${col - 1}`)
      colSpan = [col - 1, col]
    }

    const newRow = direction === UP ? row - 1 : row + 1
    const leftCell = grid[newRow][colSpan[0]]
    const rightCell = grid[newRow][colSpan[1]]

    // if there's a wall in the specified direction, break all the way out of the recursion
    if (leftCell === WALL || rightCell === WALL) throw new Error(BREAK_RECURSION)

    // if there's empty space in the specified direction, return the boxes we've already found
    if (leftCell === EMPTY && rightCell === EMPTY) return boxes

    if ([PART_B_BOX_LEFT, PART_B_BOX_RIGHT].includes(leftCell)) {
      boxes = getBoxesToMoveVertical(grid, newRow, colSpan[0], direction, boxes)
    }
    if (rightCell === PART_B_BOX_LEFT) {
      boxes = getBoxesToMoveVertical(grid, newRow, colSpan[1], direction, boxes)
    }

    return boxes
  }

  return new Set()
}

const getBoxesToMoveUp = (grid, row, col, boxes = new Set()) =>
  getBoxesToMoveVertical(grid, row, col, UP, boxes)
const getBoxesToMoveDown = (grid, row, col, boxes = new Set()) =>
  getBoxesToMoveVertical(grid, row, col, DOWN, boxes)

const getBoxesToMoveHorizontal = (grid, row, col, direction, boxes = []) => {
  const cell = grid[row][col]

  // if we're at a wall, return empty array
  if (cell === WALL) return []

  // empty space, return the boxes we've already found
  if (cell === EMPTY) return boxes

  // if we're at a box, push the box and keep going in the specified direction
  if (cell === PART_B_BOX_LEFT || cell === PART_B_BOX_RIGHT) {
    const boxCol = cell === PART_B_BOX_LEFT ? col : col - 1
    boxes.push([row, boxCol])
    const newCol = direction === RIGHT ? col + 2 : col - 2
    boxes = getBoxesToMoveHorizontal(grid, row, newCol, direction, boxes)
  }

  return boxes
}

const getBoxesToMoveRight = (grid, row, col, boxes = []) =>
  getBoxesToMoveHorizontal(grid, row, col, RIGHT, boxes)
const getBoxesToMoveLeft = (grid, row, col, boxes = []) =>
  getBoxesToMoveHorizontal(grid, row, col, LEFT, boxes)

const moveBoxesVertical = (grid, boxes, direction) => {
  const sortedBoxes = Array.from(boxes)
    .map(box => box.split(',').map(Number))
    .sort(([rowA], [rowB]) => (direction === UP ? rowA - rowB : rowB - rowA))

  sortedBoxes.forEach(([row, col]) => {
    const newRow = direction === UP ? row - 1 : row + 1
    grid[newRow][col] = grid[row][col]
    grid[newRow][col + 1] = grid[row][col + 1]
    grid[row][col] = EMPTY
    grid[row][col + 1] = EMPTY
  })
}

const moveBoxesUp = (grid, boxes) => moveBoxesVertical(grid, boxes, UP)
const moveBoxesDown = (grid, boxes) => moveBoxesVertical(grid, boxes, DOWN)

const moveBoxesHorizontal = (grid, boxes, direction) => {
  const sortedBoxes = boxes.sort(([_a, colA], [_b, colB]) =>
    direction === LEFT ? colA - colB : colB - colA
  )

  sortedBoxes.forEach(([row, col]) => {
    if (direction === RIGHT) {
      grid[row][col + 2] = grid[row][col + 1]
      grid[row][col + 1] = grid[row][col]
      grid[row][col] = EMPTY
    } else if (direction === LEFT) {
      grid[row][col - 1] = grid[row][col]
      grid[row][col] = grid[row][col + 1]
      grid[row][col + 1] = EMPTY
    }
  })
}

const moveBoxesRight = (grid, boxes) => moveBoxesHorizontal(grid, boxes, RIGHT)
const moveBoxesLeft = (grid, boxes) => moveBoxesHorizontal(grid, boxes, LEFT)

const moveRobotUp = (grid, robotRow, robotCol) => {
  if (grid[robotRow - 1][robotCol] === EMPTY) {
    grid[robotRow][robotCol] = EMPTY
    grid[robotRow - 1][robotCol] = ROBOT
  }
}

const moveRobotDown = (grid, robotRow, robotCol) => {
  if (grid[robotRow + 1][robotCol] === EMPTY) {
    grid[robotRow][robotCol] = EMPTY
    grid[robotRow + 1][robotCol] = ROBOT
  }
}

const moveRobotRight = (grid, robotRow, robotCol) => {
  if (grid[robotRow][robotCol + 1] === EMPTY) {
    grid[robotRow][robotCol] = EMPTY
    grid[robotRow][robotCol + 1] = ROBOT
  }
}

const moveRobotLeft = (grid, robotRow, robotCol) => {
  if (grid[robotRow][robotCol - 1] === EMPTY) {
    grid[robotRow][robotCol] = EMPTY
    grid[robotRow][robotCol - 1] = ROBOT
  }
}

const moveBoxesAndRobot = (grid, robotRow, robotCol, direction) => {
  let getBoxesToMove, moveBoxes, moveRobot

  switch (direction) {
    case UP:
      getBoxesToMove = getBoxesToMoveUp
      moveBoxes = moveBoxesUp
      moveRobot = moveRobotUp
      break
    case DOWN:
      getBoxesToMove = getBoxesToMoveDown
      moveBoxes = moveBoxesDown
      moveRobot = moveRobotDown
      break
    case RIGHT:
      getBoxesToMove = getBoxesToMoveRight
      moveBoxes = moveBoxesRight
      moveRobot = moveRobotRight
      break
    case LEFT:
      getBoxesToMove = getBoxesToMoveLeft
      moveBoxes = moveBoxesLeft
      moveRobot = moveRobotLeft
      break
  }

  if (
    [UP, DOWN].includes(direction) &&
    [PART_B_BOX_LEFT, PART_B_BOX_RIGHT].includes(
      grid[robotRow + (direction === UP ? -1 : 1)][robotCol]
    )
  ) {
    let boxesToMove = []

    try {
      boxesToMove = getBoxesToMove(grid, robotRow + (direction === UP ? -1 : 1), robotCol)
    } catch (e) {
      if (e.message === BREAK_RECURSION) {
        boxesToMove = []
      }
    }

    moveBoxes(grid, boxesToMove)
  } else if ([RIGHT, LEFT].includes(direction)) {
    let boxesToMove = []

    try {
      boxesToMove = getBoxesToMove(grid, robotRow, robotCol + (direction === RIGHT ? 1 : -1))
    } catch (e) {
      if (e.message === BREAK_RECURSION) {
        boxesToMove = []
      }
    }

    moveBoxes(grid, boxesToMove)
  }

  moveRobot(grid, robotRow, robotCol)
}

const processMovePartB = (grid, move) => {
  const [robotRow, robotCol] = findRobot(grid)

  moveBoxesAndRobot(grid, robotRow, robotCol, move)
}

const gpsSum = (grid, boxChar = PART_A_BOX) =>
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

  return gpsSum(grid, PART_B_BOX_LEFT)
}

process(15, 'A', 10092, partA)
process(15, 'B', 9021, partB)
