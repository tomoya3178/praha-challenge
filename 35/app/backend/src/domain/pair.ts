import { InternalServerErrorException } from '@nestjs/common';
import { Member } from './member';
import { Id } from './id';

export class Name {
  readonly value: string;
  constructor(input: Name['value']) {
    if (!/[a-z]/.test(input)) {
      throw new InternalServerErrorException();
    }
    this.value = input;
  }
}

export class Pair {
  readonly value: {
    readonly id: Id;
    readonly name: Name;
    readonly memberIds: ReadonlyArray<Member['value']['id']>;
  };
  constructor(input: Pair['value']) {
    this.value = input;
  }
  addMember(memberId: Member['value']['id']) {
    if (this.value.memberIds.length >= 3) {
      throw new InternalServerErrorException();
    }
    return new Pair({
      ...this.value,
      memberIds: [...this.value.memberIds, memberId],
    });
  }
  removeMember(memberId: Member['value']['id']) {
    if (this.value.memberIds.length <= 2) {
      throw new InternalServerErrorException();
    }
    return new Pair({
      ...this.value,
      memberIds: this.value.memberIds.filter((x) => !x.equals(memberId)),
    });
  }
}
