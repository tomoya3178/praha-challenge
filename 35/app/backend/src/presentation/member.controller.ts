import { Body, Controller, Post } from '@nestjs/common';
import { AddMemberUseCase } from 'src/application/add-member.use-case';
import { Id } from 'src/domain/id';
import { Member } from 'src/domain/member';

@Controller('members')
export class MemberController {
  constructor(private readonly addMemberUseCase: AddMemberUseCase) {}
  @Post()
  async add(
    @Body()
    request: {
      id: Member['value']['id']['value'];
      name: Member['value']['name'];
      email: Member['value']['email'];
    },
  ): Promise<void> {
    await this.addMemberUseCase.execute({
      ...request,
      id: new Id(request.id),
    });
  }
}
