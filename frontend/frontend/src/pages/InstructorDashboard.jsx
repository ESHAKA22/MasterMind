import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { getCourses, deleteCourse } from '../api';
import { FaPlus, FaBook, FaChalkboardTeacher, FaLightbulb } from 'react-icons/fa';

function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCourses, setActiveCourses] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  // Color scheme
  const colors = {
    primaryGreen: '#198754',
    lightGreen: '#d1e7dd',
    darkGreen: '#1b5e20',
    white: '#ffffff',
    lightGray: '#f8f9fa',
    darkGray: '#212529'
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await getCourses();
        setCourses(data);
        
        // Calculate stats (in a real app, this would come from the API)
        setActiveCourses(data.length);
        setTotalStudents(data.reduce((total, course) => total + (course.enrollments || 0), 0));
        
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id);
        setCourses(courses.filter((course) => course.id !== id));
        setActiveCourses(activeCourses - 1);
      } catch (error) {
        setError('Failed to delete course.');
      }
    }
  };

  return (
    <Container fluid className="p-0">
      {/* Sidebar alternative: Top dashboard header with stats */}
      <div 
        className="py-4 px-3 mb-4" 
        style={{ 
          background: `linear-gradient(135deg, ${colors.primaryGreen}, ${colors.darkGreen})`,
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-5 fw-bold text-white mb-0">Instructor Dashboard</h1>
              <p className="lead text-white opacity-75 mb-0">
                Manage your courses and track your teaching journey
              </p>
            </Col>
            <Col lg={6}>
              <Row className="g-4 mt-3 mt-lg-0">
                <Col xs={6}>
                  <Card className="border-0 rounded-4 shadow-sm h-100">
                    <Card.Body className="d-flex align-items-center">
                      <div 
                        className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '48px', 
                          height: '48px', 
                          backgroundColor: colors.lightGreen,
                          color: colors.primaryGreen
                        }}
                      >
                        <FaBook size={20} />
                      </div>
                      <div>
                        <h2 className="fs-4 mb-0">{activeCourses}</h2>
                        <p className="text-muted mb-0 small">Active Courses</p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card className="border-0 rounded-4 shadow-sm h-100">
                    <Card.Body className="d-flex align-items-center">
                      <div 
                        className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '48px', 
                          height: '48px', 
                          backgroundColor: colors.lightGreen,
                          color: colors.primaryGreen
                        }}
                      >
                        <FaChalkboardTeacher size={20} />
                      </div>
                      <div>
                        <h2 className="fs-4 mb-0">{totalStudents}</h2>
                        <p className="text-muted mb-0 small">Total Students</p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        {/* Error Message */}
        {error && (
          <Alert 
            variant="danger" 
            className="mb-4 rounded-3 border-0 shadow-sm"
          >
            {error}
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0" style={{ color: colors.darkGray }}>Your Courses</h2>
          <div>
            <Button 
              as={Link} 
              to="/courses" 
              variant="outline-success"
              className="me-2"
              style={{
                borderColor: colors.primaryGreen,
                color: colors.primaryGreen
              }}
            >
              View All Courses
            </Button>
            <Button 
              as={Link} 
              to="/add-course" 
              variant="success"
              style={{
                backgroundColor: colors.primaryGreen,
                borderColor: colors.primaryGreen,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              <FaPlus className="me-2" /> Create New Course
            </Button>
          </div>
        </div>

        {/* Courses Section */}
        <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner 
                  animation="border" 
                  role="status"
                  style={{ color: colors.primaryGreen }}
                >
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3">Loading your courses...</p>
              </div>
            ) : (
              courses.length > 0 ? (
                <div className="p-4">
                  <Row xs={1} md={2} lg={3} className="g-4">
                    {courses.map((course) => (
                      <Col key={course.id}>
                        <CourseCard
                          course={{
                            ...course,
                            image: 
                              course.category === 'Programming'
                                ? 'https://images.unsplash.com/photo-1516321310768-61f3f3c93b44'
                                : course.category === 'Design'
                                ? 'https://images.unsplash.com/photo-1561074050-8a4b3c3d5e8b'
                                : course.category === 'Business'
                                ? 'https://images.unsplash.com/photo-1507679799987-c73779587ccf'
                                : 'https://images.unsplash.com/photo-1516321310768-61f3f3c93b44',
                            colors: {
                              border: colors.primaryGreen,
                              text: colors.darkGray,
                              buttonBg: colors.primaryGreen,
                              buttonHover: colors.darkGreen,
                            },
                          }}
                          showInstructorOptions={true}
                          onDelete={handleDelete}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              ) : (
                <div 
                  className="text-center p-5" 
                  style={{ backgroundColor: colors.lightGray }}
                >
                  <img 
                    src="/api/placeholder/200/200" 
                    alt="No courses" 
                    className="mb-3 opacity-50"
                  />
                  <h3 style={{ color: colors.darkGray }}>No Courses Yet</h3>
                  <p className="text-muted mb-4">
                    You haven't created any courses yet. Start by creating your first course!
                  </p>
                  <Button 
                    as={Link} 
                    to="/add-course" 
                    variant="success"
                    style={{
                      backgroundColor: colors.primaryGreen,
                      borderColor: colors.primaryGreen
                    }}
                  >
                    <FaPlus className="me-2" /> Create New Course
                  </Button>
                </div>
              )
            )}
          </Card.Body>
        </Card>

        {/* Instructor Tips Section */}
        <div className="mb-2">
          <h2 style={{ color: colors.darkGray }} className="d-flex align-items-center">
            <FaLightbulb className="me-2" style={{ color: colors.primaryGreen }} />
            Instructor Tips
          </h2>
        </div>
        <Row xs={1} md={3} className="g-4 mb-4">
          <Col>
            <Card 
              className="border-0 rounded-4 shadow-sm h-100" 
              style={{ borderTop: `3px solid ${colors.primaryGreen}` }}
            >
              <Card.Body className="p-4">
                <h4 style={{ color: colors.darkGreen }}>Create Engaging Content</h4>
                <p className="text-muted mb-0">Focus on creating interactive lessons that keep students engaged throughout the course.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card 
              className="border-0 rounded-4 shadow-sm h-100"
              style={{ borderTop: `3px solid ${colors.primaryGreen}` }}
            >
              <Card.Body className="p-4">
                <h4 style={{ color: colors.darkGreen }}>Organize Your Material</h4>
                <p className="text-muted mb-0">Structure your content logically so students can follow a clear learning path.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card 
              className="border-0 rounded-4 shadow-sm h-100"
              style={{ borderTop: `3px solid ${colors.primaryGreen}` }}
            >
              <Card.Body className="p-4">
                <h4 style={{ color: colors.darkGreen }}>Include Practical Exercises</h4>
                <p className="text-muted mb-0">Add exercises that allow students to practice and apply what they've learned.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Latest Resources Section */}
        <Card className="border-0 shadow-sm rounded-4 mb-4">
          <Card.Header className="bg-white border-0 pt-4 pb-0 px-4">
            <h2 style={{ color: colors.darkGray }}>Latest Resources</h2>
          </Card.Header>
          <Card.Body className="p-4">
            <Row className="g-4">
              <Col md={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm rounded-3">
                  <Card.Body>
                    <Badge 
                      bg="light" 
                      className="mb-2" 
                      style={{ color: colors.primaryGreen }}
                    >
                      NEW
                    </Badge>
                    <h5>Instructor Handbook</h5>
                    <p className="text-muted small">A comprehensive guide to creating successful online courses</p>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      style={{
                        borderColor: colors.primaryGreen,
                        color: colors.primaryGreen
                      }}
                    >
                      Download PDF
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm rounded-3">
                  <Card.Body>
                    <h5>Video Production Tips</h5>
                    <p className="text-muted small">Learn how to create professional-quality videos for your courses</p>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      style={{
                        borderColor: colors.primaryGreen,
                        color: colors.primaryGreen
                      }}
                    >
                      View Guide
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm rounded-3">
                  <Card.Body>
                    <h5>Marketing Your Course</h5>
                    <p className="text-muted small">Strategies to promote your course and reach more students</p>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      style={{
                        borderColor: colors.primaryGreen,
                        color: colors.primaryGreen
                      }}
                    >
                      Read Article
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </Container>
  );
}

export default InstructorDashboard;