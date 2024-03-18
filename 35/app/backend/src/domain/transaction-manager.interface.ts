export const TRANSACTION_MANAGER_TOKEN = 'TransactionManager';
export interface TransactionManagerInterface {
  execute(process: () => Promise<void>): Promise<void>;
}
