import { useState, type SubmitEvent, type ChangeEvent, type MouseEvent } from 'react';
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

  const [validated, setValidated] = useState(false);

  const toggleType = (txnType: string) => {
    setTxn({ ...txn, txnType });
  };

  const formSubmitted = (event: SubmitEvent) => {
    const form = event.currentTarget as HTMLFormElement;

    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    if (form.checkValidity() === false) {
      return;
    }

    if (!txn.isEditable) {
      dispatch(addTxn(txn));
      setTxn({
        id: 0,
        header: '',
        txnDate: new Date().toISOString().substring(0, 10),
        txnType: 'CREDIT',
        amount: 0,
      });
      form.reset();
    }
    else {
      dispatch(updateTxn(txn));
    }
  };

  return (
    <Form
      className="p-1 mb-1 border-bottom border-info"
      onSubmit={formSubmitted}
      noValidate
      validated={validated}
    >
      <Row>
        <Col xs={1} className="text-end">
          {txn.id > 0 ? txn.id : ""}
        </Col>
        <Col xs={2} className="text-center">
          <Form.Group controlId={`txnDate-${txn.id}`}>
            <Form.Control
              type="date"
              value={txn.txnDate}
              required
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTxn({ ...txn, txnDate: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">Please provide a valid date.</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId={`header-${txn.id}`}>
            <Form.Control
              type="text"
              value={txn.header}
              required
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTxn({ ...txn, header: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">Please provide a valid title.</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col xs={2} className="text-end" onClick={(_e: MouseEvent<HTMLButtonElement>) => toggleType('CREDIT')}>
          {txn.txnType === 'CREDIT' && (
            <Form.Group controlId={`txnAmount-${txn.id}`}>
              <Form.Control
                type="number"
                value={txn.amount}
                min={1}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setTxn({ ...txn, amount: Number(e.target.value) })
                }
              />
              <Form.Control.Feedback type="invalid">Cannot be zero</Form.Control.Feedback>
            </Form.Group>
          )}
        </Col>
        <Col xs={2} className="text-end" onClick={(_e: MouseEvent<HTMLButtonElement>) => toggleType('DEBIT')}>
          {txn.txnType === 'DEBIT' && (
            <Form.Group controlId={`txnAmount-${txn.id}`}>
              <Form.Control
                type="number"
                value={txn.amount}
                min={1}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setTxn({ ...txn, amount: Number(e.target.value) })
                }
              />
              <Form.Control.Feedback type="invalid">Cannot be zero</Form.Control.Feedback>
            </Form.Group>
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
              onClick={(_e: MouseEvent<HTMLButtonElement>) => cancel(txn.id)}
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
