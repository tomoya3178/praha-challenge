import { Test } from '@nestjs/testing';
import { AddMemberUseCase } from 'src/application/add-member.use-case';
import { Id } from 'src/domain/id';
import { Member } from 'src/domain/member';
import { MemberService } from 'src/domain/member.service';
import { Name as PairName, Pair } from 'src/domain/pair';
import { Name as TeamName, Team } from 'src/domain/team';
import {
  TRANSACTION_MANAGER_TOKEN,
  TransactionManagerInterface,
} from '../domain/transaction-manager.interface';
import {
  MEMBER_REPOSITORY_TOKEN,
  MemberRepositoryInterface,
} from '../domain/member.repository.interface';
import {
  TEAM_REPOSITORY_TOKEN,
  TeamRepositoryInterface,
} from '../domain/team.repository.interface';

describe('add member', () => {
  let useCase: AddMemberUseCase;
  let transactionManagerMock: jest.Mocked<TransactionManagerInterface>;
  let memberServiceMock: jest.Mocked<MemberService>;
  let memberRepositoryMock: jest.Mocked<MemberRepositoryInterface>;
  let teamRepositoryMock: jest.Mocked<TeamRepositoryInterface>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AddMemberUseCase,
        {
          provide: MemberService,
          useValue: {
            emailExists: jest.fn(),
          },
        },
        {
          provide: TRANSACTION_MANAGER_TOKEN,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: MEMBER_REPOSITORY_TOKEN,
          useValue: {
            add: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: TEAM_REPOSITORY_TOKEN,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(AddMemberUseCase);
    transactionManagerMock = module.get(TRANSACTION_MANAGER_TOKEN);
    memberServiceMock = module.get(MemberService);
    memberRepositoryMock = module.get(MEMBER_REPOSITORY_TOKEN);
    teamRepositoryMock = module.get(TEAM_REPOSITORY_TOKEN);
  });

  test('happy path', async () => {
    transactionManagerMock.execute.mockImplementation(async (callback) => {
      await callback();
    });
    memberServiceMock.emailExists.mockResolvedValue(false);
    const teamId = Id.init();
    const pairId = Id.init();
    const team = new Team({
      id: teamId,
      name: new TeamName(1),
      pairs: [
        new Pair({
          id: pairId,
          name: new PairName('a'),
          memberIds: [],
        }),
      ],
    });
    teamRepositoryMock.findById.mockResolvedValue(team);
    memberRepositoryMock.add.mockResolvedValue(undefined);
    teamRepositoryMock.update.mockResolvedValue(undefined);
    const memberId = Id.init();
    const input = {
      id: memberId,
      name: 'John Doe',
      email: 'john.doe@example.com',
      assignedTasks: [],
    };
    const expectedMember = new Member({
      ...input,
      status: 'ACTIVE',
    });
    const expectedTeam = new Team({
      id: teamId,
      name: new TeamName(1),
      pairs: [
        new Pair({
          id: pairId,
          name: new PairName('a'),
          memberIds: [memberId],
        }),
      ],
    });

    await useCase.execute(teamId, input);

    expect(memberRepositoryMock.add).toHaveBeenCalledWith(expectedMember);
    expect(teamRepositoryMock.update).toHaveBeenCalledWith(expectedTeam);
  });
});
