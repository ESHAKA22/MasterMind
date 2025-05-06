import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Navbar() {
  // Professional color scheme
  const colors = {
    royalBlue: '#4169e1',
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">Courses Platform</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/courses">All Courses</Nav.Link>
            <Nav.Link as={Link} to="/instructor">Instructor Dashboard</Nav.Link>
          </Nav>
          <Nav>
            <Button 
              as={Link} 
              to="/add-course" 
              variant="primary" 
              size="sm" 
              className="ms-2"
              style={{
                backgroundColor: colors.royalBlue,
                borderColor: colors.royalBlue,
              }}
            >
              Create Course
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;