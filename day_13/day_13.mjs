import * as fs from 'fs'
import { process } from '../utils.mjs'

const getGroups = fileName =>
  fs
    .readFileSync(fileName, 'utf8')
    .split(/\r?\n\r?\n/)
    .map(group => group.split(/\r?\n/))

const parseElement = (rawElement, delimeter) => {
  const [_, rawXY] = rawElement.split(': ')
  const [rawX, rawY] = rawXY.split(', ')
  return [parseInt(rawX.replace(`X${delimeter}`, '')), parseInt(rawY.replace(`Y${delimeter}`, ''))]
}

//{
// buttonA: [94, 34],
// buttonB: [22, 67],
// prize: [8400, 5400]
//}
const parseGroup = group => ({
  buttonA: parseElement(group[0], '+'),
  buttonB: parseElement(group[1], '+'),
  prize: parseElement(group[2], '=')
})

const partA = fileName =>
  getGroups(fileName)
    .map(parseGroup)
    .reduce((acc, { prize, buttonA, buttonB }) => {
      const [targetX, targetY] = prize
      const [ax, ay] = buttonA
      const [bx, by] = buttonB
      const aCost = 3
      const bCost = 1
      let lowestCost = Infinity

      // find all possible values for a and b
      for (let a = 0; a < 100; a++) {
        for (let b = 0; b < 100; b++) {
          if (targetX === ax * a + bx * b && targetY === ay * a + by * b) {
            lowestCost = Math.min(lowestCost, a * aCost + b * bCost)
          }
        }
      }

      return acc + (lowestCost === Infinity ? 0 : lowestCost)
    }, 0)

// the targets values are too high to brute force. It becomes a pair of linear equations like this
// 94a + 22b = 10000000008400
// 34a + 67b = 10000000005400
const partB = fileName =>
  getGroups(fileName)
    .map(parseGroup)
    .reduce((acc, { prize, buttonA, buttonB }) => {
      const targetX = prize[0] + 10000000000000
      const targetY = prize[1] + 10000000000000
      const [ax, ay] = buttonA // 94, 34
      const [bx, by] = buttonB // 22, 67
      const aCost = 3
      const bCost = 1

      // ax * a + bx * b = targetX
      // ay * a + by * b = targetY

      const aDenom = ax * by - ay * bx
      const aNumer = targetX * by - targetY * bx
      const a = aNumer / aDenom

      const bDenom = ay * bx - ax * by
      const bNumer = targetX * ay - targetY * ax
      const b = bNumer / bDenom

      if (Number.isInteger(a) && Number.isInteger(b)) {
        return acc + (a * aCost + b * bCost)
      }
      return acc
    }, 0)

// 156032253951283 is too high

process(13, 'A', 480, partA)
process(13, 'B', 875318608908, partB)
