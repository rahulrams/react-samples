import { type MouseEvent } from 'react';
import type { Customer } from '../models/Customer';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useForm } from "react-hook-form";

type CustomerFormProps = {
  customer?: Customer;
  save: (customer: Customer) => void;
  cancel: () => void;
};

const CustomerForm = ({ customer, save, cancel }: CustomerFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Customer>({
    defaultValues: customer
  })
  const onSubmit: SubmitHandler<Customer> = (data) => {
    save(data);
    cancel();
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col className="p-2">
          <Form.Control 
            type="text" 
            placeholder="Enter name"
            {...register("name", { required: "Name is required" })}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name?.message}
          </Form.Control.Feedback>
        </Col>

        <Col className="p-2">
          <Form.Control 
            type="text" 
            placeholder="Enter mobile"
            {...register("mobile", { required: "Mobile is required" })}
            isInvalid={!!errors.mobile}
          />
          <Form.Control.Feedback type="invalid">
            {errors.mobile?.message}
          </Form.Control.Feedback>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={6} className="p-2">
          <Form.Control 
            type="email" 
            placeholder="Enter Mail ID"
            {...register("mailID", { 
              required: "Mail ID is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            isInvalid={!!errors.mailID}
          />
          <Form.Control.Feedback type="invalid">
            {errors.mailID?.message}
          </Form.Control.Feedback>
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
    </Form>
  )
};

export default CustomerForm;
