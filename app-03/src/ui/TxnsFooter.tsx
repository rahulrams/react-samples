import { Fragment } from 'react/jsx-runtime';
import type { TxnsSummary } from '../models/TxnsSummary';

import type { AppDispatch, RootState } from "../state/AppStore";
import { useSelector } from "react-redux";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const TxnsFooter = () => {
  const txnsSummary: TxnsSummary = useSelector((state: RootState) => state.statementsSlice.summary);
  return (
    <Fragment>
      <Row className="fw-bold p1 mb-1 border-bottom border-dark">
        <Col className="text-end">Totals</Col>
        <Col xs={2} className="text-end">
          {txnsSummary.totalCredit}
        </Col>
        <Col xs={2} className="text-end">
          {txnsSummary.totalDebit}
        </Col>
        <Col xs={2} className="text-center"></Col>
      </Row>
      <Row className="fw-bold p1 mb-1 border-bottom border-dark">
        <Col className="text-end">Balance</Col>
        <Col xs={2} className="text-end"></Col>
        <Col xs={2} className="text-end">
          {txnsSummary.balance}
        </Col>
        <Col xs={2} className="text-center"></Col>
      </Row>
    </Fragment>)
};

export default TxnsFooter;
