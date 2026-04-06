import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useDispatch } from "react-redux";

import { setEdit } from "../../state/AccountsSlice";

const AccountHeader = ({ customerId }) => {
    const dispatch: AppDispatch = useDispatch();
    return (
        <Row className="text-start fw-bold border-bottom border-dark align-items-center py-2 border-opacity-25">
            <Col xs={2}>ID</Col>
            <Col xs={2}>Type</Col>
            <Col xs={2}>Balance</Col>
            <Col xs={3}></Col>
            <Col xs={3} className="text-end">
                <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={(_e) => dispatch(setEdit({ customerId: customerId }))}
                >
                    <i className="bi bi-plus" title="EDIT" />
                </Button>
            </Col>
        </Row>
    )
};

export default AccountHeader;