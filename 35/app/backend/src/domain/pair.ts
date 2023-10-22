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
    readonly members: Member[];
  };
  constructor(input: Pair['value']) {
    this.value = input;
  }
  addMember(member: Member) {
    if (this.value.members.length >= 3) {
      throw new InternalServerErrorException();
    }
    return new Pair({
      ...this.value,
      members: [...this.value.members, member],
    });
  }
  removeMember(memberId: Member['value']['id']) {
    if (this.value.members.length <= 2) {
      throw new InternalServerErrorException();
    }
    return new Pair({
      ...this.value,
      members: this.value.members.filter((x) => !x.value.id.equals(memberId)),
    });
  }
}
