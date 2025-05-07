import { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { FaFilter, FaTimes } from "react-icons/fa";
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

function ChallengeFilters({ onFilterChange, onClear }) {
  const [filters, setFilters] = useState({
    category: "",
    difficulty: "",
    sortBy: "latest",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    // Notify parent component about filter changes
    onFilterChange(updatedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      category: "",
      difficulty: "",
      sortBy: "latest",
    };
    setFilters(clearedFilters);

    // Notify parent component about cleared filters
    onClear(clearedFilters);
  };

  const isFilterActive = () => {
    return (
      filters.category || filters.difficulty || filters.sortBy !== "latest"
    );
  };

  return (
    <Card className="mb-4 border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0 d-flex align-items-center">
            <FaFilter className="me-2 text-primary" /> Filters
          </h5>
          {isFilterActive() && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleClearFilters}
              className="d-flex align-items-center"
            >
              <FaTimes className="me-1" /> Clear All
            </Button>
          )}
        </div>

        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4} className="mb-3 mb-md-0">
            <Form.Group>
              <Form.Label>Difficulty</Form.Label>
              <Form.Select
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
              >
                <option value="">All Difficulties</option>
                {DIFFICULTIES.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Sort By</Form.Label>
              <Form.Select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="popularity">Most Popular</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

ChallengeFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default ChallengeFilters;
