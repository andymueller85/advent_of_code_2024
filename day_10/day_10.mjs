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

const traverse = (grid, r, c, summits, countObj) => {
  getGridNeighbors(grid, r, c).forEach(([nRow, nCol]) => {
    if (grid[r][c] === 8 && grid[nRow][nCol] === 9) {
      summits.add(`${nRow},${nCol}`)
      countObj.count++
    } else if (grid[nRow][nCol] === grid[r][c] + 1) {
      traverse(grid, nRow, nCol, summits, countObj)
    }
  })

  return summits
}

const mapTrails = fileName => {
  let totalScore = 0
  let totalCount = 0
  const grid = parseInput(fileName)
  const trailheads = getTrailheads(grid)

  trailheads.forEach(([r, c]) => {
    const summits = new Set()
    const countObj = { count: 0 }
    const summitsCheck = traverse(grid, r, c, summits, countObj)
    totalScore += summitsCheck.size
    totalCount += countObj.count
  })

  return { totalScore, totalCount }
}

;(() => {
  const PART_A_EXPECTED = 36
  const PART_B_EXPECTED = 81

  const { totalScore, totalCount } = mapTrails('./day_10/sample_input.txt')

  console.log(`part A sample answer`, totalScore)
  if (totalScore !== PART_A_EXPECTED) {
    throw new Error(`part A sample answer should be ${PART_A_EXPECTED}`)
  }

  const { totalScore: totalScoreReal, totalCount: totalCountReal } = mapTrails('./day_10/input.txt')

  console.log(`part A real answer`, totalScoreReal)

  console.log(`part B sample answer`, totalCount)
  if (totalCount !== PART_B_EXPECTED) {
    throw new Error(`part B sample answer should be ${PART_B_EXPECTED}`)
  }

  console.log(`part B real answer`, totalCountReal)
})()
