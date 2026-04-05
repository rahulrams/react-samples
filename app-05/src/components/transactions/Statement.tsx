import { useEffect } from "react";
import type { Txn } from '../models/Txn';
import TxnsHeader from './TxnsHeader';
import TxnRow from './TxnRow';
import TxnsFooter from './TxnsFooter';
import TxnForm from './TxnForm';

import Alert from 'react-bootstrap/Alert';

import type { RootState } from "../state/AppStore";
import { useSelector, useDispatch} from "react-redux";

import { useParams, Link } from "react-router-dom";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { loadTxns } from "../../state/StatementsSlice";

const Statement = () => {
  const txns: Txn[] = useSelector((state: RootState) => state.statementsSlice.txns);
  const dispatch: AppDispatch = useDispatch();
  const inProgress: boolean | undefined = useSelector((state: RootState) => state.statementsSlice.inProgress);
  const errMsg: string | undefined = useSelector((state: RootState) => state.statementsSlice.errMsg);

  const { accountId } = useParams();
  
  useEffect(()=> {
    dispatch(loadTxns(accountId));
  }, []);

  return (
    <Col as="section" sm={10} className="m-2 mx-auto p-2">
      <Row className="my-2">
        <Col xs="2" className="text-start align-items-center">
          <Link to={`/`}>Go back</Link>
        </Col>
        <Col xs="8" className="text-center align-items-center">
          <h3 className="text-center m-0">Statement</h3>
        </Col>
      </Row>
      <TxnsHeader />
      <TxnForm />
      {inProgress && <Alert variant="info">Please wait while loading</Alert>}
      {errMsg && <Alert variant={'danger'}><strong>{errMsg}</strong></Alert>}
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
