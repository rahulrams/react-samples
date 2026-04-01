import type { Txn } from '../models/Txn';
import TxnsHeader from './TxnsHeader';
import TxnRow from './TxnRow';
import TxnsFooter from './TxnsFooter';
import TxnForm from './TxnForm';

import type { RootState } from "../state/AppStore";
import { useSelector } from "react-redux";

import Col from 'react-bootstrap/Col';

const Statement = () => {
  const txns: Txn[] = useSelector((state: RootState) => state.statementsSlice.txns);
  
  return (
    <Col as="section" sm={10} className="m-2 mx-auto p-2">
      <h3 className="text-center">Statement</h3>
      <TxnsHeader />
      <TxnForm />
      {txns &&
        txns.length > 0 &&
        txns.map((t) =>
          t.isEditable ? (
            <TxnForm key={t.id} t={t} />
          ) : (
            <TxnRow key={t.id} txn={t} />
          )
        )}
      <TxnsFooter />
    </Col>
  );
};

export default Statement;
