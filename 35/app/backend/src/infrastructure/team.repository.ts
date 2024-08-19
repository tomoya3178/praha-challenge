import { TeamRepositoryInterface } from 'src/domain/team.repository.interface';
import { PrismaService } from './prisma.service';
import { Name, Team } from 'src/domain/team';
import { Id } from 'src/domain/id';
import { Pair, Name as PairName } from 'src/domain/pair';

export class TeamRepository implements TeamRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: Id): Promise<Team | undefined> {
    const row = await this.prisma.teams.findUnique({
      where: { id: id.toString() },
      include: {
        pairs: {
          include: {
            pairMembers: true,
          },
        },
      },
    });
    if (!row) {
      return;
    }
    return new Team({
      id: new Id(row.id),
      name: new Name(row.name),
      pairs: row.pairs.map(
        (pair) =>
          new Pair({
            ...pair,
            id: new Id(pair.id),
            name: new PairName(pair.name),
            memberIds: pair.pairMembers.map(({ memberId }) => new Id(memberId)),
          }),
      ),
    });
  }
  async findByMemberId(memberId: Id) {
    const row = await this.prisma.teams.findFirst({
      where: {
        pairs: {
          some: {
            pairMembers: {
              some: { memberId: memberId.toString() },
            },
          },
        },
      },
      include: {
        pairs: {
          include: {
            pairMembers: true,
          },
        },
      },
    });
    if (!row) {
      return;
    }
    return new Team({
      id: new Id(row.id),
      name: new Name(row.name),
      pairs: row.pairs.map(
        (pair) =>
          new Pair({
            ...pair,
            id: new Id(pair.id),
            name: new PairName(pair.name),
            memberIds: pair.pairMembers.map(({ memberId }) => new Id(memberId)),
          }),
      ),
    });
  }
  async getAll() {
    const rows = await this.prisma.teams.findMany({
      include: { pairs: { include: { pairMembers: true } } },
    });
    return rows.map(
      (row) =>
        new Team({
          ...row,
          id: new Id(row.id),
          name: new Name(row.name),
          pairs: row.pairs.map(
            (pair) =>
              new Pair({
                ...pair,
                id: new Id(pair.id),
                name: new PairName(pair.name),
                memberIds: pair.pairMembers.map(
                  ({ memberId }) => new Id(memberId),
                ),
              }),
          ),
        }),
    );
  }
  async update(team: Team) {}
}
