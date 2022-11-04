import axios from "axios";
import { NameApiService, NameApiServiceInterface } from "./NameApiService";
import { DatabaseMock } from "./util";

export const sumOfArray = (numbers: number[]): number => {
  if (numbers.length === 0) {
    return 0
  }
  return numbers.reduce((a: number, b: number): number => a + b);
};

export const asyncSumOfArray = (numbers: number[]): Promise<number> => {
  return new Promise((resolve): void => {
    resolve(sumOfArray(numbers));
  });
};

export const asyncSumOfArraySometimesZero = (
  numbers: number[],
  database: DatabaseMock
): Promise<number> => {
  return new Promise((resolve): void => {
    try {
      // const database = new DatabaseMock(); // fixme: この関数をテストするには、DatabaseMockの使い方を変える必要がありそう！ヒント：依存性の注入
      database.save(numbers);
      resolve(sumOfArray(numbers));
    } catch (error) {
      resolve(0);
    }
  });
};

export const getFirstNameThrowIfLong = async (
  maxNameLength: number,
  nameApiService: NameApiServiceInterface
): Promise<string> => {
  // const nameApiService = new NameApiService(); // fixme: この関数をテストするには、NameApiServiceの使い方を変える必要がありそう！ヒント：依存性の注入
  const firstName = await nameApiService.getFirstName();

  if (firstName.length > maxNameLength) {
    throw new Error("first_name too long");
  }
  return firstName;
};

export const getFirstNameThrowIfLong2 = async (
  maxNameLength: number
): Promise<string> => {
  const { data } = await axios.get('https://random-data-api.com/api/name/random_name')
  if (data.first_name.length > maxNameLength) {
    throw new Error("first_name too long");
  }
  return data.first_name;
}

export const getFirstNames = async (
  length: number,
  nameApiService: NameApiServiceInterface,
): Promise<string[]> => {
  const firstNames = []
  for (let index = 0; index < length; index++) {
    firstNames.push(await nameApiService.getFirstName());
  }
  return firstNames;
};
