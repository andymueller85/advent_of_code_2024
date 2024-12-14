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

const partA = (fileName, gridWidth, gridHeight) => {
  let robots = parseInput(fileName)

  for (let i = 0; i < 100; i++) {
    robots = robots.map(robot => reposition(robot, gridWidth, gridHeight))
  }

  const topLeftQuadrantCount = robots.filter(
    robot =>
      robot.position[0] < Math.floor(gridWidth / 2) &&
      robot.position[1] < Math.floor(gridHeight / 2)
  ).length
  const topRightQuadrantCount = robots.filter(
    robot => robot.position[0] > gridWidth / 2 && robot.position[1] > gridHeight / 2
  ).length
  const bottomLeftQuadrantCount = robots.filter(
    robot => robot.position[0] < Math.floor(gridWidth / 2) && robot.position[1] > gridHeight / 2
  ).length
  const bottomRightQuadrantCount = robots.filter(
    robot => robot.position[0] > gridWidth / 2 && robot.position[1] < Math.floor(gridHeight / 2)
  ).length

  return (
    topLeftQuadrantCount *
    topRightQuadrantCount *
    bottomLeftQuadrantCount *
    bottomRightQuadrantCount
  )
}

export const process = (day, part, expectedAnswer, fn) => {
  const strDay = day.toString().padStart(2, '0')
  const sampleAnswer = fn(`./day_${strDay}/sample_input.txt`, 11, 7)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn(`./day_${strDay}/input.txt`, 101, 103))
}

process(14, 'A', 12, partA)
