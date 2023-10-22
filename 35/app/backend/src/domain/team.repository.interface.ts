import { Team } from './team';

export const TEAM_REPOSITORY_TOKEN = 'TeamRepository';

export interface TeamRepositoryInterface {
  findById(id: Team['value']['id']): Promise<Team>;
  update(team: Team): Promise<void>;
}
