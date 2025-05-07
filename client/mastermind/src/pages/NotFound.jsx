import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHome, FaSearch } from "react-icons/fa";

function NotFound() {
  return (
    <Container className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="mb-4">
            <span className="display-1 fw-bold text-muted">404</span>
          </div>

          <h1 className="mb-4">Page Not Found</h1>

          <p className="lead mb-5">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <Button
              as={Link}
              to="/"
              variant="primary"
              size="lg"
              className="d-inline-flex align-items-center justify-content-center"
            >
              <FaHome className="me-2" /> Go Home
            </Button>

            <Button
              as={Link}
              to="/challenges"
              variant="outline-secondary"
              size="lg"
              className="d-inline-flex align-items-center justify-content-center"
            >
              <FaSearch className="me-2" /> Browse Challenges
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFound;
