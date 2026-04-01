import { useState, type SubmitEvent } from 'react';
import type { Txn } from '../models/Txn';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import type { AppDispatch } from "../state/AppStore";
import { addTxn, updateTxn, cancelEdit } from "../state/StatementsSlice";
import { useDispatch } from "react-redux";

type TxnFormProps = {
  t?: Txn;
};

const TxnForm = ({ t }: TxnFormProps) => {
  const dispatch: AppDispatch = useDispatch();
  const cancel = (id: number) => dispatch(cancelEdit(id));

  const [txn, setTxn] = useState<Txn>(
    t
      ? { ...t }
      : {
          id: 0,
          header: '',
          txnDate: new Date().toISOString().substring(0, 10),
          txnType: 'CREDIT',
          amount: 0,
        }
  );
  const toggleType = (txnType: string) => {
    setTxn({ ...txn, txnType });
  };

  const formSubmitted = (e: SubmitEvent) => {
    e.preventDefault();
    if (!txn.isEditable) {
      dispatch(addTxn(txn));
      setTxn({
        id: 0,
        header: '',
        txnDate: new Date().toISOString().substring(0, 10),
        txnType: 'CREDIT',
        amount: 0,
      });
    }
    else {
      dispatch(updateTxn(txn));
    }
  };

  return (
    <Form
      className="p-1 mb-1 border-bottom border-info"
      onSubmit={formSubmitted}
    >
      <Row>
        <Col xs={1} className="text-end">
          {txn.id}
        </Col>
        <Col xs={2} className="text-center">
          <Form.Control
            type="date"
            value={txn.txnDate}
            onChange={(e) => setTxn({ ...txn, txnDate: e.target.value })}
          />
        </Col>
        <Col>
          <Form.Control
            type="text"
            value={txn.header}
            onChange={(e) => setTxn({ ...txn, header: e.target.value })}
          />
        </Col>
        <Col xs={2} className="text-end" onClick={(_e) => toggleType('CREDIT')}>
          {txn.txnType === 'CREDIT' && (
            <Form.Control
              type="number"
              value={txn.amount}
              onChange={(e) =>
                setTxn({ ...txn, amount: Number(e.target.value) })
              }
            />
          )}
        </Col>
        <Col xs={2} className="text-end" onClick={(_e) => toggleType('DEBIT')}>
          {txn.txnType === 'DEBIT' && (
            <Form.Control
              type="number"
              value={txn.amount}
              onChange={(e) =>
                setTxn({ ...txn, amount: Number(e.target.value) })
              }
            />
          )}
        </Col>
        <Col xs={2} className="text-center">
          <Button variant="primary" size="sm" type="submit">
            <i className="bi bi-floppy" />
          </Button>
          {txn.isEditable && (
            <Button
              variant="danger"
              size="sm"
              className="ms-1"
              onClick={(_e) => cancel(txn.id)}
            >
              <i className="bi bi-x-circle" />
            </Button>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default TxnForm;
