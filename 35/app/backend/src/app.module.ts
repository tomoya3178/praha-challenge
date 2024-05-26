import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/prisma.service';
import { TaskController } from './presentation/task.controller';
import { AddTaskUseCase } from './application/add-task.use-case';
import { TASK_REPOSITORY_TOKEN } from './domain/task.repository.interface';
import { TaskRepository } from './infrastructure/task.repository';
import { MemberController } from './presentation/member.controller';
import { AddMemberUseCase } from './application/add-member.use-case';
import { MEMBER_REPOSITORY_TOKEN } from './domain/member.repository.interface';
import { MemberRepository } from './infrastructure/member.repository';

@Module({
  imports: [],
  controllers: [TaskController, MemberController],
  providers: [
    PrismaService,
    AddTaskUseCase,
    AddMemberUseCase,
    { provide: TASK_REPOSITORY_TOKEN, useClass: TaskRepository },
    { provide: MEMBER_REPOSITORY_TOKEN, useClass: MemberRepository },
  ],
})
export class AppModule {}
