import Container from 'react-bootstrap/Container';

type HeaderProps = { appTitle: string };

const Header = ({ appTitle }: HeaderProps) => (
  <header>
    <Container fluid className="bg-dark py-2">
      <h1 className="text-center h2 text-light">{appTitle}</h1>
    </Container>
  </header>
);

export default Header;
