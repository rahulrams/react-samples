import type { Account } from './Account';

export interface Customer {
  id: number;
  name: string;
  mobile: string;
  mailID: string;
  accounts: Account[];
}
