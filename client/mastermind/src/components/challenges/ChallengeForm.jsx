import { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { FaSave, FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";

// Sample category and difficulty options
const CATEGORIES = [
  "JS",
  "PHP",
  "Python",
  "HTML/CSS",
  "MERN",
  "WordPress",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

function ChallengeForm({ challenge, onSubmit, isLoading, error }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
    difficulty: "",
    repeatCount: 1,
    enrolledUsers: [],
  });

  const [validated, setValidated] = useState(false);

  // Initialize form with challenge data if editing
  useEffect(() => {
    if (challenge) {
      setFormData({
        title: challenge.title || "",
        description: challenge.description || "",
        imageUrl: challenge.imageUrl || "",
        category: challenge.category || "",
        difficulty: challenge.difficulty || "",
        repeatCount: challenge.repeatCount || 1,
        enrolledUsers: challenge.enrolledUsers || [],
      });
    }
  }, [challenge]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle number inputs
    if (name === "repeatCount") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value, 10) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    onSubmit(formData);
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter challenge title"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a title.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Image URL (optional)"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the challenge"
            />
            <Form.Control.Feedback type="invalid">
              Please provide a description.
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a category.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Difficulty</Form.Label>
                <Form.Select
                  required
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                >
                  <option value="">Select Difficulty</option>
                  {DIFFICULTIES.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a difficulty level.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Repeat Count</Form.Label>
                <Form.Control
                  required
                  type="number"
                  min="1"
                  name="repeatCount"
                  value={formData.repeatCount}
                  onChange={handleChange}
                  placeholder="How many times to repeat"
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid repeat count.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-3">
            <Button
              variant="outline-secondary"
              className="me-2 d-flex align-items-center"
              type="button"
              as="a"
              href="/"
            >
              <FaTimes className="me-2" /> Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
              className="d-flex align-items-center"
            >
              <FaSave className="me-2" /> {challenge ? "Update" : "Create"}{" "}
              Challenge
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

ChallengeForm.propTypes = {
  challenge: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
};

ChallengeForm.defaultProps = {
  challenge: null,
  isLoading: false,
  error: null,
};

export default ChallengeForm;
