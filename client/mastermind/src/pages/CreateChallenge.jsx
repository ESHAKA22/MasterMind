import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ChallengeForm from "../components/challenges/ChallengeForm";
import { createChallenge } from "../services/challengeService";
import { toast } from "react-toastify";

function CreateChallenge() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (challengeData) => {
    try {
      setLoading(true);

      // Ensure enrolledUsers is initialized as an empty array
      if (!challengeData.enrolledUsers) {
        challengeData.enrolledUsers = [];
      }

      const newChallenge = await createChallenge(challengeData);
      toast.success("Challenge created successfully!");
      navigate(`/challenges/${newChallenge.id}`);
    } catch (err) {
      console.error("Error creating challenge:", err);
      setError("Failed to create challenge. Please try again.");
      toast.error("Failed to create challenge");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4 fade-in">
      <Row className="mb-4">
        <Col>
          <Button
            as={Link}
            to="/"
            variant="outline-secondary"
            className="mb-3 d-inline-flex align-items-center"
          >
            <FaArrowLeft className="me-2" /> Back to Challenges
          </Button>
          <h1 className="page-title">Create New Challenge</h1>
          <p className="text-muted">
            Design a new challenge to help yourself and others achieve goals and
            develop positive habits.
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          <ChallengeForm
            onSubmit={handleSubmit}
            isLoading={loading}
            error={error}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default CreateChallenge;
