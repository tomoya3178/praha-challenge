import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { PrismaService } from './infrastructure/prisma.service';
import { TaskController } from './presentation/task.controller';
import { AddTaskUseCase } from './application/add-task.use-case';
import { TASK_REPOSITORY_TOKEN } from './domain/task.repository.interface';
import { TaskRepository } from './infrastructure/task.repository';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [
    PrismaService,
    AddTaskUseCase,
    { provide: TASK_REPOSITORY_TOKEN, useClass: TaskRepository },
  ],
=======

@Module({
  imports: [],
  controllers: [],
  providers: [],
>>>>>>> main
})
export class AppModule {}
