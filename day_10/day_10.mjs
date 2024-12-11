import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .trim()
    .split(/\r?\n/)
    .map(line => line.split('').map(Number))

const getGridNeighbors = (grid, r, c) => {
  const neighbors = []

  if (r > 0) neighbors.push([r - 1, c]) // up
  if (r < grid.length - 1) neighbors.push([r + 1, c]) // down
  if (c > 0) neighbors.push([r, c - 1]) // left
  if (c < grid[0].length - 1) neighbors.push([r, c + 1]) // right

  return neighbors
}

const getTrailheads = grid =>
  grid.reduce(
    (trailheads, row, rowI) =>
      trailheads.concat(
        row.map((cell, colI) => (cell === 0 ? [rowI, colI] : undefined)).filter(Boolean)
      ),
    []
  )

const traverse = (grid, r, c) => {
  let summits = new Set()
  let count = 0

  const neighbors = getGridNeighbors(grid, r, c)

  neighbors.forEach(([nRow, nCol]) => {
    if (grid[r][c] === 8 && grid[nRow][nCol] === 9) {
      summits.add(`${nRow},${nCol}`)
      count++
    } else if (grid[nRow][nCol] === grid[r][c] + 1) {
      const { summits: childSummits, count: childCount } = traverse(grid, nRow, nCol)
      summits = new Set([...summits, ...childSummits])
      count += childCount
    }
  })

  return { summits, count }
}

const mapTrails = fileName => {
  let totalScore = 0
  let totalCount = 0
  const grid = parseInput(fileName)
  const trailheads = getTrailheads(grid)

  trailheads.forEach(([r, c]) => {
    const { summits, count } = traverse(grid, r, c)
    totalScore += summits.size
    totalCount += count
  })

  return { totalScore, totalCount }
}

const PART_A_EXPECTED = 36
const PART_B_EXPECTED = 81

const { totalScore: totalScoreSample, totalCount: totalCountSample } = mapTrails(
  './day_10/sample_input.txt'
)

console.log(`part A sample answer`, totalScoreSample)
if (totalScoreSample !== PART_A_EXPECTED) {
  throw new Error(`part A sample answer should be ${PART_A_EXPECTED}`)
}

const { totalScore: totalScoreReal, totalCount: totalCountReal } = mapTrails('./day_10/input.txt')

console.log(`part A real answer`, totalScoreReal)

console.log(`part B sample answer`, totalCountSample)
if (totalCountSample !== PART_B_EXPECTED) {
  throw new Error(`part B sample answer should be ${PART_B_EXPECTED}`)
}

console.log(`part B real answer`, totalCountReal)
