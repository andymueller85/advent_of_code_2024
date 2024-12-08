import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => line.split(''))

const getMatchingFrequencies = (grid, val) => {
  return grid.reduce((coords, row, rowI) => {
    row.forEach((cell, colI) => {
      if (cell === val) {
        coords.push([rowI, colI])
      }
    })
    return coords
  }, [])
}

const isInBounds = (row, col, grid) =>
  row >= 0 && col >= 0 && row < grid.length && col < grid[row].length

const placeAntinodesPartA = (grid, coords, antinodes) => {
  coords.forEach(([r1, c1], i) => {
    ;[...coords.slice(0, i), ...coords.slice(i + 1)].forEach(([r2, c2]) => {
      const dr = r2 - r1
      const dc = c2 - c1
      const antinodeRow = r2 + dr
      const antinodeCol = c2 + dc

      if (isInBounds(antinodeRow, antinodeCol, grid)) {
        antinodes.add(`${antinodeRow},${antinodeCol}`)
      }
    })
  })
}

const followLine = (grid, rPos, cPos, dr, dc, antinodes) => {
  while (isInBounds(rPos, cPos, grid)) {
    antinodes.add(`${rPos},${cPos}`)
    rPos += dr
    cPos += dc
  }
}

const placeAntinodesPartB = (grid, coords, antinodes) => {
  coords.forEach(([r1, c1], i) => {
    coords.slice(i + 1).forEach(([r2, c2]) => {
      const dr = r2 - r1
      const dc = c2 - c1

      // Follow the line in one direction
      followLine(grid, r1, c1, dr, dc, antinodes)

      // Follow the line in the other direction
      followLine(grid, r2, c2, -dr, -dc, antinodes)
    })
  })
}

const traverseGrid = (fileName, placeAntinodesFn) => {
  const grid = parseInput(fileName)

  const frequencies = new Set()
  const antinodes = new Set()

  grid.forEach(row =>
    row.forEach(val => {
      if ((val !== '.') & !frequencies.has(val)) {
        frequencies.add(val)

        const coords = getMatchingFrequencies(grid, val)
        placeAntinodesFn(grid, coords, antinodes)
      }
    })
  )

  return antinodes.size
}

const process = (part, expectedAnswer, fn) => {
  const sampleAnswer = traverseGrid('./day_08/sample_input.txt', fn)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, traverseGrid('./day_08/input.txt', fn))
}

process('A', 14, placeAntinodesPartA)
process('B', 34, placeAntinodesPartB)
