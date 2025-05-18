import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
  FaArrowUp,
} from "react-icons/fa";
import { useState, useEffect } from "react";

function Footer() {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show scroll to top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-white py-5 mt-auto border-top">
      <Container>
        {/* Main Footer Content */}
        <Row className="mb-4">
          {/* Company Info */}
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <h5 className="text-dark mb-3">Challenge App</h5>
            <p className="text-muted mb-3">
              Empowering individuals to achieve their goals through engaging
              challenges and community support. Join thousands of users on their
              journey to success.
            </p>
            {/* Contact Info */}
            <div className="contact-info">
              <div className="d-flex align-items-center mb-2">
                <FaEnvelope className="text-muted me-2" />
                <a
                  href="mailto:support@challengeapp.com"
                  className="text-decoration-none text-muted"
                >
                  support@challengeapp.com
                </a>
              </div>
              <div className="d-flex align-items-center mb-2">
                <FaPhone className="text-muted me-2" />
                <a
                  href="tel:+1234567890"
                  className="text-decoration-none text-muted"
                >
                  +1 (234) 567-890
                </a>
              </div>
              <div className="d-flex align-items-center">
                <FaMapMarkerAlt className="text-muted me-2" />
                <span className="text-muted">New York, NY 10001</span>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h6 className="text-dark mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/challenges"
                  className="text-decoration-none text-muted footer-link"
                >
                  Browse Challenges
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/leaderboard"
                  className="text-decoration-none text-muted footer-link"
                >
                  Leaderboard
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/community"
                  className="text-decoration-none text-muted footer-link"
                >
                  Community
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/create-challenge"
                  className="text-decoration-none text-muted footer-link"
                >
                  Create Challenge
                </Link>
              </li>
            </ul>
          </Col>

          {/* Support */}
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h6 className="text-dark mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/help"
                  className="text-decoration-none text-muted footer-link"
                >
                  Help Center
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/contact"
                  className="text-decoration-none text-muted footer-link"
                >
                  Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/faq"
                  className="text-decoration-none text-muted footer-link"
                >
                  FAQ
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/feedback"
                  className="text-decoration-none text-muted footer-link"
                >
                  Feedback
                </Link>
              </li>
            </ul>
          </Col>

          {/* Legal */}
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h6 className="text-dark mb-3">Legal</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/privacy"
                  className="text-decoration-none text-muted footer-link"
                >
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/terms"
                  className="text-decoration-none text-muted footer-link"
                >
                  Terms of Service
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/cookies"
                  className="text-decoration-none text-muted footer-link"
                >
                  Cookie Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/accessibility"
                  className="text-decoration-none text-muted footer-link"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </Col>

          {/* Newsletter */}
          <Col lg={2} md={6}>
            <h6 className="text-dark mb-3">Stay Updated</h6>
            <p className="text-muted small mb-3">
              Subscribe to our newsletter for updates and challenges.
            </p>
            <form className="newsletter-form">
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control form-control-sm"
                  placeholder="Your email"
                  aria-label="Email"
                />
                <button className="btn btn-primary btn-sm" type="submit">
                  Subscribe
                </button>
              </div>
            </form>
          </Col>
        </Row>

        <hr className="my-4" />

        {/* Bottom Footer */}
        <Row className="align-items-center">
          <Col md={6} className="text-md-start text-center mb-3 mb-md-0">
            <span className="text-muted">
              © {currentYear} Challenge App. Made with{" "}
              <FaHeart className="text-danger" size={14} /> for challengers
              worldwide.
            </span>
          </Col>
          <Col md={6} className="text-md-end text-center">
            {/* Social Media Links */}
            <div className="social-links">
              <a
                href="https://facebook.com/challengeapp"
                className="text-dark mx-2 social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebook size={22} />
              </a>
              <a
                href="https://twitter.com/challengeapp"
                className="text-dark mx-2 social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter size={22} />
              </a>
              <a
                href="https://instagram.com/challengeapp"
                className="text-dark mx-2 social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="https://linkedin.com/company/challengeapp"
                className="text-dark mx-2 social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={22} />
              </a>
            </div>
          </Col>
        </Row>

        {/* Back to top button */}
        {showScrollTop && (
          <button
            className="btn btn-primary position-fixed"
            style={{
              bottom: "30px",
              right: "30px",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              zIndex: 1000,
              border: "none",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <FaArrowUp />
          </button>
        )}
      </Container>

      {/* Custom CSS */}
      <style jsx>{`
        .footer-link:hover {
          color: #007bff !important;
          transition: color 0.3s ease;
        }

        .social-link:hover {
          color: #007bff !important;
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }

        .newsletter-form .btn:hover {
          transform: scale(1.05);
          transition: transform 0.2s ease;
        }

        .contact-info a:hover {
          color: #007bff !important;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
