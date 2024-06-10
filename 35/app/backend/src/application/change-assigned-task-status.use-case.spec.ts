import { Test } from '@nestjs/testing';
import { Id } from 'src/domain/id';
import { ChangeAssignedTaskStatusUseCase } from './change-assigned-task-status.use-case';
import { AssignedTask, Member } from 'src/domain/member';
import { MEMBER_REPOSITORY_TOKEN } from '../domain/member.repository.interface';

const memberRepositoryMock = {
  add: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
};

describe('change assigned task status', () => {
  let useCase: ChangeAssignedTaskStatusUseCase;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ChangeAssignedTaskStatusUseCase,
        {
          provide: MEMBER_REPOSITORY_TOKEN,
          useValue: memberRepositoryMock,
        },
      ],
    }).compile();
    useCase = module.get(ChangeAssignedTaskStatusUseCase);
  });

  test('happy path', async () => {
    const memberId = Id.init();
    const assignedTaskId = Id.init();
    const taskId = Id.init();
    const member = new Member({
      id: memberId,
      status: 'ACTIVE',
      name: 'test',
      email: 'test',
      assignedTasks: [
        new AssignedTask({
          id: assignedTaskId,
          taskId,
          status: 'UNDONE',
        }),
      ],
    });
    memberRepositoryMock.findById.mockResolvedValue(member);
    const expected = new Member({
      id: memberId,
      status: 'ACTIVE',
      name: 'test',
      email: 'test',
      assignedTasks: [
        new AssignedTask({
          id: assignedTaskId,
          taskId,
          status: 'UNDONE',
        }),
      ],
    });
    await useCase.execute(memberId, taskId, 'REVIEWING');

    expect(memberRepositoryMock.update).toHaveBeenCalledWith(expected);
  });
});
