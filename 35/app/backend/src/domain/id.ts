import { uuid } from 'uuidv4'

export class Id {
  private readonly value: string
  constructor (input: string) {
    this.value = input
  }
  static init () {
    return new Id(uuid())
  }
  equals (input: Id) {
    return this.value === input.toString()
  }
  toString () {
    return this.value
  }
}
