import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  FaEdit,
  FaTrash,
  FaUsers,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import {
  getChallengeById,
  deleteChallenge,
  enrollUserInChallenge,
} from "../services/challengeService";
import { toast } from "react-toastify";

function ChallengeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  // Mock user ID (in a real app, this would come from auth context)
  const currentUserId = "user123";

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        const data = await getChallengeById(id);
        setChallenge(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching challenge details:", err);
        setError(
          "Failed to load challenge details. The challenge may not exist."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this challenge?")) {
      try {
        await deleteChallenge(id);
        toast.success("Challenge deleted successfully");
        navigate("/");
      } catch (err) {
        console.error("Error deleting challenge:", err);
        toast.error("Failed to delete challenge");
      }
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await enrollUserInChallenge(id, currentUserId);

      // Update local state to reflect enrollment
      setChallenge((prev) => ({
        ...prev,
        enrolledUsers: [...(prev.enrolledUsers || []), currentUserId],
      }));

      toast.success("Successfully enrolled in challenge!");
    } catch (err) {
      console.error("Error enrolling in challenge:", err);
      toast.error("Failed to enroll in challenge");
    } finally {
      setEnrolling(false);
    }
  };

  const isUserEnrolled = challenge?.enrolledUsers?.includes(currentUserId);

  // Determine badge color based on difficulty
  const getBadgeVariant = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "danger";
      default:
        return "info";
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading challenge details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" as={Link} to="/">
              Go Back
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!challenge) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Challenge Not Found</Alert.Heading>
          <p>The challenge you're looking for doesn't exist.</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="outline-warning" as={Link} to="/">
              Go Back
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

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
          <h1 className="page-title">{challenge.title}</h1>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="mb-4 border-0 shadow-sm">
            {challenge.imageUrl && (
              <div style={{ height: "300px", overflow: "hidden" }}>
                <Card.Img
                  variant="top"
                  src={challenge.imageUrl}
                  alt={challenge.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <Badge
                    bg={getBadgeVariant(challenge.difficulty)}
                    className="me-2"
                  >
                    {challenge.difficulty}
                  </Badge>
                  <Badge bg="secondary">{challenge.category}</Badge>
                </div>
                <div className="d-flex">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2 d-flex align-items-center"
                    as={Link}
                    to={`/challenges/${id}/edit`}
                  >
                    <FaEdit className="me-1" /> Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="d-flex align-items-center"
                    onClick={handleDelete}
                  >
                    <FaTrash className="me-1" /> Delete
                  </Button>
                </div>
              </div>

              <h5 className="mb-3">Description</h5>
              <p>{challenge.description}</p>

              <h5 className="mt-4 mb-3">Challenge Details</h5>
              <Row>
                <Col sm={6}>
                  <p>
                    <strong>Repeat Count:</strong> {challenge.repeatCount} times
                  </p>
                </Col>
                <Col sm={6}>
                  <p className="d-flex align-items-center">
                    <FaUsers className="me-2 text-primary" />
                    <strong>Enrolled Users:</strong>{" "}
                    {challenge.enrolledUsers?.length || 0}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Join This Challenge</h5>
              {isUserEnrolled ? (
                <Alert variant="success" className="d-flex align-items-center">
                  <FaCheckCircle className="me-2" />
                  You're already enrolled in this challenge!
                </Alert>
              ) : (
                <>
                  <p>
                    Ready to take on this challenge? Enroll now and start
                    tracking your progress!
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100"
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Enrolling...
                      </>
                    ) : (
                      "Enroll Now"
                    )}
                  </Button>
                </>
              )}

              <hr className="my-4" />

              <div className="text-center">
                <h6>Share this challenge</h6>
                <div className="d-flex justify-content-center mt-3">
                  <Button variant="outline-primary" size="sm" className="mx-1">
                    Facebook
                  </Button>
                  <Button variant="outline-info" size="sm" className="mx-1">
                    Twitter
                  </Button>
                  <Button variant="outline-dark" size="sm" className="mx-1">
                    Copy Link
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ChallengeDetails;
