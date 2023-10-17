import { PrismaService } from './prisma.service';
import { MemberRepositoryInterface } from 'src/domain/member.repository.interface';
import { AssignedTask, Member } from 'src/domain/member';
import { Id } from 'src/domain/id';

export class MemberRepository implements MemberRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}
  async findByEmail(email: string): Promise<Member | undefined> {
    const row = await this.prisma.member.findFirst({
      where: { email },
      include: { assignedTasks: true }
    })
    if (!row) {
      return undefined
    }
    return new Member({
      ...row,
      id: new Id(row.id),
      assignedTasks: row.assignedTasks.map(assignedTask => new AssignedTask({
        ...assignedTask,
        id: new Id(assignedTask.id),
        taskId: new Id(assignedTask.taskId)
      }))
    })
  }
  async add(member: Member) {
    const { assignedTasks, ...rest } = member.toObject()
    await this.prisma.member.create({
      data: rest,
    });
    await this.prisma.assignedTask.createMany({
      data: assignedTasks.map(assignedTask => ({
        ...assignedTask.toObject(),
        memberId: rest.id
      }))
    })
  }
}
