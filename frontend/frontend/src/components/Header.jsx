import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav, Button, Image, Dropdown } from 'react-bootstrap';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm border-bottom border-primary-subtle">
      <Container>
        {/* Logo Section */}
        <Navbar.Brand as={Link} to="/">
          <div className="d-flex align-items-center">
            <div className="bg-primary rounded d-flex align-items-center justify-content-center" style={{width: "40px", height: "40px"}}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
                width="24" 
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <span className="text-primary fw-bold ms-2 fs-4">MasterMind</span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setIsOpen(!isOpen)} />
        
        <Navbar.Collapse id="basic-navbar-nav" className={isOpen ? 'show' : ''}>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="px-3 py-2 mx-1 text-secondary fw-medium border-bottom border-white border-2 hover-border-primary">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/courses" className="px-3 py-2 mx-1 text-secondary fw-medium border-bottom border-white border-2 hover-border-primary">Courses</Nav.Link>
            <Nav.Link as={Link} to="/" className="px-3 py-2 mx-1 text-secondary fw-medium border-bottom border-white border-2 hover-border-primary">Analytics</Nav.Link>
            <Nav.Link as={Link} to="/" className="px-3 py-2 mx-1 text-secondary fw-medium border-bottom border-white border-2 hover-border-primary">Reports</Nav.Link>
          </Nav>
          
          {/* User Profile Dropdown */}
          <Dropdown>
            <Dropdown.Toggle as="div" className="d-flex align-items-center cursor-pointer" style={{cursor: 'pointer'}}>
              <div className="d-flex align-items-center">
                <div className="d-none d-md-flex flex-column align-items-end text-end me-2">
                  <span className="fw-medium text-dark small">User Name</span>
                  <span className="text-muted smaller">user@gmail.com</span>
                </div>
                <Image 
                  src="https://via.placeholder.com/40" 
                  className="border border-2 border-primary-subtle"
                  roundedCircle 
                  width={40} 
                  height={40} 
                  alt="User avatar" 
                />
                <svg
                  className={`ms-2 text-secondary ${isOpen ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" className="mt-2 shadow-sm">
              <Dropdown.Item as={Link} to="/" className="px-4 py-2">Your Profile</Dropdown.Item>
              <Dropdown.Item as={Link} to="/" className="px-4 py-2">Settings</Dropdown.Item>
              <Dropdown.Item as={Link} to="/" className="px-4 py-2">Sign out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}