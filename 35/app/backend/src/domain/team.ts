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
  addMember(memberId: Member['value']['id']) {
    const smallestPair = this.value.pairs.reduce((smallest, current) => {
      if (smallest.value.memberIds.length <= current.value.memberIds.length) {
        return smallest;
      }
      return current;
    });
    if (smallestPair.value.memberIds.length === 3) {
      const movingMemberId = smallestPair.value.memberIds.at(-1);
      if (!movingMemberId) {
        throw new InternalServerErrorException();
      }
      return new Team({
        ...this.value,
        pairs: [
          ...this.value.pairs.map((x) => {
            if (x.value.id.equals(smallestPair.value.id)) {
              return x.removeMember(movingMemberId);
            }
            return x;
          }),
          new Pair({
            id: Id.init(),
            name: new PairName('z'),
            memberIds: [movingMemberId, memberId],
          }),
        ],
      });
    }
    return new Team({
      ...this.value,
      pairs: this.value.pairs.map((x) => {
        if (x.value.id.equals(smallestPair.value.id)) {
          return x.addMember(memberId);
        }
        return x;
      }),
    });
  }
  removeMember(memberId: Member['value']['id']) {
    const pair = this.value.pairs.find((pair) =>
      pair.value.memberIds.some((x) => x.equals(memberId)),
    );
    if (!pair) {
      throw new InternalServerErrorException();
    }
    if (pair.value.memberIds.length === 2) {
      const restMemberId = pair.value.memberIds.find(
        (x) => !x.equals(memberId),
      );
      if (!restMemberId) {
        throw new InternalServerErrorException();
      }
      return new Team({
        ...this.value,
        pairs: this.value.pairs.filter(
          (x) => !x.value.id.equals(pair.value.id),
        ),
      }).addMember(restMemberId);
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
