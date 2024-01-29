import { v4 } from 'uuid';

export class Id {
  private readonly value: string;
  constructor(input: string) {
    this.value = input;
  }
  static init() {
    return new Id(v4());
  }
  equals(input: Id) {
    return this.value === input.toString();
  }
  toString() {
    return this.value;
  }
}
