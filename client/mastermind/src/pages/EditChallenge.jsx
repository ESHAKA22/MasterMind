import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ChallengeForm from "../components/challenges/ChallengeForm";
import {
  getChallengeById,
  updateChallenge,
} from "../services/challengeService";
import { toast } from "react-toastify";

function EditChallenge() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!id) {
        setError("No challenge ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getChallengeById(id);

        if (!response) {
          setError("Challenge not found");
          return;
        }

        setChallenge(response);
        setError(null);
      } catch (err) {
        console.error("Error fetching challenge:", err);
        setError(`Failed to load challenge: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  const handleSubmit = async (updatedData) => {
    try {
      setUpdating(true);

      // Preserve the enrolled users
      if (!updatedData.enrolledUsers && challenge?.enrolledUsers) {
        updatedData.enrolledUsers = challenge.enrolledUsers;
      }

      await updateChallenge(id, updatedData);
      toast.success("Challenge updated successfully!");
      navigate(`/challenges/${id}`);
    } catch (err) {
      console.error("Error updating challenge:", err);
      toast.error("Failed to update challenge. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading challenge details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button
          as={Link}
          to="/"
          variant="outline-primary"
          className="d-inline-flex align-items-center"
        >
          <FaArrowLeft className="me-2" /> Back to Challenges
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4 fade-in">
      <Row className="mb-4">
        <Col>
          <Button
            as={Link}
            to={`/challenges/${id}`}
            variant="outline-secondary"
            className="mb-3 d-inline-flex align-items-center"
          >
            <FaArrowLeft className="me-2" /> Back to Challenge
          </Button>
          <h1 className="page-title">Edit Challenge</h1>
        </Col>
      </Row>

      <Row>
        <Col>
          {challenge ? (
            <ChallengeForm
              challenge={challenge}
              onSubmit={handleSubmit}
              isLoading={updating}
              error={null}
            />
          ) : (
            <Alert variant="warning">Challenge data not available</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default EditChallenge;
