import { useState } from "react";

import type { Customer } from '../../models/Customer';
import AccountsList from "../account/AccountsList";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

type CustomerRowProps = {
    customer: Customer;
    edit: (customer: Customer) => void;
    remove: (id: number) => void;
};

const CustomerRow = ({ customer, edit, remove }: CustomerRowProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Row className="py-2 text-start align-items-center">
                <Col xs={1}>
                <Button onClick={() => setOpen(!open)} aria-expanded={open} variant="link">
                    <i className={`text-dark bi ${open?'bi-caret-up-fill':'bi-caret-down-fill'}`} />
                </Button>
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
                        onClick={_e => edit(customer)}
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
            <Collapse in={open}>
                <Row className="text-left">
                    <AccountsList accounts={customer.accounts} />
                </Row>
            </Collapse>
        </>
    );
};

export default CustomerRow;
