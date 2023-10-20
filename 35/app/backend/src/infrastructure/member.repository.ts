import { PrismaService } from './prisma.service';
import { MemberRepositoryInterface } from 'src/domain/member.repository.interface';
import { AssignedTask, Member } from 'src/domain/member';
import { Id } from 'src/domain/id';

export class MemberRepository implements MemberRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}
  async findByEmail(email: string): Promise<Member | undefined> {
    const row = await this.prisma.member.findFirst({
      where: { email },
      include: { assignedTasks: true },
    });
    if (!row) {
      return undefined;
    }
    return this.toMember(row);
  }
  private toMember(row: any) {
    return new Member({
      ...row,
      id: new Id(row.id),
      assignedTasks: row.assignedTasks.map(
        (assignedTask: any) =>
          new AssignedTask({
            ...assignedTask,
            id: new Id(assignedTask.id),
            taskId: new Id(assignedTask.taskId),
          }),
      ),
    });
  }
  async add(member: Member) {
    const { assignedTasks, ...rest } = member.toObject();
    await this.prisma.$transaction(async (prisma) => {
      await prisma.member.create({
        data: rest,
      });
      await prisma.assignedTask.createMany({
        data: assignedTasks.map((assignedTask) => ({
          ...assignedTask,
          memberId: rest.id,
        })),
      });
    });
  }
  async findById(id: Member['value']['id']) {
    const row = await this.prisma.member.findFirst({
      where: { id: id.toString() },
      include: { assignedTasks: true },
    });
    if (!row) {
      return undefined;
    }
    return this.toMember(row);
  }
  async update(member: Member) {
    const { assignedTasks, ...rest } = member.toObject();
    await this.prisma.$transaction(async (prisma) => {
      await Promise.all([
        prisma.member.update({
          where: { id: member.value.id.toString() },
          data: rest,
        }),
        (async () => {
          await prisma.assignedTask.deleteMany({
            where: { memberId: member.value.id.toString() },
          });
          await prisma.assignedTask.createMany({
            data: assignedTasks.map((assignedTask) => ({
              ...assignedTask,
              memberId: member.value.id.toString(),
            })),
          });
        })(),
      ]);
    });
  }
}
