import { Fragment } from 'react/jsx-runtime';
import type { TxnsSummary } from '../models/TxnsSummary';

const TxnsFooter = ({ txnsSummary }: { txnsSummary: TxnsSummary }) => (
  <Fragment>
    <div className="row fw-bold p1 mb-1 border-bottom border-dark">
      <div className="col text-end">Totals</div>
      <div className="col-2 text-end">{txnsSummary.totalCredit}</div>
      <div className="col-2 text-end">{txnsSummary.totalDebit}</div>
      <div className="col-2 text-center"></div>
    </div>
    <div className="row fw-bold p1 mb-1 border-bottom border-dark">
      <div className="col text-end">Balance</div>
      <div className="col-2 text-end"></div>
      <div className="col-2 text-end">{txnsSummary.balance}</div>
      <div className="col-2 text-center"></div>
    </div>
  </Fragment>
);

export default TxnsFooter;
