import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => line.split(''))

const getMatchingFrequencies = (grid, val) =>
  grid.reduce((coords, row, rowI) => {
    row.forEach((cell, colI) => {
      if (cell === val) coords.push([rowI, colI])
    })
    return coords
  }, [])

const isInBounds = (row, col, grid) =>
  row >= 0 && col >= 0 && row < grid.length && col < grid[row].length

const placeAntinodesPartA = (grid, coords, antinodes) => {
  coords.forEach(([r1, c1], i) => {
    ;[...coords.slice(0, i), ...coords.slice(i + 1)].forEach(([r2, c2]) => {
      const antinodeRow = 2 * r2 - r1
      const antinodeCol = 2 * c2 - c1

      if (isInBounds(antinodeRow, antinodeCol, grid)) {
        antinodes.add(`${antinodeRow},${antinodeCol}`)
      }
    })
  })
}

const followLine = (grid, rPos, cPos, rDelta, cDelta, antinodes) => {
  while (isInBounds(rPos, cPos, grid)) {
    antinodes.add(`${rPos},${cPos}`)
    rPos += rDelta
    cPos += cDelta
  }
}

const placeAntinodesPartB = (grid, coords, antinodes) => {
  coords.forEach(([r1, c1], i) => {
    coords.slice(i + 1).forEach(([r2, c2]) => {
      const rDelta = r2 - r1
      const cDelta = c2 - c1

      // follow the line in both directions, placing antinodes
      followLine(grid, r1, c1, rDelta, cDelta, antinodes)
      followLine(grid, r2, c2, -rDelta, -cDelta, antinodes)
    })
  })
}

const traverseGrid = (fileName, placeAntinodesFn) => {
  const frequencies = new Set()
  const antinodes = new Set()

  parseInput(fileName).forEach((row, _, grid) =>
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
