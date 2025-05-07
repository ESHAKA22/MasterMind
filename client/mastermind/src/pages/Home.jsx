import { useState, useEffect } from "react";
import { Row, Col, Container, Alert } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import {
  getAllChallenges,
  filterChallengesByCategory,
  filterChallengesByDifficulty,
} from "../services/challengeService";
import ChallengeList from "../components/challenges/ChallengeList";
import ChallengeFilters from "../components/challenges/ChallengeFilters";
import { FaTrophy, FaExclamationTriangle } from "react-icons/fa";

function Home() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const data = await getAllChallenges();
        setChallenges(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching challenges:", err);
        setError("Failed to load challenges. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const handleFilterChange = async (filters) => {
    try {
      setLoading(true);
      let filteredChallenges = [];

      if (filters.category) {
        filteredChallenges = await filterChallengesByCategory(filters.category);
      } else if (filters.difficulty) {
        filteredChallenges = await filterChallengesByDifficulty(
          filters.difficulty
        );
      } else {
        filteredChallenges = await getAllChallenges();
      }

      // Client-side sorting
      if (filters.sortBy === "popularity") {
        filteredChallenges.sort(
          (a, b) =>
            (b.enrolledUsers?.length || 0) - (a.enrolledUsers?.length || 0)
        );
      } else if (filters.sortBy === "oldest") {
        // For demonstration purposes - would need proper date fields in real app
        filteredChallenges.reverse();
      }

      setChallenges(filteredChallenges);
      setError(null);
    } catch (err) {
      console.error("Error filtering challenges:", err);
      setError("Failed to filter challenges. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = async () => {
    try {
      setLoading(true);
      const data = await getAllChallenges();
      setChallenges(data);
      setError(null);
    } catch (err) {
      console.error("Error clearing filters:", err);
      setError("Failed to reset challenges. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter by search query if present
  const filteredChallenges = searchQuery
    ? challenges.filter(
        (challenge) =>
          challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          challenge.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          challenge.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : challenges;

  return (
    <div className="fade-in">
      <div className="bg-light py-5 mb-4">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-5 fw-bold text-primary mb-3">
                <FaTrophy className="me-3" />
                Challenge Yourself Today
              </h1>
              <p className="lead mb-4">
                Join exciting challenges to develop new habits, learn skills,
                and achieve your goals. Find the perfect challenge or create
                your own to share with others.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {searchQuery && (
          <Alert variant="info" className="mb-4">
            <div className="d-flex align-items-center">
              <FaExclamationTriangle className="me-2" />
              <span>
                Showing results for: <strong>"{searchQuery}"</strong>
              </span>
            </div>
          </Alert>
        )}

        <ChallengeFilters
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        <ChallengeList
          challenges={filteredChallenges}
          loading={loading}
          error={error}
        />
      </Container>
    </div>
  );
}

export default Home;
