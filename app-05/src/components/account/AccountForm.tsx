import { type MouseEvent } from 'react';
import type { Account } from '../models/Account';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useForm } from "react-hook-form";

type AccountFormProps = {
  account?: Account;
  save: (account: Account) => void;
  cancel: () => void;
};

const AccountForm = ({ account, save, cancel }: AccountFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Account>({
    defaultValues: account
  });
  const onSubmit: SubmitHandler<Account> = (data) => {
    save(data);
    cancel();
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col className="p-2">
          <Form.Control 
            type="text" 
            placeholder="Enter type"
            {...register("type", { required: "Type is required" })}
            isInvalid={!!errors.type}
          />
          <Form.Control.Feedback type="invalid">
            {errors.type?.message}
          </Form.Control.Feedback>
        </Col>

        <Col className="p-2">
        <Form.Control 
            type="number" 
            placeholder="Enter Balance"
            {...register("balance", { required: "Balance is required" })}
            isInvalid={!!errors.balance}
          />
          <Form.Control.Feedback type="invalid">
            {errors.balance?.message}
          </Form.Control.Feedback>
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
    </Form>
  )
};

export default AccountForm;
