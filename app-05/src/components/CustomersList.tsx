import { useState, useEffect } from "react";

import type { AppDispatch, RootState } from "../state/AppStore";
import type { Customer } from './models/Customer';
import type { Account } from './models/Account';

import { useSelector, useDispatch } from "react-redux";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import CustomerRow from "./customer/CustomerRow";
import CustomerForm from "./customer/CustomerForm";

import AccountForm from "./account/AccountForm";

import CustomerHeader from "./customer/CustomerHeader";
import { 
  loadCustomers, 
  updateCustomer, 
  addCustomer, 
  deleteCustomer, 
  setAdd as setAddCustomer,
  setEdit as setEditCustomer,
  cancelEdit as cancelEditCustomer,
} from "../state/CustomersSlice";
import {
  loadAccounts,
  updateAccount, 
  addAccount, 
  setAdd as setAddAccount,
  cancelEdit as cancelEditAccount
} from "../state/AccountsSlice";

const CustomersList = () => {
  const dispatch: AppDispatch = useDispatch();
  const { 
    customers, 
    inProgress, 
    errMsg, 
    editMode: customerEditMode, 
    selected: selectedCustomer
  } = useSelector((state: RootState) => state.customersSlice);

  const { 
    editMode: accountEditMode,
    selected: selectedAccount
  } = useSelector((state: RootState) => state.accountsSlice);

  const openEditCustomerModal = (customer: Customer) => {
    dispatch(setEditCustomer(customer));
  };

  const openAddCustomerModal = () => {
    dispatch(setAddCustomer());
  };

  const closeCustomerEdit = () => {
    dispatch(cancelEditCustomer());
  };

  const closeAccountEdit = () => {
    dispatch(cancelEditAccount());
  };

  const removeCustomer = (customerID: number) => {
    dispatch(deleteCustomer(customerID));
  }

  const saveCustomer = (data: Customer) => {
    if (data.id) {
      dispatch(updateCustomer(data));
    }
    else {
      dispatch(addCustomer(data));
    }
  }

  const saveAccount = (data: Account) => {
    if (data.id) {
      dispatch(updateAccount(data));
    }
    else {
      dispatch(addAccount(data));
    }
  }

  useEffect(() => {
    dispatch(loadCustomers());
    dispatch(loadAccounts());
  }, []);

  return (
    <Container fluid>
      {inProgress && <Alert variant="info">Please wait while loading</Alert>}
      {errMsg && <Alert variant={'danger'}><strong>{errMsg}</strong></Alert>}
      <CustomerHeader open={openAddCustomerModal} />
      {customers &&
        customers.length > 0 &&
        customers.map((customer: Customer) => <CustomerRow key={customer.id} customer={customer} edit={openEditCustomerModal} remove={removeCustomer} />)
      }
      <Modal
        show={customerEditMode}
        onHide={closeCustomerEdit}
        backdrop="static"
        keyboard={false}
        data-bs-theme="light"
      >
        <Modal.Body>
          <CustomerForm customer={selectedCustomer} save={saveCustomer} cancel={closeCustomerEdit} />
        </Modal.Body>
      </Modal>
      <Modal
        show={accountEditMode}
        onHide={closeAccountEdit}
        backdrop="static"
        keyboard={false}
        data-bs-theme="light"
      >
        <Modal.Header closeButton>
          <Modal.Title>Save account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AccountForm account={selectedAccount} save={saveAccount} cancel={closeAccountEdit} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CustomersList;