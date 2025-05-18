import { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  Container,
  Alert,
  Badge,
  Card,
  Spinner,
} from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import {
  getAllChallenges,
  filterChallengesByCategory,
  filterChallengesByDifficulty,
} from "../services/challengeService";
import ChallengeList from "../components/challenges/ChallengeList";
import ChallengeFilters from "../components/challenges/ChallengeFilters";
import {
  FaTrophy,
  FaExclamationTriangle,
  FaFire,
  FaChartLine,
  FaUsers,
  FaMedal,
} from "react-icons/fa";

// Custom CSS variables
const styles = {
  primaryGreen: "#198754" /* Dark Green */,
  lightGreen: "#d1e7dd" /* Light Green */,
  darkGreen: "#1b5e20" /* Deep Green */,
  white: "#ffffff",
  lightGray: "#f8f9fa",
  darkGray: "#212529",
  gradientBg: "linear-gradient(135deg, #198754 0%, #1b5e20 100%)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  transition: "all 0.3s ease",
};

function Home() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const [featuredChallenge, setFeaturedChallenge] = useState(null);
  const [stats, setStats] = useState({
    totalChallenges: 0,
    activeChallenges: 0,
    totalUsers: 0,
  });
  const [activeFilter, setActiveFilter] = useState({
    category: null,
    difficulty: null,
    sortBy: null,
  });

  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllChallenges();
      setChallenges(data);

      // Set featured challenge (highest enrolled users)
      const featured = [...data].sort(
        (a, b) =>
          (b.enrolledUsers?.length || 0) - (a.enrolledUsers?.length || 0)
      )[0];
      setFeaturedChallenge(featured);

      // Calculate stats
      setStats({
        totalChallenges: data.length,
        activeChallenges: data.filter((c) => c.isActive).length,
        totalUsers: data.reduce(
          (sum, challenge) => sum + (challenge.enrolledUsers?.length || 0),
          0
        ),
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching challenges:", err);
      setError("Failed to load challenges. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const handleFilterChange = async (filters) => {
    try {
      setLoading(true);
      setActiveFilter({
        category: filters.category || null,
        difficulty: filters.difficulty || null,
        sortBy: filters.sortBy || null,
      });

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
        filteredChallenges.reverse();
      } else if (filters.sortBy === "newest") {
        // Assuming challenges are already sorted by newest first from API
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
      setActiveFilter({
        category: null,
        difficulty: null,
        sortBy: null,
      });
      await fetchChallenges();
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

  const renderStatCards = () => (
    <Row className="mb-4">
      <Col md={4} className="mb-3 mb-md-0">
        <Card
          style={{
            borderLeft: `4px solid ${styles.primaryGreen}`,
            boxShadow: styles.boxShadow,
            transition: styles.transition,
          }}
          className="h-100"
        >
          <Card.Body className="d-flex align-items-center">
            <div
              style={{
                backgroundColor: styles.lightGreen,
                padding: "12px",
                borderRadius: "50%",
                marginRight: "15px",
              }}
            >
              <FaTrophy color={styles.darkGreen} size={24} />
            </div>
            <div>
              <p className="text-muted mb-0">Total Challenges</p>
              <h3 className="mb-0">{stats.totalChallenges}</h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4} className="mb-3 mb-md-0">
        <Card
          style={{
            borderLeft: `4px solid ${styles.primaryGreen}`,
            boxShadow: styles.boxShadow,
            transition: styles.transition,
          }}
          className="h-100"
        >
          <Card.Body className="d-flex align-items-center">
            <div
              style={{
                backgroundColor: styles.lightGreen,
                padding: "12px",
                borderRadius: "50%",
                marginRight: "15px",
              }}
            >
              <FaFire color={styles.darkGreen} size={24} />
            </div>
            <div>
              <p className="text-muted mb-0">Active Challenges</p>
              <h3 className="mb-0">{stats.activeChallenges}</h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4} className="mb-3 mb-md-0">
        <Card
          style={{
            borderLeft: `4px solid ${styles.primaryGreen}`,
            boxShadow: styles.boxShadow,
            transition: styles.transition,
          }}
          className="h-100"
        >
          <Card.Body className="d-flex align-items-center">
            <div
              style={{
                backgroundColor: styles.lightGreen,
                padding: "12px",
                borderRadius: "50%",
                marginRight: "15px",
              }}
            >
              <FaUsers color={styles.darkGreen} size={24} />
            </div>
            <div>
              <p className="text-muted mb-0">Participants</p>
              <h3 className="mb-0">{stats.totalUsers}</h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderFeaturedChallenge = () => {
    if (!featuredChallenge) return null;

    return (
      <Card
        className="mb-4 featured-challenge"
        style={{
          background: styles.gradientBg,
          color: styles.white,
          boxShadow: styles.boxShadow,
          borderRadius: styles.borderRadius,
          overflow: "hidden",
        }}
      >
        <Card.Body className="p-4">
          <Row>
            <Col lg={8}>
              <Badge
                bg="light"
                text="dark"
                className="mb-2"
                style={{ padding: "8px 12px" }}
              >
                <FaChartLine className="me-1" /> Featured Challenge
              </Badge>
              <h2 className="mt-2 mb-3">{featuredChallenge.title}</h2>
              <p className="mb-3">{featuredChallenge.description}</p>
              <div className="d-flex flex-wrap">
                <Badge
                  bg="light"
                  text="dark"
                  className="me-2 mb-2"
                  style={{ padding: "6px 10px" }}
                >
                  {featuredChallenge.category}
                </Badge>
                <Badge
                  bg="light"
                  text="dark"
                  className="me-2 mb-2"
                  style={{ padding: "6px 10px" }}
                >
                  {featuredChallenge.difficulty || "Beginner"}
                </Badge>
                <Badge
                  bg="light"
                  text="dark"
                  className="mb-2"
                  style={{ padding: "6px 10px" }}
                >
                  <FaUsers className="me-1" />
                  {featuredChallenge.enrolledUsers?.length || 0} joined
                </Badge>
              </div>
            </Col>
            <Col
              lg={4}
              className="d-flex align-items-center justify-content-center mt-3 mt-lg-0"
            >
              <div
                className="text-center p-3"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  backdropFilter: "blur(5px)",
                }}
              >
                <FaMedal size={48} className="mb-3" />
                <button
                  className="btn btn-light btn-lg"
                  style={{
                    fontWeight: "600",
                    padding: "10px 20px",
                  }}
                >
                  Join Challenge
                </button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="fade-in">
      <div
        style={{
          background: `linear-gradient(rgba(27, 94, 32, 0.9), rgba(25, 135, 84, 0.8)), url('/images/challenge-bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "80px 0",
          marginBottom: "2rem",
          color: styles.white,
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-3">
                <FaTrophy className="me-3" />
                Challenge Yourself Today
              </h1>
              <p className="lead mb-4" style={{ fontSize: "1.25rem" }}>
                Join exciting challenges to develop new habits, learn skills,
                and achieve your goals. Find the perfect challenge or create
                your own to share with others.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-light btn-lg px-4"
                  style={{
                    fontWeight: "600",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  Browse Challenges
                </button>
                <button
                  className="btn btn-outline-light btn-lg px-4"
                  style={{ fontWeight: "600" }}
                >
                  Create Challenge
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {loading && !filteredChallenges.length ? (
          <div className="text-center py-5">
            <Spinner
              animation="border"
              role="status"
              style={{
                color: styles.primaryGreen,
                width: "3rem",
                height: "3rem",
              }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3 text-muted">Loading challenges...</p>
          </div>
        ) : (
          <>
            {error && (
              <Alert
                variant="danger"
                className="mb-4"
                style={{
                  borderRadius: styles.borderRadius,
                  boxShadow: styles.boxShadow,
                }}
              >
                <div className="d-flex align-items-center">
                  <FaExclamationTriangle className="me-2" />
                  <span>{error}</span>
                </div>
              </Alert>
            )}

            {searchQuery && (
              <Alert
                variant="info"
                className="mb-4"
                style={{
                  borderRadius: styles.borderRadius,
                  boxShadow: styles.boxShadow,
                  borderLeft: `4px solid #0dcaf0`,
                }}
              >
                <div className="d-flex align-items-center">
                  <FaExclamationTriangle className="me-2" />
                  <span>
                    Showing results for: <strong>"{searchQuery}"</strong>
                  </span>
                </div>
              </Alert>
            )}

            {!loading && !error && (
              <>
                {!searchQuery && renderStatCards()}
                {!searchQuery && renderFeaturedChallenge()}

                <ChallengeFilters
                  onFilterChange={handleFilterChange}
                  onClear={handleClearFilters}
                  activeFilter={activeFilter}
                  styles={styles}
                />

                {filteredChallenges.length === 0 ? (
                  <div
                    className="text-center py-5"
                    style={{
                      backgroundColor: styles.lightGray,
                      borderRadius: styles.borderRadius,
                      padding: "3rem",
                    }}
                  >
                    <FaExclamationTriangle
                      size={32}
                      className="mb-3 text-muted"
                    />
                    <h3>No challenges found</h3>
                    <p className="text-muted">
                      Try adjusting your filters or search query
                    </p>
                    <button
                      className="btn btn-outline-secondary mt-2"
                      onClick={handleClearFilters}
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <ChallengeList
                    challenges={filteredChallenges}
                    loading={loading}
                    error={error}
                    styles={styles}
                  />
                )}
              </>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default Home;
