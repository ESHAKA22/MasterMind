import { useState } from "react";
import {
  Navbar,
  Container,
  Nav,
  Button,
  Form,
  FormControl,
} from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";

function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <span className="me-2">🏆</span>
          Challenge App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/my-challenges">
              My Challenges
            </Nav.Link>
          </Nav>

          <Form className="d-flex mx-lg-4 my-2 my-lg-0" onSubmit={handleSearch}>
            <div className="position-relative d-flex">
              <FormControl
                type="search"
                placeholder="Search challenges..."
                className="me-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="outline-primary"
                className="d-flex align-items-center"
                type="submit"
              >
                <FaSearch />
              </Button>
            </div>
          </Form>

          <Button
            as={Link}
            to="/challenges/create"
            variant="primary"
            className="d-flex align-items-center"
          >
            <FaPlus className="me-2" /> Create Challenge
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
