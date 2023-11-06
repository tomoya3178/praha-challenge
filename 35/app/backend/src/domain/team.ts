import { InternalServerErrorException } from '@nestjs/common';
import { Member } from './member';
import { Pair, Name as PairName } from './pair';
import { Id } from './id';

export class Name {
  readonly value: number;
  constructor(input: Name['value']) {
    if (String(input).length > 3) {
      throw new InternalServerErrorException();
    }
    this.value = input;
  }
}

export class Team {
  readonly value: {
    readonly id: Id;
    readonly name: Name;
    readonly pairs: ReadonlyArray<Pair>;
  };
  constructor(input: Team['value']) {
    this.value = input;
  }
  addMember(member: Member) {
    const smallestPair = this.value.pairs.reduce((smallest, current) => {
      if (smallest.value.members.length <= current.value.members.length) {
        return smallest;
      }
      return current;
    });
    if (smallestPair.value.members.length === 3) {
      const movingMember = smallestPair.value.members.at(-1);
      if (!movingMember) {
        throw new InternalServerErrorException();
      }
      return new Team({
        ...this.value,
        pairs: [
          ...this.value.pairs.map((x) => {
            if (x.value.id.equals(smallestPair.value.id)) {
              return x.removeMember(movingMember.value.id);
            }
            return x;
          }),
          new Pair({
            id: Id.init(),
            name: new PairName('z'),
            members: [movingMember, member],
          }),
        ],
      });
    }
    return new Team({
      ...this.value,
      pairs: this.value.pairs.map((x) => {
        if (x.value.id.equals(smallestPair.value.id)) {
          return x.addMember(member);
        }
        return x;
      }),
    });
  }
  removeMember(memberId: Member['value']['id']) {
    const pair = this.value.pairs.find((pair) =>
      pair.value.members.some((x) => x.value.id.equals(memberId)),
    );
    if (!pair) {
      throw new InternalServerErrorException();
    }
    if (pair.value.members.length === 2) {
      const restMember = pair.value.members.find(
        (x) => !x.value.id.equals(memberId),
      );
      if (!restMember) {
        throw new InternalServerErrorException();
      }
      return new Team({
        ...this.value,
        pairs: this.value.pairs.filter(
          (x) => !x.value.id.equals(pair.value.id),
        ),
      }).addMember(restMember);
    }
    return new Team({
      ...this.value,
      pairs: this.value.pairs.map((x) => {
        if (x.value.id.equals(pair.value.id)) {
          return x.removeMember(memberId);
        }
        return x;
      }),
    });
  }
}
