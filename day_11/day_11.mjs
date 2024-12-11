import * as fs from 'fs'
import { process } from '../utils.mjs'

const parseInput = fileName => fs.readFileSync(fileName, 'utf8').trim().split(' ')

const unpad = numString => Number(numString).toString()

const blink = stones => {
  let newStones = []
  stones.forEach(stone => {
    if (stone === '0') {
      newStones.push('1')
    } else if (stone.length % 2 === 0) {
      newStones.push(unpad(stone.slice(0, stone.length / 2)))
      newStones.push(unpad(stone.slice(stone.length / 2)))
    } else {
      newStones.push((Number(stone) * 2024).toString())
    }
  })
  return newStones
}

const blinkButBetter = stoneCounts => {
  const newStoneCounts = new Map()

  Array.from(stoneCounts.entries()).forEach(([stone, count]) => {
    if (stone === '0') {
      newStoneCounts.set('1', (newStoneCounts.get('1') || 0) + count)
    } else if (stone.length % 2 === 0) {
      const halfIndex = stone.length / 2
      const firstHalf = unpad(stone.slice(0, halfIndex))
      const secondHalf = unpad(stone.slice(halfIndex))

      newStoneCounts.set(firstHalf, (newStoneCounts.get(firstHalf) || 0) + count)
      newStoneCounts.set(secondHalf, (newStoneCounts.get(secondHalf) || 0) + count)
    } else {
      newStoneCounts.set(
        (Number(stone) * 2024).toString(),
        (newStoneCounts.get((Number(stone) * 2024).toString()) || 0) + count
      )
    }
  })

  return newStoneCounts
}

const partA = fileName => {
  let stones = parseInput(fileName)
  for (let i = 0; i < 25; i++) stones = blink(stones)
  return stones.length
}

const partB = fileName => {
  // instead of an array, use a hash map to keep the count of unique stones
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
