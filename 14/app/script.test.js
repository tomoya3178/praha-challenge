const {
  multiply,
  add,
  subtract,
  divide
} = require('./script')

test('multiply', () => {
  expect(multiply(3, 10, 3)).toBe(90);
  expect(() => multiply(...[...Array(31)].map((_, index) => index + 1))).toThrow();
  expect(() => multiply('string')).toThrow();
  expect(multiply(10, 10, 10)).toBe(1000);
  expect(multiply(10, 10, 11)).toBe('big big number');
});

test('add', () => {
  expect(add(3, 10, 3)).toBe(16);
  expect(() => add(...[...Array(31)].map((_, index) => index + 1))).toThrow();
  expect(() => add('string')).toThrow();
  expect(add(300, 300, 400)).toBe(1000);
  expect(add(300, 300, 401)).toBe('too big');
});

test('subtract', () => {
  expect(subtract(3, 10, 3)).toBe(-10);
  expect(() => subtract(...[...Array(31)].map((_, index) => index + 1))).toThrow();
  expect(() => subtract('string')).toThrow();
});

test('divide', () => {
  expect(divide(100, 10)).toBe(10);
  expect(() => divide(...[...Array(31)].map((_, index) => index + 1))).toThrow();
  expect(() => divide('string')).toThrow();
});
