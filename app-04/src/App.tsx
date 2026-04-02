import { Fragment } from 'react/jsx-runtime';
import Container from 'react-bootstrap/Container';
import Header from './components/Header';
import Statement from './components/Statement';

const App = () => (
  <Fragment>
    <Header appTitle="Budget Tracker" />
    <Container fluid>
      <Statement />
    </Container>
  </Fragment>
);

export default App;
