import { Task } from 'src/domain/task';
import { TaskRepositoryInterface } from 'src/domain/task.repository.interface';
import { PrismaService } from './prisma.service';

export class TaskRepository implements TaskRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}
  async add(task: Task) {
    await this.prisma.task.create({
      data: task.toObject(),
    });
  }
}
