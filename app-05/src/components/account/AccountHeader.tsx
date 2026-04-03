import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const AccountHeader = ({ account }) => (
    <Row className="text-start bg-light border-top border-bottom border-dark align-items-center py-2 border-opacity-25">
        <Col xs={3}>ID</Col>
        <Col xs={3}>Type</Col>
        <Col xs={3}>Balance</Col>
        <Col xs={3} className="text-right"></Col>
    </Row>
);

export default AccountHeader;