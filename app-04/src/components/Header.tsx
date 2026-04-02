import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

type HeaderProps = { appTitle: string };

const Header = ({ appTitle }: HeaderProps) => (
  <Navbar expand="sm" bg="dark" data-bs-theme="dark">
    <Container fluid>
      <Navbar.Brand href="#">{appTitle}</Navbar.Brand>
    </Container>
  </Navbar>
);

export default Header;
