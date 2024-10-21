import { Test, TestingModule } from '@nestjs/testing';
import { InactivateMemberUseCase } from './inactivate-member.use-case';
import { InternalServerErrorException } from '@nestjs/common';
import { Member } from 'src/domain/member';
import {
  MEMBER_REPOSITORY_TOKEN,
  MemberRepositoryInterface,
} from 'src/domain/member.repository.interface';
import {
  TEAM_REPOSITORY_TOKEN,
  TeamRepositoryInterface,
} from 'src/domain/team.repository.interface';
import {
  TRANSACTION_MANAGER_TOKEN,
  TransactionManagerInterface,
} from 'src/domain/transaction-manager.interface';
import { Id } from 'src/domain/id';
import { Team, Name as TeamName } from 'src/domain/team';
import { Pair, Name as PairName } from 'src/domain/pair';

describe('InactivateMemberUseCase', () => {
  let inactivateMemberUseCase: InactivateMemberUseCase;
  let mockTransactionManager: jest.Mocked<TransactionManagerInterface>;
  let mockMemberRepository: jest.Mocked<MemberRepositoryInterface>;
  let mockTeamRepository: jest.Mocked<TeamRepositoryInterface>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InactivateMemberUseCase,
        {
          provide: TRANSACTION_MANAGER_TOKEN,
          useValue: {
            execute: jest.fn((callback) => callback()),
          },
        },
        {
          provide: MEMBER_REPOSITORY_TOKEN,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
            add: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: TEAM_REPOSITORY_TOKEN,
          useValue: {
            findByMemberId: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    inactivateMemberUseCase = module.get<InactivateMemberUseCase>(
      InactivateMemberUseCase,
    );
    mockTransactionManager = module.get(TRANSACTION_MANAGER_TOKEN);
    mockMemberRepository = module.get(MEMBER_REPOSITORY_TOKEN);
    mockTeamRepository = module.get(TEAM_REPOSITORY_TOKEN);
  });

  it('should inactivate a member successfully', async () => {
    const memberId = new Id('member-1');
    const member = new Member({
      id: memberId,
      status: 'ACTIVE',
      name: 'member-1',
      email: 'member-1@example.com',
      assignedTasks: [],
    });
    const team = new Team({
      id: new Id('team-1'),
      name: new TeamName(1),
      pairs: [
        new Pair({
          id: new Id('pair-1'),
          name: new PairName('a'),
          memberIds: [
            new Id('member-1'),
            new Id('member-2'),
            new Id('member-3'),
          ],
        }),
      ],
    });

    mockMemberRepository.findById.mockResolvedValue(member);
    mockTeamRepository.findByMemberId.mockResolvedValue(team);
    mockTransactionManager.execute.mockImplementation(async (callback) => {
      await callback();
    });

    await inactivateMemberUseCase.execute(memberId);

    expect(mockMemberRepository.update).toHaveBeenCalledWith(
      member.changeStatus('INACTIVE'),
    );
    expect(mockTeamRepository.update).toHaveBeenCalledWith(
      team.removeMember(memberId),
    );
  });

  it('should throw InternalServerErrorException if member is not found', async () => {
    const memberId = new Id('member-1');
    mockMemberRepository.findById.mockResolvedValue(undefined);

    await expect(inactivateMemberUseCase.execute(memberId)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw InternalServerErrorException if team is not found', async () => {
    const memberId = new Id('member-1');
    const member = new Member({
      id: memberId,
      status: 'ACTIVE',
      name: 'member-1',
      email: 'member-1@example.com',
      assignedTasks: [],
    });

    mockMemberRepository.findById.mockResolvedValue(member);
    mockTeamRepository.findByMemberId.mockResolvedValue(undefined);

    await expect(inactivateMemberUseCase.execute(memberId)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
