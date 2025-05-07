import React from "react";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

function Loading({
  message = "Loading...",
  fullPage = false,
  variant = "primary",
  size = "md",
  spinnerOnly = false,
  className = "",
}) {
  // Simple spinner-only version
  if (spinnerOnly) {
    return (
      <div className={`d-flex justify-content-center ${className}`}>
        <Spinner animation="border" role="status" variant={variant} size={size}>
          <span className="visually-hidden">{message}</span>
        </Spinner>
      </div>
    );
  }

  // Full page loading state
  if (fullPage) {
    return (
      <Container
        fluid
        className="vh-100 d-flex justify-content-center align-items-center"
      >
        <div className="text-center">
          <Spinner
            animation="border"
            role="status"
            variant={variant}
            size={size}
          >
            <span className="visually-hidden">Loading</span>
          </Spinner>
          {message && <p className="mt-3">{message}</p>}
        </div>
      </Container>
    );
  }

  // Default contained loading state
  return (
    <Container className={`py-4 text-center ${className}`}>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Spinner
            animation="border"
            role="status"
            variant={variant}
            size={size}
          >
            <span className="visually-hidden">Loading</span>
          </Spinner>
          {message && <p className="mt-3">{message}</p>}
        </Col>
      </Row>
    </Container>
  );
}

Loading.propTypes = {
  message: PropTypes.string,
  fullPage: PropTypes.bool,
  variant: PropTypes.string,
  size: PropTypes.string,
  spinnerOnly: PropTypes.bool,
  className: PropTypes.string,
};

export default Loading;
