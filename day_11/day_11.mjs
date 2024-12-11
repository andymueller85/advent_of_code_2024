import * as fs from 'fs'
import { process } from '../utils.mjs'

const parseInput = fileName => fs.readFileSync(fileName, 'utf8').trim().split(' ').map(Number)

const blink = stones =>
  stones.reduce((newStones, stone) => {
    const stoneStr = stone.toString()
    if (stone === 0) {
      newStones.push(1)
    } else if (stoneStr.length % 2 === 0) {
      newStones.push(Number(stoneStr.slice(0, stoneStr.length / 2)))
      newStones.push(Number(stoneStr.slice(stoneStr.length / 2)))
    } else {
      newStones.push(stone * 2024)
    }
    return newStones
  }, [])

const blinkButBetter = stoneCounts =>
  Array.from(stoneCounts.entries()).reduce((newStoneCounts, [stone, count]) => {
    const stoneStr = stone.toString()
    if (stone === 0) {
      newStoneCounts.set(1, (newStoneCounts.get(1) || 0) + count)
    } else if (stoneStr.length % 2 === 0) {
      const halfIndex = stoneStr.length / 2
      const firstHalf = Number(stoneStr.slice(0, halfIndex))
      const secondHalf = Number(stoneStr.slice(halfIndex))

      newStoneCounts.set(firstHalf, (newStoneCounts.get(firstHalf) || 0) + count)
      newStoneCounts.set(secondHalf, (newStoneCounts.get(secondHalf) || 0) + count)
    } else {
      const multipliedStone = stone * 2024

      newStoneCounts.set(multipliedStone, (newStoneCounts.get(multipliedStone) || 0) + count)
    }
    return newStoneCounts
  }, new Map())

const partA = fileName => {
  let stones = parseInput(fileName)
  for (let i = 0; i < 25; i++) stones = blink(stones)
  return stones.length
}

const partB = fileName => {
  let stones = parseInput(fileName)
  let stoneCounts = new Map()

  stones.forEach(stone => {
    stoneCounts.set(stone, (stoneCounts.get(stone) || 0) + 1)
  })

  for (let i = 0; i < 75; i++) stoneCounts = blinkButBetter(stoneCounts)

  return Array.from(stoneCounts.values()).reduce((acc, cur) => acc + cur, 0)
}

process(11, 'A', 55312, partA)
process(11, 'B', 65601038650482, partB)
