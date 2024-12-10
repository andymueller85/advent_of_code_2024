import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .trim()
    .split('\n')
    .map(line => line.split('').map(Number))

const getGridNeighbors = (grid, r, c) => {
  const neighbors = []

  if (r > 0) neighbors.push([r - 1, c]) // up
  if (r < grid.length - 1) neighbors.push([r + 1, c]) // down
  if (c > 0) neighbors.push([r, c - 1]) // left
  if (c < grid[0].length - 1) neighbors.push([r, c + 1]) // right

  return neighbors
}

const getTrailheads = grid => {
  const trailheads = []
  grid.forEach((row, rowI) => {
    row.forEach((cell, colI) => {
      if (cell === 0) {
        trailheads.push([rowI, colI])
      }
    })
  })
  return trailheads
}

const traverse = (grid, r, c, summits) => {
  const neighbors = getGridNeighbors(grid, r, c)

  neighbors.forEach(([nRow, nCol]) => {
    const key = `${nRow},${nCol}`
    if (grid[r][c] === 8 && grid[nRow][nCol] === 9) {
      summits.add(key)
    } else if (grid[nRow][nCol] === grid[r][c] + 1) {
      traverse(grid, nRow, nCol, summits)
    }
  })

  return summits
}

const partA = fileName => {
  let totalScore = 0
  const grid = parseInput(fileName)
  const trailheads = getTrailheads(grid)

  trailheads.forEach(([r, c]) => {
    const summits = new Set()
    const summitsCheck = traverse(grid, r, c, summits)
    totalScore += summitsCheck.size
  })

  return totalScore
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = fn('./day_10/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn('./day_10/input.txt'))
}

process('A', 36, partA)
