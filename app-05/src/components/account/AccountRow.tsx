import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const AccountRow = ({ account }) => (
    <Row className="text-start bg-light border-bottom border-dark align-items-center py-2 border-opacity-25">
        <Col xs={3}>{account.id}</Col>
        <Col xs={3}>{account.type}</Col>
        <Col xs={3}>{account.balance}</Col>
        <Col xs={3} className="text-end">
            <Button
                type="button"
                variant="secondary"
                size="sm"
            // onClick={(_e) => edit(customer.id)}
            >
                <i className="bi bi-pen" title="EDIT" />
            </Button>
            <Button
                type="button"
                variant="danger"
                size="sm"
                className="ms-1"
            // onClick={(_e) => remove(Customer.id)}
            >
                <i className="bi bi-trash" title="Double click to delete" />
            </Button>
        </Col>
    </Row>
);

export default AccountRow;