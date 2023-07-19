import { Id } from "src/domain/id";

export interface TaskInterface {
  id: Task['id']
  name: Task['name']
}

export class Task {
  readonly id: Id
  readonly name: string
  constructor (input: TaskInterface) {
    this.id = input.id
    this.name = input.name
  }
}
