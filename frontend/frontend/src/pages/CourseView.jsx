import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Badge, Row, Col, ListGroup, Alert, Button, ProgressBar, Nav } from 'react-bootstrap';
import { getCourseById, getCourseContent, generateCourseContent, markLessonComplete, markLessonIncomplete } from '../api';
import { BsClock, BsGlobe, BsPeople, BsLaptop, BsFileEarmarkText, BsPlayCircle, 
         BsQuestionCircle, BsFilePdf, BsLockFill, BsUnlockFill, BsDownload, BsCheckCircle, BsListUl } from 'react-icons/bs';
import LessonCard from '../components/LessonCard'; // Import the LessonCard component

function CourseView() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [courseContent, setCourseContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [activeLesson, setActiveLesson] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  
  // Add ref for the lessons section
  const lessonsSectionRef = useRef(null);

  // Function to scroll to lessons section
  const scrollToLessons = () => {
    lessonsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  

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

        // Calculate progress
        if (contentData && contentData.length > 0) {
          const completed = contentData.filter(lesson => lesson.completed);
          setCompletedLessons(completed);
          setProgress(Math.round((completed.length / contentData.length) * 100));
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
      
      // In a real app, you would make an API call to enroll the user
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

  // Handler for marking lessons as complete/incomplete
  const handleLessonCompletion = async (lessonId, isComplete) => {
    try {
      if (isComplete) {
        await markLessonComplete(lessonId);
        
        // Update local state
        setCompletedLessons([...completedLessons, lessonId]);
        setCourseContent(courseContent.map(lesson => 
          lesson.id === lessonId ? {...lesson, completed: true} : lesson
        ));
      } else {
        await markLessonIncomplete(lessonId);
        
        // Update local state
        setCompletedLessons(completedLessons.filter(id => id !== lessonId));
        setCourseContent(courseContent.map(lesson => 
          lesson.id === lessonId ? {...lesson, completed: false} : lesson
        ));
      }
      
      // Recalculate progress
      const updatedCompleted = courseContent.filter(lesson => 
        lesson.id === lessonId ? isComplete : lesson.completed
      );
      setProgress(Math.round((updatedCompleted.length / courseContent.length) * 100));
      
    } catch (err) {
      console.error('Error updating lesson completion status:', err);
      setError('Failed to update lesson completion status.');
    }
  };

  // Helper to determine if lesson should be previewable
  const isPreviewable = (index, lesson) => {
    if (enrolled) return true;
    // Allow the first two lessons to be previewed
    return index < 2 || lesson.previewEnabled;
  };

  // Navigate to next lesson
  const goToNextLesson = () => {
    if (!activeLesson || !courseContent.length) return;
    
    const currentIndex = courseContent.findIndex(lesson => lesson.id === activeLesson.id);
    if (currentIndex < courseContent.length - 1) {
      setActiveLesson(courseContent[currentIndex + 1]);
    }
  };

  // Navigate to previous lesson
  const goToPrevLesson = () => {
    if (!activeLesson || !courseContent.length) return;
    
    const currentIndex = courseContent.findIndex(lesson => lesson.id === activeLesson.id);
    if (currentIndex > 0) {
      setActiveLesson(courseContent[currentIndex - 1]);
    }
  };

  // Green color scheme
  const colors = {
    primary: '#198754',    // Dark Green
    light: '#d1e7dd',      // Light Green
    dark: '#1b5e20',       // Deep Green
    white: '#ffffff',
    lightGray: '#f8f9fa',
    darkGray: '#212529',
  };

  if (loading && !course) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" style={{ color: colors.primary }} role="status">
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
    <div style={{ backgroundColor: colors.lightGray }}>
      <Container className="py-5">
        {/* Course Banner/Header Section */}
        <Card className="border-0 overflow-hidden shadow-lg mb-5 rounded-4">
          <div 
            className="text-white p-5 d-flex flex-column justify-content-end"
            style={{
              backgroundImage: `linear-gradient(rgba(27, 94, 32, 0.85), rgba(25, 135, 84, 0.7)), url(${course.imagePath || 'https://via.placeholder.com/1200x400'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '320px',
              borderRadius: '1rem 1rem 0 0'
            }}
          >
            <div className="position-relative z-1">
              <h1 className="display-4 fw-bold mb-3">{course.title}</h1>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Badge 
                  bg="light" 
                  text="dark"
                  className="fw-medium py-2 px-3 rounded-pill"
                >
                  <BsLaptop className="me-1" /> {course.category || 'General'}
                </Badge>
                <Badge 
                  bg="light" 
                  text="dark"
                  className="fw-medium py-2 px-3 rounded-pill"
                >
                  <BsClock className="me-1" /> {course.duration || 'Self-paced'}
                </Badge>
                <Badge 
                  bg="light" 
                  text="dark"
                  className="fw-medium py-2 px-3 rounded-pill"
                >
                  <BsGlobe className="me-1" /> {course.language || 'English'}
                </Badge>
                <Badge 
                  bg="light" 
                  text="dark"
                  className="fw-medium py-2 px-3 rounded-pill"
                >
                  <BsPeople className="me-1" /> {studentCount}+ students enrolled
                </Badge>
              </div>
              
              {/* Skill Level Badge */}
              <Badge 
                className="fw-medium py-2 px-3 rounded-pill mb-4"
                style={{
                  backgroundColor: 
                    course.level === 'Beginner' ? colors.primary :
                    course.level === 'Intermediate' ? '#fd7e14' : '#dc3545'
                }}
              >
                {course.level || 'All Levels'}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Add Navigation Bar */}
        <Nav className="mb-4 border-0 bg-white rounded-4 shadow-sm p-2">
          <Nav.Item>
            <Button 
              variant="link" 
              className="text-decoration-none px-4 py-2 text-dark fw-medium"
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
              style={{ color: colors.dark }}
            >
              Overview
            </Button>
          </Nav.Item>
          <Nav.Item>
            <Button 
              variant="link" 
              className="text-decoration-none px-4 py-2 text-dark fw-medium"
              onClick={scrollToLessons}
              style={{ color: colors.dark }}
            >
              <BsListUl className="me-2" /> Lessons
            </Button>
          </Nav.Item>
        </Nav>

        <Row className="mb-5 g-4">
          {/* Course Overview Section - Left Column */}
          <Col lg={8}>
            {/* Course Description */}
            <Card className="border-0 shadow-sm mb-4 rounded-4 overflow-hidden">
              <Card.Header 
                className="border-bottom-0 pt-4 pb-0 px-4"
                style={{ 
                  backgroundColor: colors.light,
                  borderLeft: `0px solid ${colors.primary}` 
                }}
              >
                <h2 style={{ color: colors.dark }} className="fw-bold">Course Overview</h2>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="mb-4">
                  <p className="lead">{course.description}</p>
                </div>

                {/* Tags Section */}
                {course.tags && course.tags.length > 0 && (
                  <div className="mb-4">
                    <h5 className="fw-bold" style={{ color: colors.dark }}>Topics Covered:</h5>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {course.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          bg="light" 
                          text="dark"
                          className="rounded-pill px-3 py-2"
                          style={{ backgroundColor: colors.light, color: colors.primary }}
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
                    <h5 className="mb-2 fw-bold" style={{ color: colors.dark }}>Duration</h5>
                    <p className="text-muted d-flex align-items-center">
                      <BsClock className="me-2" style={{ color: colors.primary }} /> {course.duration || 'Self-paced'}
                    </p>
                  </div>
                  <div>
                    <h5 className="mb-2 fw-bold" style={{ color: colors.dark }}>Language</h5>
                    <p className="text-muted d-flex align-items-center">
                      <BsGlobe className="me-2" style={{ color: colors.primary }} /> {course.language || 'English'}
                    </p>
                  </div>
                  <div>
                    <h5 className="mb-2 fw-bold" style={{ color: colors.dark }}>Skill Level</h5>
                    <p className="text-muted">{course.level || 'All Levels'}</p>
                  </div>
                  <div>
                    <h5 className="mb-2 fw-bold" style={{ color: colors.dark }}>Students</h5>
                    <p className="text-muted d-flex align-items-center">
                      <BsPeople className="me-2" style={{ color: colors.primary }} /> {studentCount}+ enrolled
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Active Lesson Content */}
            {activeLesson && (
              <Card className="border-0 shadow-sm mb-4 rounded-4 overflow-hidden">
                <Card.Header 
                  className="border-bottom-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: colors.light }}
                >
                  <div>
                    <h3 style={{ color: colors.dark }} className="fw-bold">{activeLesson.title}</h3>
                    <div className="d-flex align-items-center text-muted mt-1">
                      {activeLesson.lessonType && (
                        <>
                          <span>{activeLesson.lessonType}</span>
                          {activeLesson.duration && <span> • {activeLesson.duration}</span>}
                        </>
                      )}
                    </div>
                  </div>
                  {activeLesson.resourceUrl && (
                    <Button 
                      variant="outline-success" 
                      size="sm" 
                      className="d-flex align-items-center"
                      href={activeLesson.resourceUrl}
                      target="_blank"
                      style={{ 
                        borderColor: colors.primary, 
                        color: colors.primary 
                      }}
                    >
                      <BsDownload className="me-2" />
                      Resources
                    </Button>
                  )}
                </Card.Header>
                <Card.Body className="p-4">
                  {enrolled || isPreviewable(0, activeLesson) ? (
                    <div className="mb-3">
                      {activeLesson.lessonType === 'Video' && activeLesson.videoUrl ? (
                        <div className="ratio ratio-16x9 mb-4">
                          <iframe 
                            src={activeLesson.videoUrl} 
                            title={activeLesson.title} 
                            allowFullScreen
                            className="rounded-4"
                          ></iframe>
                        </div>
                      ) : activeLesson.lessonType === 'Quiz' && activeLesson.quizLink ? (
                        <div 
                          className="p-4 rounded-4 border" 
                          style={{ backgroundColor: colors.white }}
                          dangerouslySetInnerHTML={{ __html: activeLesson.quizLink }}
                        />
                      ) : (
                        <div 
                          className="p-4 rounded-4 border" 
                          style={{ backgroundColor: colors.white }}
                          dangerouslySetInnerHTML={{ __html: activeLesson.content }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-5 border rounded-4" style={{ backgroundColor: colors.white }}>
                      <BsLockFill size={32} style={{ color: colors.primary }} className="mb-3" />
                      <h4 className="fw-bold">This lesson is locked</h4>
                      <p className="text-muted mb-4">Enroll in this course to unlock all content</p>
                      <Button 
                        className="px-4 py-2 rounded-pill"
                        onClick={handleEnroll}
                        style={{
                          backgroundColor: colors.primary,
                          borderColor: colors.primary
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
            <Card className="border-0 shadow-sm mb-4 rounded-4 position-sticky" style={{ top: '20px' }}>
              <Card.Body className="p-4">
                {enrolled ? (
                  <div>
                    <h3 className="mb-3 fw-bold" style={{ color: colors.dark }}>Course Progress</h3>
                    <div className="mb-3">
                      <ProgressBar 
                        now={progress}
                        label={`${progress}%`}
                        style={{ height: '10px', backgroundColor: '#e9ecef' }}
                        className="mb-2 rounded-pill"
                        variant="success"
                      />
                      <p className="text-muted small text-center mt-2">
                        {completedLessons.length} of {courseContent.length} lessons completed
                      </p>
                    </div>
                    {activeLesson && (
                      <>
                        <Button 
                          className="w-100 mb-3 py-2 rounded-pill"
                          onClick={() => handleLessonCompletion(activeLesson.id, !activeLesson.completed)}
                          style={{
                            backgroundColor: activeLesson.completed ? colors.dark : colors.primary,
                            borderColor: activeLesson.completed ? colors.dark : colors.primary
                          }}
                        >
                          {activeLesson.completed ? (
                            <>
                              <BsCheckCircle className="me-2" /> Completed
                            </>
                          ) : (
                            'Mark as Complete'
                          )}
                        </Button>
                        <div className="d-flex justify-content-between">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            className="rounded-pill px-3"
                            onClick={goToPrevLesson}
                            disabled={courseContent.findIndex(lesson => lesson.id === activeLesson.id) === 0}
                          >
                            Previous Lesson
                          </Button>
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            className="rounded-pill px-3"
                            onClick={goToNextLesson}
                            disabled={courseContent.findIndex(lesson => lesson.id === activeLesson.id) === courseContent.length - 1}
                            style={{ 
                              borderColor: colors.primary, 
                              color: colors.primary 
                            }}
                          >
                            Next Lesson
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <h3 className="mb-3 fw-bold" style={{ color: colors.dark }}>Enroll in this Course</h3>
                    <p className="mb-4">Gain access to all course materials and resources</p>
                    <Button 
                      className="w-100 mb-3 py-3 rounded-pill"
                      size="lg"
                      onClick={handleEnroll}
                      disabled={loading}
                      style={{
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
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
            <Card className="border-0 shadow-sm rounded-4" ref={lessonsSectionRef}>
              <Card.Header 
                className="border-bottom-0 pt-4 pb-0 px-4"
                style={{ backgroundColor: colors.light }}
              >
                <h2 className="fw-bold" style={{ color: colors.dark }}>Course Contents</h2>
                <p className="text-muted">{courseContent.length} lessons • {course.duration || 'Self-paced'}</p>
              </Card.Header>
              <Card.Body className="p-4">
                {/* Use the LessonCard component to display lessons */}
                {courseContent && courseContent.length > 0 ? (
                  courseContent.map((content, index) => (
                    <div 
                      key={content.id || index}
                      className={`lesson-card mb-3 p-3 rounded-4 shadow-sm border-0 ${activeLesson && activeLesson.id === content.id ? 'active' : ''}`}
                      style={{ 
                        backgroundColor: activeLesson && activeLesson.id === content.id ? colors.light : colors.white,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => setActiveLesson(content)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          {!isPreviewable(index, content) && !enrolled ? (
                            <BsLockFill className="me-3" style={{ color: colors.primary }} />
                          ) : content.completed ? (
                            <BsCheckCircle className="me-3" style={{ color: colors.primary }} />
                          ) : (
                            <div className="me-3 rounded-circle d-flex align-items-center justify-content-center" 
                              style={{ 
                                width: '24px', 
                                height: '24px', 
                                backgroundColor: colors.light,
                                color: colors.primary,
                                border: `1px solid ${colors.primary}`
                              }}>
                              {index + 1}
                            </div>
                          )}
                          <div>
                            <h6 className="mb-1 fw-bold" style={{ color: colors.dark }}>{content.title}</h6>
                            <div className="d-flex align-items-center small text-muted">
                              {content.lessonType === 'Video' ? (
                                <><BsPlayCircle className="me-1" /> Video</>
                              ) : content.lessonType === 'Quiz' ? (
                                <><BsQuestionCircle className="me-1" /> Quiz</>
                              ) : content.lessonType === 'PDF' ? (
                                <><BsFilePdf className="me-1" /> PDF</>
                              ) : (
                                <><BsFileEarmarkText className="me-1" /> Reading</>
                              )}
                              {content.duration && <span className="ms-2">• {content.duration}</span>}
                            </div>
                          </div>
                        </div>
                        {!isPreviewable(index, content) && !enrolled ? (
                          <BsLockFill style={{ color: '#adb5bd' }} />
                        ) : (
                          <div className="ms-2 d-flex align-items-center">
                            {content.completed && (
                              <Badge bg="success" pill>Completed</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <p className="mb-0">No lessons available yet.</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="mt-4 rounded-4">
            {error}
          </Alert>
        )}
        
        {/* Add some CSS for the lesson card */}
        <style>{`
          .lesson-card {
            transition: all 0.2s ease-in-out;
          }
          .lesson-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08) !important;
          }
          .lesson-card.active {
            border-left: 4px solid ${colors.primary} !important;
          }
          .progress-bar {
            background-color: ${colors.primary} !important;
          }
        `}</style>
      </Container>
    </div>
  );
}

export default CourseView;