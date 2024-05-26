import { PrismaService } from './prisma.service';
import { MemberRepositoryInterface } from 'src/domain/member.repository.interface';
import { Member } from 'src/domain/member';
import { Id } from 'src/domain/id';

export class MemberRepository implements MemberRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}
  async findByEmail(email: string): Promise<Member | undefined> {
    const row = await this.prisma.members.findFirst({ where: { email } })
    if (!row) {
      return undefined
    }
    return new Member({
      ...row,
      id: new Id(row.id),
    })
  }
  async add(member: Member) {
    await this.prisma.members.create({
      data: member.toObject(),
    });
  }
}
