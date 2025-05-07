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
      try {
        setLoading(true);
        const data = await getChallengeById(id);
        setChallenge(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching challenge:", err);
        setError("Failed to load challenge. The challenge may not exist.");
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
      navigate("/admin/challenges");
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
        <p className="mt-3">Loading challenge...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button
          as={Link}
          to="/admin/challenges"
          variant="outline-primary"
          className="d-inline-flex align-items-center"
        >
          <FaArrowLeft className="me-2" /> Back to Challenges
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <Button
            as={Link}
            to="/admin/challenges"
            variant="outline-secondary"
            className="d-inline-flex align-items-center"
          >
            <FaArrowLeft className="me-2" /> Back to Challenges
          </Button>
          <h1 className="mt-3">Edit Challenge</h1>
        </Col>
      </Row>

      <Row>
        <Col>
          {challenge ? (
            <ChallengeForm
              initialData={challenge}
              onSubmit={handleSubmit}
              isSubmitting={updating}
              mode="edit"
            />
          ) : (
            <Alert variant="warning">Challenge not found</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default EditChallenge;
