import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaExclamationTriangle } from "react-icons/fa";

function NotFound() {
  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8} xl={6} className="text-center">
          <div className="mb-3">
            <FaExclamationTriangle
              className="text-warning"
              style={{ fontSize: "3rem" }}
            />
          </div>
          <h1 className="display-1 fw-bold text-muted mb-0">404</h1>
          <h2 className="display-6 fw-bold mb-3">Page Not Found</h2>

          <div
            className="mx-auto bg-primary mb-4"
            style={{ height: "4px", width: "60px", borderRadius: "2px" }}
          ></div>

          <p className="lead mb-5">
            Oops! The page you're looking for doesn't exist or might have been
            moved.
          </p>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mb-4">
            <Button
              as={Link}
              to="/"
              variant="primary"
              size="lg"
              className="d-inline-flex align-items-center justify-content-center"
            >
              <FaHome className="me-2" /> Return Home
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

          <div className="mt-4 text-muted">
            <p>
              Need help?{" "}
              <Link to="/contact" className="text-decoration-none">
                Contact Support
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFound;
