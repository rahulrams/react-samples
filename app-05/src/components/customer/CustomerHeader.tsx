import type { Customer } from '../../models/Customer';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

type CustomerRowProps = {
    customer: Customer;
    open: () => void;
};

const CustomerRow = ({ customer, open }: CustomerRowProps) =>
(
    <Row className="py-2 bg-dark text-white fw-bold text-start" >
        <Col xs={1}></Col>
        <Col xs={1}>ID</Col>
        <Col xs={3}>Name</Col>
        <Col xs={2}>Mobile</Col>
        <Col xs={3}>Mail ID</Col>
        <Col xs={2} className="text-end">
            <Button variant="primary" size="sm" className="w-auto" title="Add Customer" onClick={_e => open()}>
                <i className="bi bi-plus" />
            </Button>
        </Col>
    </Row>
);

export default CustomerRow;
