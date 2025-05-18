import { Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUsers, FaArrowRight } from "react-icons/fa";
import PropTypes from "prop-types";

function ChallengeCard({ challenge }) {
  // Determine badge color based on difficulty
  const getBadgeVariant = (difficulty) => {
    switch (difficulty.toLowerCase()) {
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

  return (
    <Card className="h-100 challenge-card">
      {challenge.imageUrl && (
        <div
          className="card-img-wrapper"
          style={{ height: "180px", overflow: "hidden" }}
        >
          <Card.Img
            variant="top"
            src={challenge.imageUrl}
            alt={challenge.title}
            style={{ objectFit: "cover", height: "100%", width: "100%" }}
          />
        </div>
      )}
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge
            bg={getBadgeVariant(challenge.difficulty)}
            className="text-uppercase"
          >
            {challenge.difficulty}
          </Badge>
          <Badge bg="light" text="dark" className="category-badge">
            {challenge.category}
          </Badge>
        </div>
        <Card.Title className="fs-5 fw-bold">{challenge.title}</Card.Title>
        <Card.Text className="text-muted mb-3">
          {challenge.description.length > 100
            ? `${challenge.description.substring(0, 100)}...`
            : challenge.description}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div className="d-flex align-items-center">
            <FaUsers className="text-primary me-1" />
            <span className="fs-6">
              {challenge.enrolledUsers?.length || 0} enrolled
            </span>
          </div>
          <Button
            as={Link}
            to={`/challenges/${challenge.id}`}
            variant="outline-primary"
            size="sm"
            className="d-flex align-items-center"
          >
            Details <FaArrowRight className="ms-1" />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

ChallengeCard.propTypes = {
  challenge: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    category: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
    repeatCount: PropTypes.number,
    enrolledUsers: PropTypes.array,
  }).isRequired,
};

export default ChallengeCard;
