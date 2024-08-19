import { ClsService } from 'nestjs-cls';
import { TransactionManagerInterface } from '../domain/transaction-manager.interface';
import { PrismaService } from './prisma.service';
import { Inject } from '@nestjs/common';

export const PRISMA_TRANSACTION_TOKEN = 'prismaTransaction';
export type PrismaTransactionType = Parameters<
  Parameters<PrismaService['$transaction']>[0]
>[0];
export class PrismaTransactionManager implements TransactionManagerInterface {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    @Inject(ClsService)
    private readonly cls: ClsService,
  ) {}
  async execute(process: () => Promise<void>) {
    await this.prisma.$transaction(async (transaction) => {
      this.cls.set(PRISMA_TRANSACTION_TOKEN, transaction);
      await process();
    });
  }
}
