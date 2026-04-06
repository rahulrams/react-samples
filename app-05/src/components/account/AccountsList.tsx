import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import AccountHeader from "./AccountHeader";
import AccountRow from "./AccountRow";

type AccountsListProps = {
    customerId: number;
    accounts: Account[];
};

const AccountsList = ({ customerId, accounts }: AccountsListProps) => (
    <Col xs="12" md="10" className="mx-auto">
        <Row>
            <Col xs={12}>
                <AccountHeader customerId={customerId} />
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                {accounts &&
                    accounts.length > 0 &&
                    accounts.map((a) => <AccountRow key={a.id} customerId={customerId} account={a} />)
                }
            </Col>
        </Row>
    </Col>
);

export default AccountsList;