import type { Txn } from '../models/Txn';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import type { AppDispatch } from "../state/AppStore";
import { setEdit, deleteTxn } from "../../state/StatementsSlice";
import { useDispatch } from "react-redux";

type TxnRowProps = {
  accountId: number;
  txn: Txn;
  edit: (id: number) => void;
  remove: (id: number) => void;
};

const TxnRow = ({ accountId, txn }: TxnRowProps) => {
  const dispatch: AppDispatch = useDispatch();
  const edit = (id: number) => dispatch(setEdit(id));
  const remove = (txn: Txn) => {
    dispatch(deleteTxn(txn));
  };

  return (
    <Row className="p-1 mb-1 border-bottom align-items-center border-dark border-opacity-25">
      <Col xs={1} className="text-end">
        {txn.id}
      </Col>
      <Col xs={2} className="text-center">
        {txn.txnDate}
      </Col>
      <Col className="text-start">{txn.header}</Col>
      <Col xs={2} className="text-end">
        {txn.txnType == 'CREDIT' && txn.amount}
      </Col>
      <Col xs={2} className="text-end">
        {txn.txnType == 'DEBIT' && txn.amount}
      </Col>
      <Col xs={2} className="text-end">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={(_e) => edit(txn.id)}
        >
          <i className="bi bi-pen" title="EDIT" />
        </Button>
        <Button
          type="button"
          variant="danger"
          size="sm"
          className="ms-1"
          onClick={(_e) => remove(txn)}
        >
          <i className="bi bi-trash" title="Double click to delete" />
        </Button>
      </Col>
    </Row>
  )
};

export default TxnRow;
