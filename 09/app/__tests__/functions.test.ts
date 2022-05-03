// todo: ここに単体テストを書いてみましょう！
import { asyncSumOfArray, asyncSumOfArraySometimesZero, getFirstNameThrowIfLong, sumOfArray } from "../functions";

test('sum of array [1, 1]', () => {
  expect(sumOfArray([1, 1])).toBe(2);
});

test('sum of array []', () => {
  expect(sumOfArray([])).toBe(0);
});

test('async sum of array [1, 1]', async () => {
  await expect(asyncSumOfArray([1, 1])).resolves.toBe(2);
});

test('async sum of array []', async () => {
  await expect(asyncSumOfArray([])).resolves.toBe(0);
});

test('async sum of array sometimes zero [1, 1]', async () => {
  const databaseMock = { save: jest.fn() }
  await expect(asyncSumOfArraySometimesZero([1, 1], databaseMock)).resolves.toBe(2);
  expect(databaseMock.save).toBeCalledTimes(1);
});

test('async sum of array sometimes zero [1, 1]', async () => {
  const databaseMock = { save: jest.fn(() => new Error("fail!")) }
  await expect(asyncSumOfArraySometimesZero([1, 1], databaseMock)).resolves.toBe(0);
  expect(databaseMock.save).toBeCalledTimes(1);
});

test('async get first name throw if long in 10', async () => {
  const apiMock = { getFirstName: jest.fn(async () => 'test') }
  await expect(getFirstNameThrowIfLong(10, apiMock)).resolves.toBe('test');
  expect(apiMock.getFirstName).toBeCalledTimes(1);
});

test('async get first name throw if long over 3', async () => {
  const apiMock = { getFirstName: jest.fn(async () => 'test') }
  await expect(getFirstNameThrowIfLong(3, apiMock)).rejects.toThrow();
  expect(apiMock.getFirstName).toBeCalledTimes(1);
});
