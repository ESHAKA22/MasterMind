import { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import CourseCard from '../components/CourseCard';
import { getCourses, deleteCourse } from '../api';

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data); // Add client-side filtering if needed
      } catch (error) {
        setError('Failed to fetch courses.');
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
          My Courses
        </h1>
        <p 
          className="lead" 
          style={{ color: colors.mediumBlue }}
        >
          Manage your created courses and track your teaching journey
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

      {/* Courses Grid */}
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
          <Col>
            <div 
              className="text-center p-5 rounded-3" 
              style={{ 
                backgroundColor: '#f8f9fa',
                color: colors.darkBlue 
              }}
            >
              <p className="lead">
                No courses available. Start creating your first course!
              </p>
            </div>
          </Col>
        )}
      </Row>

      {/* Custom CSS */}
      <style jsx>{`
        .btn-primary {
          background-color: ${colors.royalBlue} !important;
          border-color: ${colors.royalBlue} !important;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
        }

        .btn-primary:hover {
          background-color: ${colors.dodgerBlue} !important;
          border-color: ${colors.dodgerBlue} !important;
        }

        @media (max-width: 768px) {
          .lead {
            font-size: 1rem;
          }
        }
      `}</style>
    </Container>
  );
}

export default MyCourses;