import { Test } from '@nestjs/testing';
import { AddTaskUseCase } from 'src/application/add-task.use-case';
import { Id } from 'src/domain/id';
import { Task } from 'src/domain/task';
import {
  TASK_REPOSITORY_TOKEN,
  TaskRepositoryInterface,
} from 'src/domain/task.repository.interface';

describe('AddTaskUseCase', () => {
  let useCase: AddTaskUseCase;
  let taskRepositoryMock: jest.Mocked<TaskRepositoryInterface>;

  beforeEach(async () => {
    taskRepositoryMock = {
      add: jest.fn(),
      findByIds: jest.fn(),
    } as jest.Mocked<TaskRepositoryInterface>;

    const module = await Test.createTestingModule({
      providers: [
        AddTaskUseCase,
        {
          provide: TASK_REPOSITORY_TOKEN,
          useValue: taskRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<AddTaskUseCase>(AddTaskUseCase);
  });

  it('should add a task successfully', async () => {
    const input = { id: Id.init(), name: 'test' };
    const task = new Task(input);

    await useCase.execute(input);

    expect(taskRepositoryMock.add).toHaveBeenCalledWith(task);
  });

  it('should handle repository add failure', async () => {
    const input = { id: Id.init(), name: 'test' };
    const error = new Error('Failed to add task');
    taskRepositoryMock.add.mockRejectedValueOnce(error);

    await expect(useCase.execute(input)).rejects.toThrow('Failed to add task');
  });
});
