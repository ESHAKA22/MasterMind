import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Badge, Row, Col, ListGroup, Alert, Button, ProgressBar } from 'react-bootstrap';
import { getCourseById, getCourseContent, generateCourseContent } from '../api';
import { BsClock, BsGlobe, BsPeople, BsLaptop, BsFileEarmarkText, BsPlayCircle, 
         BsQuestionCircle, BsFilePdf, BsLockFill, BsUnlockFill, BsDownload } from 'react-icons/bs';

function CourseView() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [courseContent, setCourseContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    const fetchCourseAndContent = async () => {
      setLoading(true);
      try {
        // Fetch course details
        const courseData = await getCourseById(id);
        setCourse(courseData);
        
        // Fetch course content
        const contentData = await getCourseContent(id);
        
        // Check if there's significant content to determine if enrolled
        // In a real app, this would be based on user enrollment records
        const hasEnrolled = localStorage.getItem(`enrolled_${id}`) === 'true';
        setCourseContent(contentData || []);
        setEnrolled(hasEnrolled);
        
        // Set student count (in a real app this would come from the backend)
        // For now, generating a random number between 10-500
        setStudentCount(Math.floor(Math.random() * 490) + 10);
        
        // Set first lesson as active by default
        if (contentData && contentData.length > 0) {
          setActiveLesson(contentData[0]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseAndContent();
  }, [id]);

  const handleEnroll = async () => {
    try {
      setLoading(true);
      await generateCourseContent(id);
      
      // Refresh content after generating
      const contentData = await getCourseContent(id);
      setCourseContent(contentData || []);
      
      // Set enrollment in localStorage (in a real app this would be managed by the backend)
      localStorage.setItem(`enrolled_${id}`, 'true');
      setEnrolled(true);
      setError(null);

      // Set first lesson as active after enrolling
      if (contentData && contentData.length > 0) {
        setActiveLesson(contentData[0]);
      }
      
      // Increment student count
      setStudentCount(prevCount => prevCount + 1);

    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError('Failed to enroll in this course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine if lesson should be previewable
  const isPreviewable = (index, lesson) => {
    if (enrolled) return true;
    // Allow the first two lessons to be previewed
    return index < 2 || lesson.previewEnabled;
  };

  // Helper to render the appropriate icon for the lesson type
  const getLessonIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return <BsPlayCircle className="me-2 text-primary" />;
      case 'quiz':
        return <BsQuestionCircle className="me-2 text-warning" />;
      case 'pdf':
        return <BsFilePdf className="me-2 text-danger" />;
      default:
        return <BsFileEarmarkText className="me-2 text-info" />;
    }
  };

  // Professional color scheme
  const colors = {
    mediumBlue: '#0000cd',
    darkBlue: '#00008b',
    royalBlue: '#4169e1',
    dodgerBlue: '#1e90ff',
  };

  if (loading && !course) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading course content...</p>
      </Container>
    );
  }

  if (error && !course) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Course not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Course Banner/Header Section */}
      <Card className="border-0 overflow-hidden shadow-sm mb-5">
        <div 
          className="bg-gradient text-white p-5 d-flex flex-column justify-content-end"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 139, 0.8), rgba(65, 105, 225, 0.7)), url(${course.imagePath || 'https://via.placeholder.com/1200x400'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '300px'
          }}
        >
          <div className="position-relative z-1">
            <h1 className="display-4 fw-bold mb-3">{course.title}</h1>
            <div className="d-flex flex-wrap gap-3 mb-4">
              <Badge 
                bg="light" 
                text="dark"
                className="fw-medium py-2 px-3"
              >
                <BsLaptop className="me-1" /> {course.category || 'General'}
              </Badge>
              <Badge 
                bg="light" 
                text="dark"
                className="fw-medium py-2 px-3"
              >
                <BsClock className="me-1" /> {course.duration || 'Self-paced'}
              </Badge>
              <Badge 
                bg="light" 
                text="dark"
                className="fw-medium py-2 px-3"
              >
                <BsGlobe className="me-1" /> {course.language || 'English'}
              </Badge>
              <Badge 
                bg="light" 
                text="dark"
                className="fw-medium py-2 px-3"
              >
                <BsPeople className="me-1" /> {studentCount}+ students enrolled
              </Badge>
            </div>
            
            {/* Skill Level Badge */}
            <Badge 
              bg="primary" 
              className="fw-medium py-2 px-3 mb-4"
              style={{
                backgroundColor: 
                  course.level === 'Beginner' ? '#28a745' :
                  course.level === 'Intermediate' ? '#fd7e14' : '#dc3545'
              }}
            >
              {course.level || 'All Levels'}
            </Badge>
          </div>
        </div>
      </Card>

      <Row className="mb-5">
        {/* Course Overview Section - Left Column */}
        <Col lg={8}>
          {/* Course Description */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header 
              className="bg-white border-bottom-0 pt-4 pb-0 px-4"
              style={{ borderLeft: `5px solid ${colors.royalBlue}` }}
            >
              <h2 style={{ color: colors.darkBlue }}>Course Overview</h2>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="mb-4">
                <p className="lead">{course.description}</p>
              </div>

              {/* Tags Section */}
              {course.tags && course.tags.length > 0 && (
                <div className="mb-4">
                  <h5>Topics Covered:</h5>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {course.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        bg="light" 
                        text="dark"
                        className="rounded-pill px-3 py-2"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Course Info */}
              <div className="d-flex flex-wrap gap-4">
                <div>
                  <h5 className="mb-2">Duration</h5>
                  <p className="text-muted d-flex align-items-center">
                    <BsClock className="me-2" /> {course.duration || 'Self-paced'}
                  </p>
                </div>
                <div>
                  <h5 className="mb-2">Language</h5>
                  <p className="text-muted d-flex align-items-center">
                    <BsGlobe className="me-2" /> {course.language || 'English'}
                  </p>
                </div>
                <div>
                  <h5 className="mb-2">Skill Level</h5>
                  <p className="text-muted">{course.level || 'All Levels'}</p>
                </div>
                <div>
                  <h5 className="mb-2">Students</h5>
                  <p className="text-muted d-flex align-items-center">
                    <BsPeople className="me-2" /> {studentCount}+ enrolled
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Active Lesson Content */}
          {activeLesson && (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header 
                className="bg-white border-bottom-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center"
                style={{ borderLeft: `5px solid ${colors.dodgerBlue}` }}
              >
                <div>
                  <h3 style={{ color: colors.darkBlue }}>{activeLesson.title}</h3>
                  <div className="d-flex align-items-center text-muted mt-1">
                    {getLessonIcon(activeLesson.contentType)}
                    <span>{activeLesson.contentType} • {activeLesson.duration || '10 minutes'}</span>
                  </div>
                </div>
                {activeLesson.resourceUrl && (
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="d-flex align-items-center"
                  >
                    <BsDownload className="me-2" />
                    Resources
                  </Button>
                )}
              </Card.Header>
              <Card.Body className="p-4">
                {enrolled || isPreviewable(0, activeLesson) ? (
                  <div className="mb-3">
                    {activeLesson.contentType?.toLowerCase() === 'video' && activeLesson.videoUrl ? (
                      <div className="ratio ratio-16x9 mb-4">
                        <iframe 
                          src={activeLesson.videoUrl} 
                          title={activeLesson.title} 
                          allowFullScreen
                          className="rounded-3"
                        ></iframe>
                      </div>
                    ) : (
                      <div 
                        className="p-3 rounded-3 border" 
                        style={{ backgroundColor: '#f8f9fa' }}
                        dangerouslySetInnerHTML={{ __html: activeLesson.content }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-center py-5 border rounded-3">
                    <BsLockFill size={24} className="text-secondary mb-3" />
                    <h4>This lesson is locked</h4>
                    <p className="text-muted mb-4">Enroll in this course to unlock all content</p>
                    <Button 
                      variant="primary"
                      onClick={handleEnroll}
                      style={{
                        backgroundColor: colors.royalBlue,
                        borderColor: colors.royalBlue
                      }}
                    >
                      Enroll Now
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Course Syllabus Section - Right Column */}
        <Col lg={4}>
          {/* Enroll/Progress Card */}
          <Card className="border-0 shadow-sm mb-4 position-sticky" style={{ top: '20px' }}>
            <Card.Body className="p-4">
              {enrolled ? (
                <div>
                  <h3 className="mb-3">Course Progress</h3>
                  <div className="mb-3">
                    <ProgressBar 
                      now={10} // This would be calculated based on completed lessons
                      label={`10%`}
                      variant="primary"
                      style={{ height: '8px' }}
                      className="mb-2"
                    />
                    <p className="text-muted small text-center">1 of {courseContent.length} lessons completed</p>
                  </div>
                  <Button 
                    variant="primary" 
                    className="w-100"
                    style={{
                      backgroundColor: colors.royalBlue,
                      borderColor: colors.royalBlue
                    }}
                  >
                    Continue Learning
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="mb-3">Enroll in this Course</h3>
                  <p className="mb-4">Gain access to all course materials and resources</p>
                  <Button 
                    variant="primary" 
                    className="w-100 mb-3"
                    size="lg"
                    onClick={handleEnroll}
                    disabled={loading}
                    style={{
                      backgroundColor: colors.royalBlue,
                      borderColor: colors.royalBlue,
                      padding: '12px',
                      fontWeight: '600'
                    }}
                  >
                    {loading ? 'Processing...' : 'Enroll Now - Free'}
                  </Button>
                  <p className="text-muted small mt-2">
                    Preview available for the first two lessons
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Course Syllabus */}
          <Card className="border-0 shadow-sm">
            <Card.Header 
              className="bg-white border-bottom-0 pt-4 pb-0 px-4"
              style={{ borderLeft: `5px solid ${colors.royalBlue}` }}
            >
              <h2 style={{ color: colors.darkBlue }}>Course Contents</h2>
              <p className="text-muted">{courseContent.length} lessons • {course.duration || 'Self-paced'}</p>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                {courseContent && courseContent.length > 0 ? (
                  courseContent.map((content, index) => (
                    <ListGroup.Item 
                      key={content.id} 
                      action
                      onClick={() => isPreviewable(index, content) && setActiveLesson(content)}
                      active={activeLesson && activeLesson.id === content.id}
                      className="px-4 py-3 d-flex justify-content-between align-items-center"
                      disabled={!isPreviewable(index, content)}
                      style={{
                        cursor: isPreviewable(index, content) ? 'pointer' : 'not-allowed',
                        backgroundColor: activeLesson && activeLesson.id === content.id ? '#e9ecef' : 'white'
                      }}
                    >
                      <div className="d-flex align-items-center flex-grow-1">
                        <div className="me-2 fs-5">
                          {getLessonIcon(content.contentType)}
                        </div>
                        <div>
                          <div className="fw-medium">{content.title}</div>
                          <div className="small text-muted d-flex align-items-center gap-2">
                            <span>{content.contentType}</span>
                            {content.duration && (
                              <>
                                <span>•</span>
                                <span>{content.duration}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        {isPreviewable(index, content) ? (
                          <BsUnlockFill className="text-success" />
                        ) : (
                          <BsLockFill className="text-secondary" />
                        )}
                      </div>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item className="text-center py-5">
                    <p className="mb-0">No lessons available yet.</p>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      )}
    </Container>
  );
}

export default CourseView;