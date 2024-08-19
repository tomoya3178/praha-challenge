import { Test } from '@nestjs/testing';
import { AddTaskUseCase } from 'src/application/add-task.use-case';
import { Id } from 'src/domain/id';
import { Task } from 'src/domain/task';
import { TASK_REPOSITORY_TOKEN } from 'src/domain/task.repository.interface';

const taskRepositoryMock = {
  add: jest.fn(),
  findByIds: jest.fn(),
};

describe('add task', () => {
  let useCase: AddTaskUseCase;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AddTaskUseCase,
        {
          provide: TASK_REPOSITORY_TOKEN,
          useValue: taskRepositoryMock,
        },
      ],
    }).compile();
    useCase = module.get(AddTaskUseCase);
  });

  test('happy path', async () => {
    const input = { id: Id.init(), name: 'test' };
    const task = new Task(input);

    await useCase.execute(input);

    expect(taskRepositoryMock.add).toHaveBeenCalledWith(task);
  });
});
