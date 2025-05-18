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
  Form,
  ListGroup,
  Modal,
  Dropdown,
  ProgressBar,
} from "react-bootstrap";
import {
  FaEdit,
  FaTrash,
  FaUsers,
  FaArrowLeft,
  FaCheckCircle,
  FaComment,
  FaUser,
  FaPaperPlane,
  FaEllipsisV,
  FaClock,
  FaStopwatch,
} from "react-icons/fa";
import {
  getChallengeById,
  deleteChallenge,
  enrollUserInChallenge,
} from "../services/challengeService";
import {
  getCommentsByChallengeId,
  addComment,
  updateComment,
  deleteComment,
} from "../services/commentService";
import { toast } from "react-toastify";

function ChallengeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  // Timer states
  const [timerActive, setTimerActive] = useState(false);
  const [timerComplete, setTimerComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5 * 60); // 5 minutes in seconds
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // Comment states
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // For editing comments
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // For deleting comments
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock user ID (in a real app, this would come from auth context)
  const currentUserId = "user123";

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        const data = await getChallengeById(id);
        setChallenge(data);

        // Check if user is enrolled and if we need to initialize timer
        const isUserEnrolled = data.enrolledUsers?.includes(currentUserId);
        if (isUserEnrolled) {
          // In a real app, you would fetch the timer state from the backend
          // Here we're just checking if there's a saved timer in localStorage
          const savedTimer = localStorage.getItem(
            `challenge_timer_${id}_${currentUserId}`
          );
          if (savedTimer) {
            const timerData = JSON.parse(savedTimer);
            const now = new Date().getTime();

            if (timerData.endTime > now) {
              // Timer is still active
              setTimerActive(true);
              setStartTime(timerData.startTime);
              setEndTime(timerData.endTime);
              setTimeRemaining(Math.floor((timerData.endTime - now) / 1000));
            } else if (!timerData.completed) {
              // Timer has expired but not marked as completed
              setTimerComplete(true);
              setTimeRemaining(0);

              // Update localStorage to mark timer as completed
              localStorage.setItem(
                `challenge_timer_${id}_${currentUserId}`,
                JSON.stringify({ ...timerData, completed: true })
              );
            } else {
              // Timer was completed before
              setTimerComplete(true);
              setTimeRemaining(0);
            }
          }
        }

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
  }, [id, currentUserId]);

  // Timer countdown effect
  useEffect(() => {
    let interval;

    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const remaining = Math.floor((endTime - now) / 1000);

        if (remaining <= 0) {
          // Timer complete
          clearInterval(interval);
          setTimeRemaining(0);
          setTimerActive(false);
          setTimerComplete(true);

          // Update timer status in localStorage
          const timerData = JSON.parse(
            localStorage.getItem(`challenge_timer_${id}_${currentUserId}`)
          );
          localStorage.setItem(
            `challenge_timer_${id}_${currentUserId}`,
            JSON.stringify({ ...timerData, completed: true })
          );

          toast.success("Challenge time complete!");
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeRemaining, endTime, id, currentUserId]);

  // Fetch comments when component mounts or challenge ID changes
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;

      try {
        setLoadingComments(true);
        const data = await getCommentsByChallengeId(id);
        setComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
        toast.error("Failed to load comments");
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
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

      // Start the timer
      const now = new Date().getTime();
      const fiveMinutesLater = now + 5 * 60 * 1000;

      setTimerActive(true);
      setStartTime(now);
      setEndTime(fiveMinutesLater);
      setTimeRemaining(5 * 60); // 5 minutes in seconds

      // Save timer state to localStorage
      localStorage.setItem(
        `challenge_timer_${id}_${currentUserId}`,
        JSON.stringify({
          startTime: now,
          endTime: fiveMinutesLater,
          completed: false,
        })
      );

      // Update local state to reflect enrollment
      setChallenge((prev) => ({
        ...prev,
        enrolledUsers: [...(prev.enrolledUsers || []), currentUserId],
      }));

      toast.success("Successfully enrolled in challenge! Timer has started.");
    } catch (err) {
      console.error("Error enrolling in challenge:", err);
      toast.error("Failed to enroll in challenge");
    } finally {
      setEnrolling(false);
    }
  };

  // Format timer display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Calculate timer progress percentage
  const calculateProgress = () => {
    const totalSeconds = 5 * 60; // 5 minutes
    const progress = ((totalSeconds - timeRemaining) / totalSeconds) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.warning("Comment cannot be empty");
      return;
    }

    try {
      setSubmittingComment(true);

      const commentData = {
        challengeId: id,
        userId: currentUserId,
        content: newComment,
      };

      const data = await addComment(commentData);

      // Add the new comment to the comments list
      setComments([...comments, data]);
      setNewComment(""); // Clear the input
      toast.success("Comment added successfully");
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Handle starting the edit process
  const handleEditStart = (comment) => {
    setEditingComment(comment);
    setEditedContent(comment.content);
    setIsEditing(true);
  };

  // Handle comment update
  const handleUpdateComment = async () => {
    if (!editedContent.trim()) {
      toast.warning("Comment cannot be empty");
      return;
    }

    try {
      setIsEditing(true);
      const updatedComment = await updateComment(
        editingComment.id,
        editedContent
      );

      // Update the comment in the local state
      setComments(
        comments.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );

      setIsEditing(false);
      setEditingComment(null);
      toast.success("Comment updated successfully");
    } catch (err) {
      console.error("Error updating comment:", err);
      toast.error("Failed to update comment");
    }
  };

  // Handle delete comment modal
  const handleDeleteModal = (comment) => {
    setCommentToDelete(comment);
    setShowDeleteModal(true);
  };

  // Handle comment deletion
  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      setIsDeleting(true);
      await deleteComment(commentToDelete.id);

      // Remove the comment from local state
      setComments(
        comments.filter((comment) => comment.id !== commentToDelete.id)
      );

      setShowDeleteModal(false);
      setCommentToDelete(null);
      toast.success("Comment deleted successfully");
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error("Failed to delete comment");
    } finally {
      setIsDeleting(false);
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

  // Format date for comments
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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

      {/* Comment Edit Modal */}
      <Modal
        show={editingComment !== null}
        onHide={() => setEditingComment(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={4}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              disabled={isEditing}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setEditingComment(null)}
            disabled={isEditing}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateComment}
            disabled={isEditing || !editedContent.trim()}
          >
            {isEditing ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Comment Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </p>
          {commentToDelete && (
            <Alert variant="light" className="border">
              <small className="text-muted d-block mb-2">Your comment:</small>
              <p className="mb-0">{commentToDelete.content}</p>
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteComment}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              "Delete Comment"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

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

          {/* Comments Section */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaComment className="me-2 text-primary" />
                Comments ({comments.length})
              </h5>
              <Badge bg="primary" pill>
                {comments.length}
              </Badge>
            </Card.Header>
            <Card.Body>
              {loadingComments ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" size="sm" />
                  <p className="mt-2">Loading comments...</p>
                </div>
              ) : comments.length === 0 ? (
                <Alert variant="light" className="text-center">
                  No comments yet. Be the first to comment!
                </Alert>
              ) : (
                <ListGroup
                  variant="flush"
                  className="overflow-auto"
                  style={{ maxHeight: "500px" }}
                >
                  {comments.map((comment) => (
                    <ListGroup.Item key={comment.id} className="py-3">
                      <div className="d-flex">
                        <div
                          className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: "40px",
                            height: "40px",
                            minWidth: "40px",
                          }}
                        >
                          <FaUser />
                        </div>
                        <div className="w-100">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0 fw-bold">
                              User {comment.userId.slice(-5)}
                            </h6>
                            <div className="d-flex align-items-center">
                              <small className="text-muted me-3">
                                {formatDate(comment.createdAt)}
                              </small>
                              {comment.userId === currentUserId && (
                                <Dropdown align="end">
                                  <Dropdown.Toggle
                                    as="div"
                                    className="cursor-pointer bg-transparent border-0 p-0"
                                  >
                                    <FaEllipsisV className="text-muted" />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item
                                      onClick={() => handleEditStart(comment)}
                                    >
                                      <FaEdit className="me-2" /> Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() => handleDeleteModal(comment)}
                                      className="text-danger"
                                    >
                                      <FaTrash className="me-2" /> Delete
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              )}
                            </div>
                          </div>
                          <p className="mb-0">{comment.content}</p>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}

              {/* Add Comment Form */}
              <Form
                onSubmit={handleCommentSubmit}
                className="mt-4 border-top pt-4"
              >
                <h6 className="mb-3">
                  <FaPaperPlane className="me-2 text-primary" />
                  Leave a comment
                </h6>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Share your thoughts about this challenge..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={submittingComment}
                    className="shadow-sm"
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submittingComment || !newComment.trim()}
                    className="d-flex align-items-center"
                  >
                    {submittingComment ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Posting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane size={14} className="me-2" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="card-title mb-4">Join This Challenge</h5>
              {isUserEnrolled ? (
                <>
                  <Alert
                    variant="success"
                    className="d-flex align-items-center mb-4"
                  >
                    <FaCheckCircle className="me-2" />
                    You're enrolled in this challenge!
                  </Alert>

                  {/* Timer Display */}
                  <Card className="border mb-3">
                    <Card.Body>
                      <h6 className="d-flex align-items-center mb-3">
                        <FaClock className="text-primary me-2" />
                        Challenge Timer
                      </h6>

                      {timerComplete ? (
                        <Alert variant="info" className="mb-0">
                          <FaCheckCircle className="me-2" />
                          Challenge time completed!
                        </Alert>
                      ) : timerActive ? (
                        <>
                          <div className="text-center mb-3">
                            <h2 className="display-4 fw-bold text-primary">
                              {formatTime(timeRemaining)}
                            </h2>
                            <p className="text-muted mb-2">remaining</p>
                          </div>
                          <ProgressBar
                            now={calculateProgress()}
                            variant="primary"
                            className="mb-2"
                          />
                          <div className="d-flex justify-content-between text-muted small">
                            <span>Start</span>
                            <span>5:00</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <p className="mb-0">
                            Timer not active or has expired.
                          </p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </>
              ) : (
                <>
                  <p>
                    Ready to take on this challenge? Enroll now and start
                    tracking your progress! A 5-minute timer will start
                    automatically.
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
                      <>
                        <FaStopwatch className="me-2" />
                        Enroll & Start Timer
                      </>
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
