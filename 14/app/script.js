const isValid = (numbers) => {
  if (numbers.length > 30) {
    return false
  }
  if (numbers.some(number => isNaN(Number(number)))) {
    return false
  }
  return true    
}
const multiply = (...numbers) => {
  if (!isValid(numbers)) {
    throw new Error()
  }
  const result = numbers.reduce((result, number) => result * number)
  if (result > 1000) {
    return 'big big number'
  }
  return result
}
const add = (...numbers) => {
  if (!isValid(numbers)) {
    throw new Error()
  }
  const result = numbers.reduce((result, number) => result + number)
  if (result > 1000) {
    return 'too big'
  }
  return result
}
const subtract = (...numbers) => {
  if (!isValid(numbers)) {
    throw new Error()
  }
  return numbers.reduce((result, number) => result - number)
}
const divide = (...numbers) => {
  if (!isValid(numbers)) {
    throw new Error()
  }
  return numbers.reduce((result, number) => result / number)
}

module.exports = {
  multiply,
  add,
  subtract,
  divide
}
