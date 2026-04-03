import { useState, useEffect } from "react";

import type { AppDispatch, RootState } from "../state/AppStore";
import type { Customer } from './models/Customer';

import { useSelector, useDispatch } from "react-redux";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import CustomerRow from "./customer/CustomerRow";
import CustomerForm from "./customer/CustomerForm";
import CustomerHeader from "./customer/CustomerHeader";
import { loadCustomers, updateCustomer, addCustomer, deleteCustomer } from "../state/CustomersSlice";

const CustomersList = () => {
  const dispatch: AppDispatch = useDispatch();
  const { customers, inProgress, errMsg } = useSelector((state: RootState) => state.customersSlice);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(null);

  const openEditCustomerModal = (customer: Customer) => {
    setEditMode(true);
    setSelectedCustomer(customer);
  };

  const openAddCustomerModal = () => {
    setEditMode(true);
    setSelectedCustomer(null);
  };

  const closeEdit = () => {
    setEditMode(false);
    setSelected(null);
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

  useEffect(() => {
    dispatch(loadCustomers());
  }, []);

  return (
    <>
      {inProgress && <Alert variant="info">Please wait while loading</Alert>}
      {errMsg && <Alert variant={'danger'}><strong>{errMsg}</strong></Alert>}
      <CustomerHeader />
      {customers &&
        customers.length > 0 &&
        customers.map((customer) => <CustomerRow key={customer.id} customer={customer} edit={openEditCustomerModal} remove={removeCustomer} />)
      }
      <Row>
        <Button variant="primary" className="w-auto" onClick={_e => openAddCustomerModal()}>
          <i className="bi bi-plus" />
        </Button>
      </Row>
      <Modal
        show={editMode}
        onHide={closeEdit}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomerForm customer={selectedCustomer} save={saveCustomer} cancel={closeEdit} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomersList;