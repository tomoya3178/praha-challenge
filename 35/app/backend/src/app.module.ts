import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/prisma.service';
import { TaskController } from './presentation/task.controller';
import { AddTaskUseCase } from './application/add-task.use-case';
import { TASK_REPOSITORY_TOKEN } from './domain/task.repository.interface';
import { TaskRepository } from './infrastructure/task.repository';
import { TeamController } from './presentation/team.controller';
import { AddMemberUseCase } from './application/add-member.use-case';
import { MEMBER_REPOSITORY_TOKEN } from './domain/member.repository.interface';
import { MemberRepository } from './infrastructure/member.repository';
import { AssignTasksUseCase } from './application/assign-tasks.use-case';

@Module({
  imports: [],
  controllers: [TaskController, TeamController],
  providers: [
    PrismaService,
    AddTaskUseCase,
    AddMemberUseCase,
    AssignTasksUseCase,
    { provide: TASK_REPOSITORY_TOKEN, useClass: TaskRepository },
    { provide: MEMBER_REPOSITORY_TOKEN, useClass: MemberRepository },
  ],
})
export class AppModule {}
