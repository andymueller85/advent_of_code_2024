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
  [rowI, colI - 1], // west
  [rowI - 1, colI], // north
  [rowI, colI + 1], // east
  [rowI + 1, colI] // south
]

const createPerimeterCellChecker =
  (plot, grid) =>
  ([candidateRowI, candidateColI]) =>
    !isInBounds(grid, candidateRowI, candidateColI) ||
    !plot.has(`${candidateRowI},${candidateColI}`)

const getPerimeter = (plot, grid) =>
  Array.from(plot).reduce(
    (perimeter, cellCoords) =>
      perimeter +
      getNeighbors(...cellCoords.split(',').map(Number)).filter(
        createPerimeterCellChecker(plot, grid)
      ).length,
    0
  )

const getPlotPerimeters = (plot, grid) =>
  Array.from(plot).map(cellCoords => {
    const [rowI, colI] = cellCoords.split(',').map(Number)
    const [west, north, east, south] = getNeighbors(rowI, colI)

    const isPerimeterCell = createPerimeterCellChecker(plot, grid)

    return {
      cellCoords: [rowI, colI],
      west: isPerimeterCell(west),
      north: isPerimeterCell(north),
      east: isPerimeterCell(east),
      south: isPerimeterCell(south)
    }
  })

// return count of contiguous groups of values in the array
// [0,1,3,4] => 2
const getPerimeterCountForRowOrColumn = rowOrCol =>
  rowOrCol
    .sort((a, b) => a - b)
    .reduce((acc, cur, i) => {
      if (i === 0 || cur - rowOrCol[i - 1] > 1) {
        return acc + 1
      }

      return acc
    }, 0)

const getPerimetersByRowOrCol = (plotPerimeters, direction) =>
  plotPerimeters.reduce((acc, cur) => {
    const index = ['north', 'south'].includes(direction) ? 0 : 1
    const key = cur.cellCoords[index]

    if (acc[key] === undefined) {
      acc[key] = { [direction]: key, vals: [] }
    }

    if (cur[direction]) {
      acc[key].vals.push(cur.cellCoords[1 - index])
    }

    return acc
  }, [])

const getPerimeterTotal = (plotPerimeters, direction) => {
  const perimetersByRowOrCol = getPerimetersByRowOrCol(plotPerimeters, direction)
  return perimetersByRowOrCol
    .map(rowOrCol => getPerimeterCountForRowOrColumn(rowOrCol.vals))
    .reduce((acc, cur) => acc + cur, 0)
}

const getStraightEdgesCount = (plot, grid) => {
  // - for each cell of the grid, determine if it's on the perimeter of the plot, and in which direction(s)
  // - once we have the full list of perimeters, we can find any gaps along straight
  //     lines in both directions (north/south for horizontal, east/west for vertical)
  // - count up the edges in each direction

  const plotPerimeters = getPlotPerimeters(plot, grid)

  return (
    getPerimeterTotal(plotPerimeters, 'north') +
    getPerimeterTotal(plotPerimeters, 'south') +
    getPerimeterTotal(plotPerimeters, 'east') +
    getPerimeterTotal(plotPerimeters, 'west')
  )
}

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
      plottedCells.add(candidateNeighborCoords)
      curPlot.add(candidateNeighborCoords)
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

const partB = fileName => {
  const grid = parseInput(fileName)
  const plotted = new Set()
  const plots = createPlots(grid, plotted)

  return plots.reduce(
    (totalPrice, plot) => totalPrice + plot.size * getStraightEdgesCount(plot, grid),
    0
  )
}

process(12, 'A', 1930, partA)
process(12, 'B', 1206, partB)
