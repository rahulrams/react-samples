import { useState, type SubmitEvent, type ChangeEvent, type MouseEvent } from 'react';
import type { Customer } from '../models/Customer';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useForm, Controller } from "react-hook-form";

import { useDispatch } from "react-redux";

type CustomerFormProps = {
  customer?: Customer;
  save: (customer: Customer) => void;
  cancel: () => void;
};

const CustomerForm = ({ customer, save, cancel }: CustomerFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: customer
  })
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    save(data);
    cancel();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col className="p-2">
          <input {...register("name", { required: true })} />
          {errors.name && <span>Name is required</span>}
        </Col>

        <Col className="p-2">
          <input {...register("mobile", { required: true })} />
          {errors.mobile && <span>Mobile is required</span>}
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={6} className="p-2">
          <input {...register("mailID", { required: true })} />
          {errors.mailID && <span>Mail ID is required</span>}
        </Col>
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

export default CustomerForm;
