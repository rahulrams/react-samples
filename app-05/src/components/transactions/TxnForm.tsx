import { useState, type SubmitEvent, type ChangeEvent, type MouseEvent } from 'react';
import type { Txn } from '../models/Txn';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import type { AppDispatch } from "../state/AppStore";
import { addTxn, updateTxn, cancelEdit } from "../../state/StatementsSlice";
import { useDispatch } from "react-redux";

import { useForm } from "react-hook-form";

type TxnFormProps = {
  accountId: Number;
  t?: Txn;
};

const TxnForm = ({ accountId, t }: TxnFormProps) => {
  const {
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Txn>({
    defaultValues: t 
    ? { ...t }
    : {
      header: '',
      txnDate: new Date().toISOString().substring(0, 10),
      txnType: 'CREDIT',
      amount: 0,
      accountId: accountId
    }
  });
  const txnType = watch("txnType");
  const onSubmit: SubmitHandler<Txn> = (txn) => {
    if (!getValues("isEditable")) {
      dispatch(addTxn(txn));
      reset({}, { keepDefaultValues: true });
    }
    else {
      dispatch(updateTxn(txn));
    }
  }
  const dispatch: AppDispatch = useDispatch();
  const cancel = () => dispatch(cancelEdit(getValues("id")));

  return (
    <Form 
      onSubmit={handleSubmit(onSubmit)}
      className=""
    >
      <Row className="border-bottom border-info p-2 text-center">
        <Col xs={1} className="text-end">
          {getValues("id") || ""}
        </Col>
        <Col xs={2} className="text-center">
          <Form.Group>
            <Form.Control
              type="date"
              {...register("txnDate", { 
                required: "Date is required"
              })}
              isInvalid={!!errors.txnDate}
            />
            <Form.Control.Feedback type="invalid">{errors.txnDate?.message}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Control
              type="text"
              {...register("header", { required: "Header is required" })}
              isInvalid={!!errors.header}
            />
            <Form.Control.Feedback type="invalid">{errors.header?.message}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col xs={2} className="text-end" onClick={(_e: MouseEvent<HTMLButtonElement>) => setValue('txnType', 'CREDIT')}>
          {txnType === 'CREDIT' && (
            <Form.Group>
              <Form.Control
                type="number"
                {...register("amount", { 
                  required: "Amount is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Cannot be zero" }
                })}
                isInvalid={!!errors.amount}
              />
              <Form.Control.Feedback type="invalid">{errors.amount?.message}</Form.Control.Feedback>
            </Form.Group>
          )}
        </Col>
        <Col xs={2} className="text-end" onClick={(_e: MouseEvent<HTMLButtonElement>) => setValue('txnType', 'DEBIT')}>
          {txnType === 'DEBIT' && (
            <Form.Group>
              <Form.Control
                type="number"
                {...register("amount", { 
                  required: "Amount is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Cannot be zero" }
                })}
                isInvalid={!!errors.amount}
              />
              <Form.Control.Feedback type="invalid">{errors.amount?.message}</Form.Control.Feedback>
            </Form.Group>
          )}
        </Col>
        <Col xs={2} className="text-end">
          <Button variant="primary" size="sm" type="submit">
            <i className="bi bi-floppy" />
          </Button>
          {getValues("isEditable") && (
            <Button
              variant="danger"
              size="sm"
              className="ms-1"
              onClick={(_e: MouseEvent<HTMLButtonElement>) => cancel()}
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
