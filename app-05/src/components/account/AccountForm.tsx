import { useState, type SubmitEvent, type ChangeEvent, type MouseEvent } from 'react';
import type { Account } from '../models/Account';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useForm, Controller } from "react-hook-form";

import { useDispatch } from "react-redux";

type AccountFormProps = {
  account?: Account;
  save: (account: Account) => void;
  cancel: () => void;
};

const AccountForm = ({ account, save, cancel }: AccountFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: account
  })
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    save(data);
    cancel();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col className="p-2">
          <input {...register("type", { required: true })} />
          {errors.type && <span>Type is required</span>}
        </Col>

        <Col className="p-2">
          <input {...register("balance", { required: true })} />
          {errors.balance && <span>Balance is required</span>}
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="p-2 text-center">
          <Button type="submit" variant="primary" size="sm" title="Save">
            <i className="bi bi-floppy" />
          </Button>
          <Button className="ms-2" variant="danger" size="sm" onClick={(_e: MouseEvent<HTMLButtonElement>) => cancel()}>
            <i className="bi bi-x-circle" />
          </Button>
        </Col>
      </Row>
    </form>
  )
};

export default AccountForm;
