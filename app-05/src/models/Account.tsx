import type { Txn } from './Txn';

export interface Account {
  id: number;
  type: string;
  balance: number;
  customerId: number;
}
