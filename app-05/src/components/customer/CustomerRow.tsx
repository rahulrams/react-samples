import { useState } from "react";
import type { RootState } from "../state/AppStore";

import type { Customer } from '../../models/Customer';
import AccountsList from "../account/AccountsList";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Accordion from 'react-bootstrap/Accordion';

import { useSelector } from "react-redux";

type CustomerRowProps = {
    customer: Customer;
    edit: (customer: Customer) => void;
    remove: (id: number) => void;
};

const CustomerRow = ({ customer, edit, remove }: CustomerRowProps) => {
    const accounts = useSelector((state: RootState) => state.accountsSlice.accounts);

    return (
        <Row>
            <Accordion.Item eventKey={customer.id}>
                <Row className="text-start align-items-center">
                    <Col xs={1}>
                        <Accordion.Header></Accordion.Header>
                    </Col>
                    <Col xs={1}>{customer.id}</Col>
                    <Col xs={3}>{customer.name}</Col>
                    <Col xs={2}>{customer.mobile}</Col>
                    <Col xs={3}>{customer.mailID}</Col>
                    <Col xs={2} className="text-end">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={(_e) => edit(customer)}
                        >
                            <i className="bi bi-pen" title="EDIT" />
                        </Button>
                        <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            className="ms-1"
                            onClick={(_e) => remove(customer.id)}
                        >
                            <i className="bi bi-trash" title="Double click to delete" />
                        </Button>
                    </Col>
                </Row>
                <Accordion.Body>
                    <Row className="text-left border-top border-bottom border-primary bg-light text-dark">
                        <AccountsList customerId={customer.id} accounts={accounts} />
                    </Row>
                </Accordion.Body>
            </Accordion.Item>
        </Row>
    );
};

export default CustomerRow;
