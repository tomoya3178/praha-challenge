import { Id } from 'src/domain/id';
export class Task {
  readonly value: {
    readonly id: Id;
    readonly name: string;
  };
  constructor(input: Task['value']) {
    this.value = input;
  }
  toObject() {
    const { id, ...rest } = this.value;
    return {
      ...rest,
      id: id.toString(),
    };
  }
}
