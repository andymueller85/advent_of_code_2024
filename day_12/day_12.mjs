import * as fs from 'fs'
import { process } from '../utils.mjs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(row => row.split(''))

const isInBounds = (grid, rowI, colI) =>
  rowI >= 0 && rowI < grid.length && colI >= 0 && colI < grid[0].length

const getNeighbors = (rowI, colI) => [
  [rowI, colI - 1], // left
  [rowI - 1, colI], // up
  [rowI, colI + 1], // right
  [rowI + 1, colI] // down
]

const getPerimeter = (plot, grid) =>
  Array.from(plot).reduce(
    (perimeter, cellCoords) =>
      perimeter +
      getNeighbors(...cellCoords.split(',').map(Number)).filter(
        ([candidateRowI, candidateColI]) =>
          !isInBounds(grid, candidateRowI, candidateColI) ||
          !plot.has(`${candidateRowI},${candidateColI}`)
      ).length,
    0
  )

const findAdjacentPlants = (grid, rowI, colI, curPlot, plottedCells) => {
  const cell = grid[rowI][colI]

  getNeighbors(rowI, colI).forEach(([candidateRowI, candidateColI]) => {
    if (!isInBounds(grid, candidateRowI, candidateColI)) return

    const candidateNeighbor = grid[candidateRowI][candidateColI]
    const candidateNeighborCoords = `${candidateRowI},${candidateColI}`

    if (
      !plottedCells.has(candidateNeighborCoords) &&
      !curPlot.has(candidateNeighborCoords) &&
      candidateNeighbor === cell
    ) {
      curPlot.add(candidateNeighborCoords)
      plottedCells.add(candidateNeighborCoords)
      curPlot = findAdjacentPlants(grid, candidateRowI, candidateColI, curPlot, plottedCells)
    }
  })

  return curPlot
}

const createPlots = (grid, plotted) =>
  grid.reduce((plots, row, rowI) => {
    row.forEach((_, colI) => {
      if (!plotted.has(`${rowI},${colI}`)) {
        // if a cell hasn't been visited, start a new plot and recursively find adjacent plants
        plots.push(findAdjacentPlants(grid, rowI, colI, new Set([`${rowI},${colI}`]), plotted))
      }
    })
    return plots
  }, [])

const partA = fileName => {
  const grid = parseInput(fileName)

  return createPlots(grid, new Set()).reduce(
    (acc, cur) => acc + cur.size * getPerimeter(cur, grid),
    0
  )
}

process(12, 'A', 1930, partA)
