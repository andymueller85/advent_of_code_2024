export const process = (day, part, expectedAnswer, fn) => {
  const strDay = day.toString().padStart(2, '0')
  const sampleAnswer = fn(`./day_${strDay}/sample_input.txt`)

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedAnswer) {
    throw new Error(`part ${part} sample answer should be ${expectedAnswer}`)
  }

  console.log(`part ${part} real answer`, fn(`./day_${strDay}/input.txt`))
}
