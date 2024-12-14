import * as fs from 'fs'

const parseInput = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => {
      const [rawPosition, rawVelocity] = line.split(' ')
      return {
        position: rawPosition.replace('p=', '').split(',').map(Number),
        velocity: rawVelocity.replace('v=', '').split(',').map(Number)
      }
    })

const newAxisPosition = (curPos, curVelocity, length) => {
  const rawNewPos = curPos + curVelocity
  return rawNewPos < 0 ? length + rawNewPos : rawNewPos % length
}

const reposition = (robot, gridWidth, gridHeight) => {
  const { position, velocity } = robot
  const [curCol, curRow] = position
  const [velCol, velRow] = velocity
  const newCol = newAxisPosition(curCol, velCol, gridWidth)
  const newRow = newAxisPosition(curRow, velRow, gridHeight)

  return { position: [newCol, newRow], velocity }
}

const printGrid = (robots, gridWidth, gridHeight, i) => {
  const grid = Array.from({ length: gridHeight }, () =>
    Array.from({ length: gridWidth }, () => '.')
  )

  let middleCount = 0
  robots.forEach(({ position: [col, row] }) => {
    grid[row][col] = '#'

    // count the number of robots towards the center
    if (
      row >= gridWidth / 3 &&
      row <= (gridWidth * 2) / 3 &&
      col >= gridHeight / 3 &&
      col <= (gridHeight * 2) / 3
    )
      middleCount++
  })

  if (middleCount > 200) {
    console.log(`time ${i + 1}`)

    grid.forEach(row => console.log(row.join('')))
    console.log()
  }
}

const arrangeRobots = (fileName, w, h, loopCtr) => {
  const topLeft = robot =>
    robot.position[0] < Math.floor(w / 2) && robot.position[1] < Math.floor(h / 2)
  const topRight = robot => robot.position[0] > w / 2 && robot.position[1] > h / 2
  const bottomLeft = robot => robot.position[0] < Math.floor(w / 2) && robot.position[1] > h / 2
  const bottomRight = robot => robot.position[0] > w / 2 && robot.position[1] < Math.floor(h / 2)

  let robots = parseInput(fileName)

  for (let i = 0; i < loopCtr; i++) {
    robots = robots.map(robot => reposition(robot, w, h))

    printGrid(robots, w, h, i)
  }

  return (
    robots.filter(topLeft).length *
    robots.filter(topRight).length *
    robots.filter(bottomLeft).length *
    robots.filter(bottomRight).length
  )
}

export const process = (day, expectedAnswer, fn) => {
  const strDay = day.toString().padStart(2, '0')
  const sampleAnswer = fn(`./day_${strDay}/sample_input.txt`, 11, 7, 100)

  console.log('part A sample answer', sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part A sample answer should be ${expectedAnswer}`)
  }

  console.log('part A real answer', fn(`./day_${strDay}/input.txt`, 101, 103, 100))

  console.log('Part B...')
  console.log(fn(`./day_${strDay}/input.txt`, 101, 103, 10000))
}

process(14, 12, arrangeRobots)
