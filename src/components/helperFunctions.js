import seedrandom from "seedrandom"

function getRandomInRange(from, to, fixed, seed = '') {
  let random
  if (seed) {
    let rng = seedrandom(seed)
    random = rng()
  } else {
    random = Math.random()
  }
  return (random * (to - from) + from).toFixed(fixed) * 1
}

export {getRandomInRange}