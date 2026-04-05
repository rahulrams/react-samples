import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import AccountHeader from "./AccountHeader";
import AccountRow from "./AccountRow";

type AccountsListProps = {
    customerId: number;
    accounts: Account[];
};

const AccountsList = ({ customerId, accounts }: AccountsListProps) => (
    <>
        <Row className="px-5">
            <Col xs={12} className="bg-light text-dark">
                <AccountHeader customerId={customerId} />
            </Col>
        </Row>
        <Row className="px-5">
            <Col xs={12} className="bg-light text-dark">
                {accounts &&
                    accounts.length > 0 &&
                    accounts.map((a) => <AccountRow key={a.id} customerId={customerId} account={a} />)
                }
            </Col>
        </Row>
    </>
);

export default AccountsList;