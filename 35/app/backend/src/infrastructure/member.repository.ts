import { PrismaService } from './prisma.service';
import { MemberRepositoryInterface } from 'src/domain/member.repository.interface';
import { AssignedTask, Member } from 'src/domain/member';
import { Id } from 'src/domain/id';
import {
  PRISMA_TRANSACTION_TOKEN,
  PrismaTransactionType,
} from './prisma-transaction-manager';
import { ClsService } from 'nestjs-cls';

export class MemberRepository implements MemberRepositoryInterface {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService,
  ) {}
  async findByEmail(email: string): Promise<Member | undefined> {
    const row = await this.prisma.members.findFirst({
      where: { email },
      include: { AssignedTask: true },
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
    const process = async (transaction: PrismaTransactionType) => {
      await transaction.members.create({
        data: rest,
      });
      await transaction.assignedTasks.createMany({
        data: assignedTasks.map((assignedTask) => ({
          ...assignedTask,
          memberId: rest.id,
        })),
      });
    };
    const transaction = this.cls.get<PrismaTransactionType>(
      PRISMA_TRANSACTION_TOKEN,
    );
    if (transaction) {
      await process(transaction);
      return;
    }
    await this.prisma.$transaction(async (transaction) => {
      await process(transaction);
    });
  }
  async findById(id: Member['value']['id']) {
    const row = await this.prisma.members.findFirst({
      where: { id: id.toString() },
      include: { AssignedTask: true },
    });
    if (!row) {
      return undefined;
    }
    return this.toMember(row);
  }
  async update(member: Member) {
    const { assignedTasks, ...rest } = member.toObject();
    const process = async (transaction: PrismaTransactionType) => {
      await Promise.all([
        transaction.members.update({
          where: { id: member.value.id.toString() },
          data: rest,
        }),
        (async () => {
          await transaction.assignedTasks.deleteMany({
            where: { memberId: member.value.id.toString() },
          });
          await transaction.assignedTasks.createMany({
            data: assignedTasks.map((assignedTask) => ({
              ...assignedTask,
              memberId: member.value.id.toString(),
            })),
          });
        })(),
      ]);
    };
    const transaction = this.cls.get<PrismaTransactionType>(
      PRISMA_TRANSACTION_TOKEN,
    );
    if (transaction) {
      await process(transaction);
      return;
    }
    await this.prisma.$transaction(async (transaction) => {
      await process(transaction);
    });
  }
}
