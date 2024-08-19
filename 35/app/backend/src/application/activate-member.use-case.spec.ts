import { Test } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { ActivateMemberUseCase } from './activate-member.use-case';
import { Member } from 'src/domain/member';
import { Team, Name as TeamName } from 'src/domain/team';
import { Pair, Name as PairName } from 'src/domain/pair';
import { Id } from 'src/domain/id';
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

describe('ActivateMemberUseCase', () => {
  let activateMemberUseCase: ActivateMemberUseCase;
  let mockMemberRepository: jest.Mocked<MemberRepositoryInterface>;
  let mockTeamRepository: jest.Mocked<TeamRepositoryInterface>;
  let mockTransactionManager: jest.Mocked<TransactionManagerInterface>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ActivateMemberUseCase,
        {
          provide: MEMBER_REPOSITORY_TOKEN,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: TEAM_REPOSITORY_TOKEN,
          useValue: {
            getAll: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: TRANSACTION_MANAGER_TOKEN,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    activateMemberUseCase = moduleRef.get<ActivateMemberUseCase>(
      ActivateMemberUseCase,
    );
    mockMemberRepository = moduleRef.get(MEMBER_REPOSITORY_TOKEN);
    mockTeamRepository = moduleRef.get(TEAM_REPOSITORY_TOKEN);
    mockTransactionManager = moduleRef.get(TRANSACTION_MANAGER_TOKEN);
  });

  it('should activate an inactive member and add them to the team with the least members', async () => {
    const memberId = new Id('member-1');
    const mockMember = new Member({
      id: memberId,
      status: 'INACTIVE',
      name: 'John Doe',
      email: 'john@example.com',
      assignedTasks: [],
    });

    const mockTeams = [
      new Team({
        id: new Id('team-1'),
        name: new TeamName(1),
        pairs: [
          new Pair({
            id: new Id('pair-1'),
            name: new PairName('a'),
            memberIds: [new Id('member-2'), new Id('member-3')],
          }),
        ],
      }),
      new Team({
        id: new Id('team-2'),
        name: new TeamName(2),
        pairs: [
          new Pair({
            id: new Id('pair-2'),
            name: new PairName('b'),
            memberIds: [new Id('member-4')],
          }),
        ],
      }),
    ];

    mockMemberRepository.findById.mockResolvedValue(mockMember);
    mockTeamRepository.getAll.mockResolvedValue(mockTeams);

    mockTransactionManager.execute.mockImplementation(async (callback) => {
      await callback();
    });

    await activateMemberUseCase.execute(memberId);

    const updatedMember = mockMember.changeStatus('ACTIVE');

    expect(mockMemberRepository.findById).toHaveBeenCalledWith(memberId);
    expect(mockTeamRepository.getAll).toHaveBeenCalled();
    expect(mockTransactionManager.execute).toHaveBeenCalled();
    expect(mockMemberRepository.update).toHaveBeenCalledWith(updatedMember);
    expect(mockTeamRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        value: expect.objectContaining({
          id: new Id('team-2'),
          name: new TeamName(2),
          pairs: expect.arrayContaining([
            expect.objectContaining({
              value: expect.objectContaining({
                memberIds: expect.arrayContaining([
                  new Id('member-4'),
                  memberId,
                ]),
              }),
            }),
          ]),
        }),
      }),
    );
  });

  it('should throw InternalServerErrorException if member is not found', async () => {
    mockMemberRepository.findById.mockResolvedValue(undefined);

    await expect(
      activateMemberUseCase.execute(new Id('non-existent-id')),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException if member is already active', async () => {
    const memberId = new Id('member-1');
    const mockMember = new Member({
      id: memberId,
      status: 'ACTIVE',
      name: 'John Doe',
      email: 'john@example.com',
      assignedTasks: [],
    });

    mockMemberRepository.findById.mockResolvedValue(mockMember);

    await expect(activateMemberUseCase.execute(memberId)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should create a new pair if all existing pairs have 3 members', async () => {
    const memberId = new Id('member-1');
    const mockMember = new Member({
      id: memberId,
      status: 'INACTIVE',
      name: 'John Doe',
      email: 'john@example.com',
      assignedTasks: [],
    });

    const mockTeam = new Team({
      id: new Id('team-1'),
      name: new TeamName(1),
      pairs: [
        new Pair({
          id: new Id('pair-1'),
          name: new PairName('a'),
          memberIds: [
            new Id('member-2'),
            new Id('member-3'),
            new Id('member-4'),
          ],
        }),
      ],
    });

    mockMemberRepository.findById.mockResolvedValue(mockMember);
    mockTeamRepository.getAll.mockResolvedValue([mockTeam]);

    mockTransactionManager.execute.mockImplementation(async (callback) => {
      await callback();
    });

    await activateMemberUseCase.execute(memberId);

    expect(mockTeamRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        value: expect.objectContaining({
          pairs: expect.arrayContaining([
            expect.objectContaining({
              value: expect.objectContaining({
                memberIds: expect.arrayContaining([
                  new Id('member-2'),
                  new Id('member-3'),
                ]),
              }),
            }),
            expect.objectContaining({
              value: expect.objectContaining({
                memberIds: expect.arrayContaining([
                  new Id('member-4'),
                  memberId,
                ]),
              }),
            }),
          ]),
        }),
      }),
    );
  });
});
