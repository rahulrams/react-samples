export interface Txn {
  id: number;
  header: string;
  txnDate: string;
  txnType: string;
  amount: number;
  accountId: number;
  isEditable?: boolean;
}
