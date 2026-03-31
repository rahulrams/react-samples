import { useEffect, useState } from 'react';
import type { Txn } from '../models/Txn';
import type { TxnsSummary } from '../models/TxnsSummary';
import TxnsHeader from './TxnsHeader';
import TxnRow from './TxnRow';
import TxnsFooter from './TxnsFooter';
import TxnForm from './TxnForm';
import { addTxn, delTxnById, getAllTxns, saveTxn } from '../service/txnsApi';

import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';

const Statement = () => {
  const [txns, setTxns] = useState<Txn[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [txnsSummary, setTxnsSummary] = useState<TxnsSummary>({
    totalCredit: 0,
    totalDebit: 0,
    balance: 0,
  });

  useEffect(() => {
    getAllTxns()
      .then((resp) => setTxns(resp.data))
      .catch((err) => {
        console.error(err);
        console.log('Cannot retrieve data');
      });
  }, []);

  useEffect(() => {
    if (txns && txns.length > 0) {
      const sumUp = (txns: Txn[], target: string) =>
        txns
          .filter((t) => t.txnType === target)
          .map((t) => t.amount)
          .reduce((num, sum) => sum + num);

      const tc = sumUp(txns, 'CREDIT');
      const td = sumUp(txns, 'DEBIT');
      setTxnsSummary({ totalCredit: tc, totalDebit: td, balance: tc - td });
    } else {
      setTxnsSummary({ totalCredit: 0, totalDebit: 0, balance: 0 });
    }
  }, [txns]);

  const add = (txn: Txn) => {
    addTxn(txn)
      .then((resp) => setTxns([...txns, { ...resp.data }]))
      .catch((err) => {
        console.error(err);
        console.log('Unable to save records. Try again later.');
      });
  };

  const update = (txn: Txn) => {
    txn.isEditable = undefined;
    saveTxn(txn.id, txn)
      .then((resp) =>
        setTxns(txns.map((tx) => (tx.id === txn.id ? { ...resp.data } : tx)))
      )
      .catch((err) => {
        console.error(err);
        console.log('Unable to save records. Try again later.');
      });
  };

  const remove = (id: number) => {
    delTxnById(id)
      .then((_resp) => setTxns(txns.map((tx) => tx.id !== id)))
      .catch((err) => {
        console.error(err);
        console.log('Unable to remove records. Try again later.');
      });
  };

  const edit = (id: number) =>
    setTxns(
      txns.map((tx) => (tx.id === id ? { ...tx, isEditable: true } : tx))
    );

  const cancelEdit = (id: number) =>
    setTxns(
      txns.map((tx) => (tx.id === id ? { ...tx, isEditable: undefined } : tx))
    );

  return (
    <Col as="section" sm={10} className="m-2 mx-auto p-2">
      <h3 className="text-center">Statement</h3>
      {errorMsg && (
        <Alert variant={'danger'} className="p-2">
          <strong>{errorMsg}</strong>
        </Alert>
      )}
      <TxnsHeader />
      <TxnForm save={add} />
      {txns &&
        txns.length > 0 &&
        txns.map((t) =>
          t.isEditable ? (
            <TxnForm key={t.id} t={t} save={update} cancel={cancelEdit} />
          ) : (
            <TxnRow key={t.id} txn={t} edit={edit} remove={remove} />
          )
        )}
      <TxnsFooter txnsSummary={txnsSummary} />
    </Col>
  );
};

export default Statement;
