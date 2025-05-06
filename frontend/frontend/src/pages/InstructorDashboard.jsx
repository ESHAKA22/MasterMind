import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { getCourses, deleteCourse } from '../api';

function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await getCourses();
        setCourses(data); // In a real app with authentication, filter for instructor's courses
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
      } catch (error) {
        setError('Failed to delete course.');
      }
    }
  };

  // Professional color scheme
  const colors = {
    mediumBlue: '#0000cd',
    darkBlue: '#00008b',
    royalBlue: '#4169e1',
    dodgerBlue: '#1e90ff',
  };

  return (
    <Container className="py-5">
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 
          className="display-4 fw-bold" 
          style={{ color: colors.darkBlue }}
        >
          Instructor Dashboard
        </h1>
        <p 
          className="lead" 
          style={{ color: colors.mediumBlue }}
        >
          Manage your courses and track your teaching journey
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <Alert 
          variant="danger" 
          className="mb-4 rounded-3"
          style={{
            borderColor: colors.mediumBlue,
            backgroundColor: '#fff5f5',
            color: colors.darkBlue,
          }}
        >
          {error}
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="text-center mb-5">
        <Button 
          as={Link} 
          to="/add-course" 
          variant="primary"
          className="me-3"
          style={{
            backgroundColor: colors.royalBlue,
            borderColor: colors.royalBlue,
            padding: '10px 25px',
            fontWeight: '600',
            fontSize: '1.1rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 139, 0.1)'
          }}
        >
          Create New Course
        </Button>
        <Button 
          as={Link} 
          to="/courses" 
          variant="outline-primary"
          style={{
            borderColor: colors.royalBlue,
            color: colors.royalBlue,
            padding: '10px 25px',
            fontWeight: '600',
            fontSize: '1.1rem',
            borderRadius: '8px'
          }}
        >
          View All Courses
        </Button>
      </div>

      {/* Courses Section */}
      <Card className="border-0 shadow-sm mb-5">
        <Card.Header
          className="bg-white border-bottom-0 pt-4 pb-0 px-4"
          style={{ borderLeft: `5px solid ${colors.royalBlue}` }}
        >
          <h2 style={{ color: colors.darkBlue }}>Your Courses</h2>
        </Card.Header>
        <Card.Body className="p-4">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading your courses...</p>
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {courses.length > 0 ? (
                courses.map((course) => (
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
                          border: 
                            course.level === 'Beginner'
                              ? colors.mediumBlue
                              : course.level === 'Intermediate'
                              ? colors.dodgerBlue
                              : colors.royalBlue,
                          text: colors.darkBlue,
                          buttonBg: colors.royalBlue,
                          buttonHover: colors.dodgerBlue,
                        },
                      }}
                      showInstructorOptions={true}
                      onDelete={handleDelete}
                    />
                  </Col>
                ))
              ) : (
                <Col xs={12}>
                  <div 
                    className="text-center p-5 rounded-3" 
                    style={{ 
                      backgroundColor: '#f8f9fa',
                      color: colors.darkBlue 
                    }}
                  >
                    <p className="lead">
                      You haven't created any courses yet. Click "Create New Course" to get started.
                    </p>
                  </div>
                </Col>
              )}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Instructor Tips Section */}
      <Card className="border-0 shadow-sm">
        <Card.Header
          className="bg-white border-bottom-0 pt-4 pb-0 px-4"
          style={{ borderLeft: `5px solid ${colors.dodgerBlue}` }}
        >
          <h2 style={{ color: colors.darkBlue }}>Instructor Tips</h2>
        </Card.Header>
        <Card.Body className="p-4">
          <div className="row">
            <div className="col-md-4 mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <h4 style={{ color: colors.royalBlue }}>Create Engaging Content</h4>
                  <p>Focus on creating interactive lessons that keep students engaged throughout the course.</p>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4 mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <h4 style={{ color: colors.royalBlue }}>Organize Your Material</h4>
                  <p>Structure your content logically so students can follow a clear learning path.</p>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4 mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <h4 style={{ color: colors.royalBlue }}>Include Practical Exercises</h4>
                  <p>Add exercises that allow students to practice and apply what they've learned.</p>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default InstructorDashboard;