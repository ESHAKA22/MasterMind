import { Row, Col, Alert, Spinner } from "react-bootstrap";
import ChallengeCard from "./ChallengeCard";
import PropTypes from "prop-types";

function ChallengeList({ challenges, loading, error }) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading challenges...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error loading challenges</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  if (!challenges || challenges.length === 0) {
    return (
      <Alert variant="info">
        <Alert.Heading>No challenges found</Alert.Heading>
        <p>There are no challenges available matching your criteria.</p>
      </Alert>
    );
  }

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {challenges.map((challenge) => (
        <Col key={challenge.id}>
          <ChallengeCard challenge={challenge} />
        </Col>
      ))}
    </Row>
  );
}

ChallengeList.propTypes = {
  challenges: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

ChallengeList.defaultProps = {
  challenges: [],
  loading: false,
  error: null,
};

export default ChallengeList;
