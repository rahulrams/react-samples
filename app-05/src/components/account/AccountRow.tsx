import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";

import { setEdit, deleteAccount } from "../../state/AccountsSlice";

type AccountRowProps = {
    customerId: number;
    accounts: Account[];
};

const AccountRow = ({ account }: AccountRowProps) => {
    const dispatch: AppDispatch = useDispatch();

    return (
        <Row className="text-start bg-light border-bottom border-dark align-items-center py-2 border-opacity-25">
            <Col xs={2}>{account.id}</Col>
            <Col xs={2}>{account.type}</Col>
            <Col xs={2}>{account.balance}</Col>
            <Col xs={3}>
                <Link to={`/txns/${account.id}`}>Go to transactions</Link>
            </Col>
            <Col xs={3} className="text-end">
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={(_e) => dispatch(setEdit(account))}
                >
                    <i className="bi bi-pen" title="EDIT" />
                </Button>
                <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    className="ms-1"
                    onClick={(_e) => dispatch(deleteAccount(account.id))}
                >
                    <i className="bi bi-trash" title="Double click to delete" />
                </Button>
            </Col>
        </Row>
    )
};

export default AccountRow;