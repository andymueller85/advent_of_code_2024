import * as fs from 'fs'
import { process } from '../utils.mjs'

const parseInput = fileName => fs.readFileSync(fileName, 'utf8').trim().split(' ')

const blink = stones => {
  let newStones = []
  stones.forEach((stone, i, stones) => {
    if (stone === '0') {
      newStones.push('1')
    } else if (stone.length % 2 === 0) {
      newStones.push(Number(stone.slice(0, stone.length / 2)).toString())
      newStones.push(Number(stone.slice(stone.length / 2)).toString())
    } else {
      newStones.push((Number(stone) * 2024).toString())
    }
  })
  return newStones
}

const partA = fileName => {
  let stones = parseInput(fileName)
  for (let i = 0; i < 25; i++) stones = blink(stones)
  return stones.length
}

process(11, 'A', 55312, partA)
