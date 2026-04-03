import { Fragment } from 'react/jsx-runtime';
import Container from 'react-bootstrap/Container';
import Header from './components/Header';
import CustomersList from './components/CustomersList';

const App = () => (
  <Fragment>
    <Header appTitle="Budget Tracker" />
    <Container fluid>
      <CustomersList />
    </Container>
  </Fragment>
);

export default App;
