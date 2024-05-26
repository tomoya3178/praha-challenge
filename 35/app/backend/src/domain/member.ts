import { Id } from './id';

export class Member {
  readonly value: {
    readonly id: Id;
    readonly status: 'ACTIVE' | 'PAUSING' | 'INACTIVE';
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
