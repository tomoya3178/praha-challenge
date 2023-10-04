import { Id } from './id';

export class Member {
  readonly value: {
    readonly id: Id;
    readonly status: '在籍中' | '休会中' | '退会済';
    readonly name: string;
    readonly email: string;
  };
  constructor(input: Member['value']) {
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
