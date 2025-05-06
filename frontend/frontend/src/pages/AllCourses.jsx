import { useState, useEffect } from 'react';
import { Row, Col, Form, Button, InputGroup, Dropdown, Badge, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { getCourses } from '../api';
import { getCourseImage } from '../utils/imageUtils';
import { BsSearch, BsFilter, BsSortDown, BsX, BsBookHalf, BsPerson } from 'react-icons/bs';

function AllCourses() {
  // Custom color scheme
  const colors = {
    primaryGreen: '#198754',    // Dark Green
    lightGreen: '#d1e7dd',      // Light Green
    darkGreen: '#1b5e20',       // Deep Green
    white: '#ffffff',
    lightGray: '#f8f9fa',
    darkGray: '#212529'
  };

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [language, setLanguage] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  
  // Available languages and tags (derived from courses)
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await getCourses();
        setCourses(data);
        setFilteredCourses(data);
        
        // Extract unique languages from courses
        const languages = [...new Set(data.map(course => course.language).filter(Boolean))];
        setAvailableLanguages(languages);
        
        // Extract unique tags from courses
        const allTags = data.reduce((tags, course) => {
          if (course.tags && Array.isArray(course.tags)) {
            return [...tags, ...course.tags];
          }
          return tags;
        }, []);
        
        const uniqueTags = [...new Set(allTags)];
        setAvailableTags(uniqueTags);
        
        setError(null);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Apply all filters and sorting
  useEffect(() => {
    let result = [...courses];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(query) || 
        (course.tags && course.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply category filter
    if (category) {
      result = result.filter(course => 
        course.category && course.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Apply level filter
    if (level) {
      result = result.filter(course => course.level === level);
    }
    
    // Apply language filter
    if (language) {
      result = result.filter(course => course.language === language);
    }
    
    // Apply tags filter
    if (selectedTags.length > 0) {
      result = result.filter(course => 
        course.tags && selectedTags.every(tag => course.tags.includes(tag))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result = result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'popular':
        result = result.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
        break;
      case 'topRated':
        result = result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    
    setFilteredCourses(result);
  }, [courses, searchQuery, category, level, language, selectedTags, sortBy]);

  const handleTagToggle = (tag) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setCategory('');
    setLevel('');
    setLanguage('');
    setSelectedTags([]);
    setSortBy('newest');
  };

  return (
    <div className="bg-light">
      {/* Hero Section */}
      <div 
        className="py-5" 
        style={{ 
          background: `linear-gradient(to right, ${colors.darkGreen}, ${colors.primaryGreen})`,
          borderBottom: `5px solid ${colors.lightGreen}`
        }}
      >
        <div className="container py-4">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold text-white mb-3">
                Discover Your Next Learning Journey
              </h1>
              <p className="lead text-white mb-4 opacity-90">
                Expand your skills with our comprehensive collection of professional courses designed for your career growth
              </p>
              <div className="d-flex gap-3">
                <Button 
                  as={Link} 
                  to="/instructor" 
                  variant="light"
                  size="lg"
                  className="fw-bold"
                  style={{
                    backgroundColor: colors.white,
                    color: colors.primaryGreen,
                    borderColor: 'transparent',
                    padding: '12px 28px',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <BsPerson className="me-2" />
                  Become an Instructor
                </Button>
                <Button 
                  as={Link} 
                  to="/browse" 
                  variant="outline-light"
                  size="lg"
                  className="fw-bold"
                  style={{
                    padding: '12px 28px',
                    borderRadius: '6px'
                  }}
                >
                  <BsBookHalf className="me-2" />
                  Browse Categories
                </Button>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="position-relative" style={{ height: '320px' }}>
                {/* Decorative elements */}
                <div className="position-absolute" style={{ 
                  top: '20px', 
                  right: '20px', 
                  width: '280px', 
                  height: '180px', 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  borderRadius: '12px',
                  transform: 'rotate(-5deg)'
                }}></div>
                <div className="position-absolute" style={{ 
                  bottom: '40px', 
                  left: '60px', 
                  width: '320px', 
                  height: '200px', 
                  backgroundColor: 'rgba(209,231,221,0.2)', 
                  borderRadius: '12px',
                  transform: 'rotate(3deg)'
                }}></div>
                <div className="position-absolute" style={{ 
                  top: '60px', 
                  left: '100px', 
                  width: '240px', 
                  height: '160px', 
                  backgroundColor: 'rgba(255,255,255,0.15)', 
                  borderRadius: '12px',
                  transform: 'rotate(-2deg)'
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Search and Filter Bar */}
        <Card className="border-0 shadow-sm mb-5 overflow-hidden">
          <Card.Body className="p-0">
            {/* Search Bar */}
            <div className="p-4 border-bottom" style={{ backgroundColor: colors.white }}>
              <InputGroup>
                <InputGroup.Text id="search-addon" style={{ backgroundColor: colors.white, borderRight: 0 }}>
                  <BsSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by course title or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-start-0 py-3"
                  style={{ boxShadow: 'none', fontSize: '1rem' }}
                />
                {searchQuery && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setSearchQuery('')}
                    className="border-start-0"
                  >
                    <BsX size={22} />
                  </Button>
                )}
              </InputGroup>
            </div>

            {/* Filters */}
            <div className="px-4 py-3 bg-white">
              <div className="d-flex flex-wrap gap-3 align-items-center">
                <div className="d-flex align-items-center">
                  <BsFilter style={{ color: colors.primaryGreen }} className="me-2" size={20} />
                  <span className="fw-medium">Filters:</span>
                </div>
                
                {/* Level Filter */}
                <Dropdown className="me-2">
                  <Dropdown.Toggle 
                    variant="outline-secondary" 
                    id="level-dropdown"
                    className="rounded-pill"
                    size="sm"
                    style={{ 
                      borderColor: level ? colors.primaryGreen : '#dee2e6',
                      color: level ? colors.primaryGreen : '#6c757d',
                      backgroundColor: level ? colors.lightGreen : 'transparent',
                      fontWeight: level ? '500' : '400'
                    }}
                  >
                    {level || 'Skill Level'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item 
                      onClick={() => setLevel('')}
                      active={!level}
                    >
                      All Levels
                    </Dropdown.Item>
                    <Dropdown.Item 
                      onClick={() => setLevel('Beginner')}
                      active={level === 'Beginner'}
                    >
                      Beginner
                    </Dropdown.Item>
                    <Dropdown.Item 
                      onClick={() => setLevel('Intermediate')}
                      active={level === 'Intermediate'}
                    >
                      Intermediate
                    </Dropdown.Item>
                    <Dropdown.Item 
                      onClick={() => setLevel('Advanced')}
                      active={level === 'Advanced'}
                    >
                      Advanced
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                
                {/* Language Filter */}
                <Dropdown className="me-2">
                  <Dropdown.Toggle 
                    variant="outline-secondary" 
                    id="language-dropdown"
                    className="rounded-pill"
                    size="sm"
                    style={{ 
                      borderColor: language ? colors.primaryGreen : '#dee2e6',
                      color: language ? colors.primaryGreen : '#6c757d',
                      backgroundColor: language ? colors.lightGreen : 'transparent',
                      fontWeight: language ? '500' : '400'
                    }}
                  >
                    {language || 'Language'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <Dropdown.Item 
                      onClick={() => setLanguage('')}
                      active={!language}
                    >
                      All Languages
                    </Dropdown.Item>
                    {availableLanguages.map(lang => (
                      <Dropdown.Item 
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        active={language === lang}
                      >
                        {lang}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                
                {/* Category Filter */}
                <Dropdown className="me-2">
                  <Dropdown.Toggle 
                    variant="outline-secondary" 
                    id="category-dropdown"
                    className="rounded-pill"
                    size="sm"
                    style={{ 
                      borderColor: category ? colors.primaryGreen : '#dee2e6',
                      color: category ? colors.primaryGreen : '#6c757d',
                      backgroundColor: category ? colors.lightGreen : 'transparent',
                      fontWeight: category ? '500' : '400'
                    }}
                  >
                    {category || 'Category'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item 
                      onClick={() => setCategory('')}
                      active={!category}
                    >
                      All Categories
                    </Dropdown.Item>
                    <Dropdown.Item 
                      onClick={() => setCategory('Programming')}
                      active={category === 'Programming'}
                    >
                      Programming
                    </Dropdown.Item>
                    <Dropdown.Item 
                      onClick={() => setCategory('Design')}
                      active={category === 'Design'}
                    >
                      Design
                    </Dropdown.Item>
                    <Dropdown.Item 
                      onClick={() => setCategory('Business')}
                      active={category === 'Business'}
                    >
                      Business
                    </Dropdown.Item>
                    <Dropdown.Item 
                      onClick={() => setCategory('Data Science')}
                      active={category === 'Data Science'}
                    >
                      Data Science
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                
                {/* Sort By */}
                <Dropdown className="ms-auto">
                  <Dropdown.Toggle 
                    variant="outline-success" 
                    id="sort-dropdown"
                    className="rounded-pill d-flex align-items-center"
                    size="sm"
                    style={{ 
                      borderColor: colors.primaryGreen,
                      color: colors.primaryGreen
                    }}
                  >
                    <BsSortDown className="me-2" />
                    Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'popular' ? 'Most Popular' : 'Top Rated'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    <Dropdown.Item 
                      onClick={() => setSortBy('newest')}
                      active={sortBy === 'newest'}
                      style={sortBy === 'newest' ? { backgroundColor: colors.lightGreen, color: colors.darkGreen } : {}}
                    >
                      Newest
                    </Dropdown.Item>
                    <Dropdown.Item 
                      onClick={() => setSortBy('popular')}
                      active={sortBy === 'popular'}
                      style={sortBy === 'popular' ? { backgroundColor: colors.lightGreen, color: colors.darkGreen } : {}}
                    >
                      Most Popular
                    </Dropdown.Item>
                    <Dropdown.Item 
                      onClick={() => setSortBy('topRated')}
                      active={sortBy === 'topRated'}
                      style={sortBy === 'topRated' ? { backgroundColor: colors.lightGreen, color: colors.darkGreen } : {}}
                    >
                      Top Rated
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              
              {/* Tags selector */}
              {availableTags.length > 0 && (
                <div className="mt-3 pt-3 border-top">
                  <div className="d-flex flex-wrap gap-2">
                    {availableTags.slice(0, 10).map((tag) => (
                      <Badge 
                        key={tag}
                        bg={selectedTags.includes(tag) ? "success" : "light"}
                        text={selectedTags.includes(tag) ? "white" : "dark"}
                        style={{ 
                          cursor: 'pointer', 
                          padding: '8px 12px',
                          backgroundColor: selectedTags.includes(tag) ? colors.primaryGreen : '#f8f9fa',
                          borderRadius: '20px',
                          fontWeight: '500',
                          fontSize: '0.85rem'
                        }}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Active filters display */}
              {(searchQuery || category || level || language || selectedTags.length > 0) && (
                <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <span className="text-muted small">Active filters:</span>
                    {searchQuery && (
                      <Badge 
                        bg="success" 
                        className="rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                        style={{ backgroundColor: colors.primaryGreen }}
                      >
                        Search: {searchQuery}
                        <BsX 
                          style={{ cursor: 'pointer' }} 
                          onClick={() => setSearchQuery('')}
                        />
                      </Badge>
                    )}
                    {category && (
                      <Badge 
                        bg="success" 
                        className="rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                        style={{ backgroundColor: colors.primaryGreen }}
                      >
                        Category: {category}
                        <BsX 
                          style={{ cursor: 'pointer' }} 
                          onClick={() => setCategory('')}
                        />
                      </Badge>
                    )}
                    {level && (
                      <Badge 
                        bg="success" 
                        className="rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                        style={{ backgroundColor: colors.primaryGreen }}
                      >
                        Level: {level}
                        <BsX 
                          style={{ cursor: 'pointer' }} 
                          onClick={() => setLevel('')}
                        />
                      </Badge>
                    )}
                    {language && (
                      <Badge 
                        bg="success" 
                        className="rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                        style={{ backgroundColor: colors.primaryGreen }}
                      >
                        Language: {language}
                        <BsX 
                          style={{ cursor: 'pointer' }} 
                          onClick={() => setLanguage('')}
                        />
                      </Badge>
                    )}
                    {selectedTags.map(tag => (
                      <Badge 
                        key={tag} 
                        bg="success" 
                        className="rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                        style={{ backgroundColor: colors.primaryGreen }}
                      >
                        Tag: {tag}
                        <BsX 
                          style={{ cursor: 'pointer' }} 
                          onClick={() => handleTagToggle(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={resetFilters}
                    className="rounded-pill"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Results count */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <p className="mb-0 fw-medium">
            <span className="fw-bold" style={{ color: colors.primaryGreen }}>
              {filteredCourses.length}
            </span> {filteredCourses.length === 1 ? 'course' : 'courses'} found
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-5">
            <div 
              className="spinner-border" 
              role="status"
              style={{ color: colors.primaryGreen }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3" style={{ color: colors.darkGreen }}>Loading courses...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Courses Grid */}
        {!loading && !error && (
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <Col key={course.id}>
                  <CourseCard 
                    course={{
                      ...course,
                      image: getCourseImage(course.category),
                      colors: {
                        border: 
                          course.level === 'Beginner'
                            ? colors.lightGreen
                            : course.level === 'Intermediate'
                            ? colors.primaryGreen
                            : colors.darkGreen,
                        text: colors.darkGreen,
                        buttonBg: colors.primaryGreen,
                        buttonHover: colors.darkGreen,
                      },
                    }} 
                  />
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <div 
                  className="text-center p-5 rounded-3" 
                  style={{ 
                    backgroundColor: colors.lightGreen,
                    color: colors.darkGreen 
                  }}
                >
                  <p className="lead mb-3">
                    No courses match your search criteria.
                  </p>
                  <p>Try adjusting your filters or search terms to find the perfect course for you.</p>
                  <Button 
                    variant="success" 
                    onClick={resetFilters}
                    className="mt-2"
                    style={{
                      backgroundColor: colors.primaryGreen,
                      borderColor: colors.primaryGreen
                    }}
                  >
                    Reset All Filters
                  </Button>
                </div>
              </Col>
            )}
          </Row>
        )}

        {/* Pagination - only show if there are courses */}
        {filteredCourses.length > 0 && (
          <div className="d-flex justify-content-center mt-5">
            <nav aria-label="Course pagination">
              <ul className="pagination">
                <li className="page-item disabled">
                  <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Previous</a>
                </li>
                <li className="page-item active" aria-current="page">
                  <a 
                    className="page-link" 
                    href="#"
                    style={{ 
                      backgroundColor: colors.primaryGreen, 
                      borderColor: colors.primaryGreen 
                    }}
                  >1</a>
                </li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item">
                  <a className="page-link" href="#">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Custom CSS */}
        <style jsx>{`
          .form-control:focus {
            border-color: ${colors.primaryGreen} !important;
            box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25) !important;
          }

          .dropdown-item.active, 
          .dropdown-item:active {
            background-color: ${colors.primaryGreen} !important;
            color: ${colors.white} !important;
          }

          .badge {
            transition: all 0.2s ease;
          }
          
          .badge:hover {
            opacity: 0.9;
          }

          .page-link {
            color: ${colors.primaryGreen};
          }

          .page-link:focus {
            box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
          }
        `}</style>
      </div>
    </div>
  );
}

export default AllCourses;