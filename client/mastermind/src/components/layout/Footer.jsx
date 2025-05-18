import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-4 mt-auto border-top">
      <Container>
        <Row className="align-items-center justify-content-between">
          <Col md={6} className="text-md-start text-center mb-3 mb-md-0">
            <span className="text-muted">
              © {currentYear} Challenge App. All rights reserved.
            </span>
          </Col>
          <Col md={6} className="text-md-end text-center">
            <div className="d-flex justify-content-md-end justify-content-center">
              <Link to="#" className="text-dark mx-2">
                <FaFacebook size={20} />
              </Link>
              <Link to="#" className="text-dark mx-2">
                <FaTwitter size={20} />
              </Link>
              <Link to="#" className="text-dark mx-2">
                <FaInstagram size={20} />
              </Link>
              <Link to="#" className="text-dark mx-2">
                <FaLinkedin size={20} />
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
