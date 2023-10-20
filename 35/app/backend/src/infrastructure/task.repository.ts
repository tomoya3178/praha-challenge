import { Task } from 'src/domain/task';
import { TaskRepositoryInterface } from 'src/domain/task.repository.interface';
import { PrismaService } from './prisma.service';
import { Id } from 'src/domain/id';

export class TaskRepository implements TaskRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}
  async add(task: Task) {
    await this.prisma.task.create({
      data: task.toObject(),
    });
  }
  async findByIds(ids: Id[]): Promise<Task[]> {
    const rows = await this.prisma.task.findMany({
      where: { id: { in: ids.map((id) => id.toString()) } },
    });
    return rows.map(
      (row) =>
        new Task({
          ...row,
          id: new Id(row.id),
        }),
    );
  }
}
