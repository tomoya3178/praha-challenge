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
import { TRANSACTION_MANAGER_TOKEN } from './domain/transaction-manager.interface';
import {
  PRISMA_TRANSACTION_TOKEN,
  PrismaTransactionManager,
} from './infrastructure/prisma-transaction-manager';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup: (cls) => {
          cls.set(PRISMA_TRANSACTION_TOKEN, undefined);
        },
      },
    }),
  ],
  controllers: [TaskController, TeamController],
  providers: [
    PrismaService,
    AddTaskUseCase,
    AddMemberUseCase,
    AssignTasksUseCase,
    { provide: TRANSACTION_MANAGER_TOKEN, useClass: PrismaTransactionManager },
    { provide: TASK_REPOSITORY_TOKEN, useClass: TaskRepository },
    { provide: MEMBER_REPOSITORY_TOKEN, useClass: MemberRepository },
  ],
})
export class AppModule {}
