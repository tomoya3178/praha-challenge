import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AssignTasksUseCase } from './assign-tasks.use-case';
import { AssignedTask, Member } from 'src/domain/member';
import { Task } from 'src/domain/task';
import { Id } from 'src/domain/id';
import {
  MEMBER_REPOSITORY_TOKEN,
  MemberRepositoryInterface,
} from 'src/domain/member.repository.interface';
import {
  TASK_REPOSITORY_TOKEN,
  TaskRepositoryInterface,
} from 'src/domain/task.repository.interface';

describe('AssignTasksUseCase', () => {
  let assignTasksUseCase: AssignTasksUseCase;
  let mockMemberRepository: jest.Mocked<MemberRepositoryInterface>;
  let mockTaskRepository: jest.Mocked<TaskRepositoryInterface>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AssignTasksUseCase,
        {
          provide: MEMBER_REPOSITORY_TOKEN,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: TASK_REPOSITORY_TOKEN,
          useValue: {
            findByIds: jest.fn(),
          },
        },
      ],
    }).compile();

    assignTasksUseCase = moduleRef.get<AssignTasksUseCase>(AssignTasksUseCase);
    mockMemberRepository = moduleRef.get(MEMBER_REPOSITORY_TOKEN);
    mockTaskRepository = moduleRef.get(TASK_REPOSITORY_TOKEN);
  });

  it('should assign tasks to a member successfully', async () => {
    const memberId = new Id('member-1');
    const taskIds = [new Id('task-1'), new Id('task-2')];
    const mockMember = new Member({
      id: memberId,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'ACTIVE',
      assignedTasks: [],
    });
    const mockTasks = [
      new Task({ id: new Id('task-1'), name: 'Task 1' }),
      new Task({ id: new Id('task-2'), name: 'Task 2' }),
    ];
    const mockMemberWithTasks = new Member({
      id: memberId,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'ACTIVE',
      assignedTasks: mockTasks.map(
        (task) =>
          new AssignedTask({
            id: Id.init(),
            taskId: task.value.id,
            status: 'UNDONE',
          }),
      ),
    });

    mockMemberRepository.findById.mockResolvedValue(mockMember);
    mockTaskRepository.findByIds.mockResolvedValue(mockTasks);

    await assignTasksUseCase.execute({ memberId, taskIds });

    expect(mockMemberRepository.findById).toHaveBeenCalledWith(memberId);
    expect(mockTaskRepository.findByIds).toHaveBeenCalledWith(taskIds);
    expect(mockMemberRepository.update).toHaveBeenCalledWith(
      mockMemberWithTasks,
    );
  });

  it('should throw BadRequestException when member is not found', async () => {
    const memberId = new Id('non-existent-id');
    const taskIds = [new Id('task-1'), new Id('task-2')];

    mockMemberRepository.findById.mockResolvedValue(undefined);

    await expect(
      assignTasksUseCase.execute({ memberId, taskIds }),
    ).rejects.toThrow(BadRequestException);

    expect(mockMemberRepository.findById).toHaveBeenCalledWith(memberId);
    expect(mockTaskRepository.findByIds).not.toHaveBeenCalled();
    expect(mockMemberRepository.update).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when tasks are not found', async () => {
    const memberId = new Id('member-1');
    const taskIds = [new Id('task-1'), new Id('task-2')];
    const mockMember = new Member({
      id: memberId,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'ACTIVE',
      assignedTasks: [],
    });

    mockMemberRepository.findById.mockResolvedValue(mockMember);
    mockTaskRepository.findByIds.mockResolvedValue([]);

    await expect(
      assignTasksUseCase.execute({ memberId, taskIds }),
    ).rejects.toThrow(BadRequestException);

    expect(mockMemberRepository.findById).toHaveBeenCalledWith(memberId);
    expect(mockTaskRepository.findByIds).toHaveBeenCalledWith(taskIds);
    expect(mockMemberRepository.update).not.toHaveBeenCalled();
  });
});
