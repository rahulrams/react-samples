import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import AccountHeader from "./AccountHeader";
import AccountRow from "./AccountRow";

const AccountsList = ({ accounts }) => (
    <>
        <Row className="px-5">
            <Col xs={12} className="bg-light text-dark">
                <AccountHeader />
            </Col>
        </Row>
        <Row className="px-5">
            <Col xs={12} className="bg-light text-dark">
                {accounts &&
                    accounts.length > 0 &&
                    accounts.map((a) => <AccountRow key={a.id} account={a} />)
                }
            </Col>
        </Row>
    </>
);

export default AccountsList;