import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Row, Col, Badge, Alert, ProgressBar } from 'react-bootstrap';
import { createCourse, addContentToCourse } from '../api';
import LessonForm from '../components/LessonForm';
import { BsPlusCircle, BsCheckCircleFill, BsArrowLeft, BsArrowRight } from 'react-icons/bs';

function AddCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  
  // Form fields
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    image: null,
    duration: '',
    language: '',
    level: '',
    tags: []
  });
  
  // Lessons
  const [lessons, setLessons] = useState([{
    title: '',
    lessonType: 'Video',
    duration: '',
    videoUrl: '',
    previewEnabled: false,
    resourceUrl: '',
    quizLink: '',
    content: '',
    contentType: 'text',
    order: 1
  }]);

  // For tag input
  const [tagInput, setTagInput] = useState('');
  
  // Custom color scheme
  const colors = {
    primaryGreen: '#198754',
    lightGreen: '#d1e7dd',
    darkGreen: '#1b5e20',
    white: '#ffffff',
    lightGray: '#f8f9fa',
    darkGray: '#212529'
  };
  
  // Handle input changes for course data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value
    });
  };
  
  // Handle file input
  const handleFileChange = (e) => {
    setCourseData({
      ...courseData,
      image: e.target.files[0]
    });
  };
  
  // Handle tag input
  const addTag = () => {
    if (tagInput.trim() && !courseData.tags.includes(tagInput.trim())) {
      setCourseData({
        ...courseData,
        tags: [...courseData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };
  
  // Remove tag
  const removeTag = (tagToRemove) => {
    setCourseData({
      ...courseData,
      tags: courseData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Add lesson
  const handleAddLesson = () => {
    setLessons([
      ...lessons, 
      {
        title: '',
        lessonType: 'Video',
        duration: '',
        videoUrl: '',
        previewEnabled: false,
        resourceUrl: '',
        quizLink: '',
        content: '',
        contentType: 'text',
        order: lessons.length + 1
      }
    ]);
  };

  // Remove lesson
  const handleRemoveLesson = (index) => {
    const updatedLessons = [...lessons];
    updatedLessons.splice(index, 1);
    
    // Re-order the lessons
    const reorderedLessons = updatedLessons.map((lesson, idx) => ({
      ...lesson,
      order: idx + 1
    }));
    
    setLessons(reorderedLessons);
  };

  // Update lesson data
  const handleLessonChange = (index, lessonData, videoFile, resourceFile) => {
    const updatedLessons = [...lessons];
    updatedLessons[index] = {
      ...lessonData,
      videoFile,
      resourceFile
    };
    setLessons(updatedLessons);
  };
  
  // Duration options
  const durationOptions = [
    'Select Duration',
    '1-3 hours',
    '3-6 hours',
    '6-10 hours',
    '10-15 hours',
    '15-20 hours',
    'Self-paced',
    '1 week',
    '2 weeks',
    '4 weeks',
    '6 weeks',
    '8 weeks',
    '10 weeks',
    '12 weeks'
  ];
  
  // Language options
  const languageOptions = [
    'Select Language',
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Korean',
    'Arabic',
    'Russian',
    'Portuguese',
    'Hindi'
  ];
  
  // Handle next step
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('duration', courseData.duration);
      formData.append('language', courseData.language);
      formData.append('level', courseData.level);
      formData.append('tags', JSON.stringify(courseData.tags));
      
      if (courseData.image) {
        formData.append('image', courseData.image);
      }
      
      // Call API to create course
      const createdCourse = await createCourse(formData);
      
      // Add lessons as course content
      for (const lesson of lessons) {
        if (lesson.title) {
          const contentData = {
            title: lesson.title,
            contentType: lesson.lessonType.toLowerCase(),
            content: lesson.content || lesson.videoUrl || lesson.quizLink,
            order: lesson.order
          };
          
          await addContentToCourse(createdCourse.id, contentData);
        }
      }
      
      // Navigate to instructor dashboard on success
      navigate('/instructor');
    } catch (err) {
      console.error('Error creating course:', err);
      setError('Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: colors.lightGray, minHeight: '100vh' }}>
      <Container className="py-5">
        {/* Page Header */}
        <div className="text-center mb-5">
          <h1 
            className="display-4 fw-bold" 
            style={{ color: colors.darkGreen }}
          >
            Create New Course
          </h1>
          <p 
            className="lead" 
            style={{ color: colors.primaryGreen }}
          >
            Share your knowledge and expertise with our community
          </p>
        </div>
        
        {/* Progress Tracker */}
        <div className="mb-5">
          <ProgressBar 
            now={(currentStep / totalSteps) * 100} 
            variant="success" 
            style={{ height: '8px' }} 
            className="mb-3"
          />
          <Row className="justify-content-between">
            <Col xs={6} className="d-flex align-items-center">
              <div className="position-relative">
                <div className={`rounded-circle d-flex align-items-center justify-content-center ${currentStep >= 1 ? 'bg-success' : 'bg-secondary'}`} 
                  style={{ width: '40px', height: '40px', color: '#fff' }}>
                  {currentStep > 1 ? <BsCheckCircleFill size={24} /> : '1'}
                </div>
              </div>
              <div className="ms-3">
                <h6 className="mb-0 fw-bold" style={{ color: currentStep >= 1 ? colors.darkGreen : colors.darkGray }}>
                  Course Information
                </h6>
                <small className="text-muted">Basic details</small>
              </div>
            </Col>
            
            <Col xs={6} className="d-flex align-items-center justify-content-end">
              <div className="text-end me-3">
                <h6 className="mb-0 fw-bold" style={{ color: currentStep >= 2 ? colors.darkGreen : colors.darkGray }}>
                  Course Lessons
                </h6>
                <small className="text-muted">Content structure</small>
              </div>
              <div className="position-relative">
                <div className={`rounded-circle d-flex align-items-center justify-content-center ${currentStep >= 2 ? 'bg-success' : 'bg-secondary'}`} 
                  style={{ width: '40px', height: '40px', color: '#fff' }}>
                  {currentStep > 2 ? <BsCheckCircleFill size={24} /> : '2'}
                </div>
              </div>
            </Col>
          </Row>
        </div>
        
        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        {/* Step 1: Course Information */}
        {currentStep === 1 && (
          <Card className="shadow border-0 mb-5">
            <Card.Header 
              style={{ 
                backgroundColor: colors.lightGreen, 
                borderBottom: 'none',
                borderLeft: `5px solid ${colors.primaryGreen}`,
                padding: '1.5rem 1.5rem 1rem'
              }}
            >
              <h2 style={{ color: colors.darkGreen }}>Basic Course Information</h2>
              <p className="text-muted mb-0">Fill in the details to help students find your course</p>
            </Card.Header>
            
            <Card.Body className="p-4">
              <Form>
                <Row className="gx-4">
                  <Col md={6}>
                    {/* Course Title */}
                    <Form.Group className="mb-4" controlId="courseTitle">
                      <Form.Label className="fw-bold">Course Title*</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={courseData.title}
                        onChange={handleChange}
                        placeholder="Enter a descriptive title"
                        required
                        className="shadow-sm"
                      />
                      <Form.Text className="text-muted">
                        Keep it clear and concise (50-60 characters)
                      </Form.Text>
                    </Form.Group>
                    
                    {/* Course Description */}
                    <Form.Group className="mb-4" controlId="courseDescription">
                      <Form.Label className="fw-bold">Course Description*</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        value={courseData.description}
                        onChange={handleChange}
                        placeholder="Describe what students will learn"
                        required
                        className="shadow-sm"
                        rows={5}
                      />
                      <Form.Text className="text-muted">
                        Clearly explain what skills they'll gain and problems they'll solve
                      </Form.Text>
                    </Form.Group>
                    
                    {/* Course Duration */}
                    <Form.Group className="mb-4" controlId="courseDuration">
                      <Form.Label className="fw-bold">Course Duration*</Form.Label>
                      <Form.Select
                        name="duration"
                        value={courseData.duration}
                        onChange={handleChange}
                        required
                        className="shadow-sm"
                      >
                        {durationOptions.map((option) => (
                          <option key={option} value={option === 'Select Duration' ? '' : option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    {/* Course Image */}
                    <Form.Group className="mb-4" controlId="courseImage">
                      <Form.Label className="fw-bold">Course Image</Form.Label>
                      <div className="border rounded bg-white p-3 mb-2">
                        {courseData.image ? (
                          <div className="text-center p-3 bg-light rounded">
                            <div className="mb-2">
                              <img 
                                src={URL.createObjectURL(courseData.image)} 
                                alt="Course preview" 
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '150px',
                                  objectFit: 'contain'
                                }}
                              />
                            </div>
                            <div className="small text-muted">{courseData.image.name}</div>
                          </div>
                        ) : (
                          <div className="text-center p-4 border-dashed bg-light rounded">
                            <p className="text-muted mb-0">Upload a cover image</p>
                          </div>
                        )}
                        <div className="mt-2">
                          <Form.Control
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="shadow-sm"
                          />
                          <Form.Text className="text-muted">
                            Recommended size: 1280×720 pixels (16:9 ratio)
                          </Form.Text>
                        </div>
                      </div>
                    </Form.Group>
                    
                    <Row>
                      <Col md={6}>
                        {/* Course Language */}
                        <Form.Group className="mb-4" controlId="courseLanguage">
                          <Form.Label className="fw-bold">Language*</Form.Label>
                          <Form.Select
                            name="language"
                            value={courseData.language}
                            onChange={handleChange}
                            required
                            className="shadow-sm"
                          >
                            {languageOptions.map((option) => (
                              <option key={option} value={option === 'Select Language' ? '' : option}>
                                {option}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        {/* Course Level */}
                        <Form.Group className="mb-4" controlId="courseLevel">
                          <Form.Label className="fw-bold">Skill Level*</Form.Label>
                          <Form.Select
                            name="level"
                            value={courseData.level}
                            onChange={handleChange}
                            required
                            className="shadow-sm"
                          >
                            <option value="">Select Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    {/* Tags Input */}
                    <Form.Group className="mb-4" controlId="courseTags">
                      <Form.Label className="fw-bold">Tags</Form.Label>
                      <div className="d-flex">
                        <Form.Control
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Add relevant keywords"
                          className="shadow-sm me-2"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                        />
                        <Button 
                          variant="success"
                          onClick={addTag}
                          className="px-3"
                        >
                          Add
                        </Button>
                      </div>
                      
                      {/* Display tags */}
                      <div className="mt-3">
                        {courseData.tags.length > 0 ? (
                          <div className="d-flex flex-wrap gap-2">
                            {courseData.tags.map((tag) => (
                              <Badge 
                                key={tag} 
                                bg="success" 
                                className="px-3 py-2 d-flex align-items-center"
                                style={{ fontSize: '0.85rem' }}
                              >
                                {tag}
                                <span
                                  role="button"
                                  onClick={() => removeTag(tag)}
                                  className="ms-2 fw-bold"
                                >
                                  &times;
                                </span>
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <div className="small text-muted mt-2">Add tags to help students discover your course</div>
                        )}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-flex justify-content-between mt-4 border-top pt-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/instructor')} 
                    className="d-flex align-items-center"
                  >
                    <BsArrowLeft className="me-2" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleNext}
                    variant="success"
                    className="d-flex align-items-center"
                  >
                    Next: Add Lessons
                    <BsArrowRight className="ms-2" />
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}
        
        {/* Step 2: Course Lessons */}
        {currentStep === 2 && (
          <Card className="shadow border-0 mb-5">
            <Card.Header 
              style={{ 
                backgroundColor: colors.lightGreen, 
                borderBottom: 'none',
                borderLeft: `5px solid ${colors.primaryGreen}`,
                padding: '1.5rem 1.5rem 1rem'
              }}
            >
              <h2 style={{ color: colors.darkGreen }}>Course Content</h2>
              <p className="text-muted mb-0">Structure your course with lessons and materials</p>
            </Card.Header>
            
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                {/* Overview card */}
                <Card className="bg-light mb-4 border-0">
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="rounded-circle bg-success d-flex align-items-center justify-content-center me-3" 
                        style={{ width: '32px', height: '32px', color: '#fff' }}>
                        <i className="bi bi-info-circle"></i>
                      </div>
                      <h5 className="mb-0">Course Overview</h5>
                    </div>
                    <div className="ps-5">
                      <p className="mb-0">
                        <strong>Title:</strong> {courseData.title || 'Not set'}<br />
                        <strong>Level:</strong> {courseData.level || 'Not set'} | 
                        <strong> Duration:</strong> {courseData.duration || 'Not set'} | 
                        <strong> Language:</strong> {courseData.language || 'Not set'}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
                
                <div className="lessons-container mb-4">
                  {lessons.map((lesson, index) => (
                    <Card 
                      key={index} 
                      className="mb-4 border-0 shadow-sm"
                      style={{ borderLeft: `3px solid ${colors.primaryGreen}` }}
                    >
                      <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                          Lesson {index + 1}: {lesson.title || 'Untitled Lesson'}
                        </h5>
                        {lessons.length > 1 && (
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleRemoveLesson(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </Card.Header>
                      <Card.Body>
                        <LessonForm
                          index={index}
                          lesson={lesson}
                          onAddLesson={(lessonData, videoFile, resourceFile) => 
                            handleLessonChange(index, lessonData, videoFile, resourceFile)
                          }
                          onRemoveLesson={handleRemoveLesson}
                        />
                      </Card.Body>
                    </Card>
                  ))}
                  
                  {/* Add another lesson button */}
                  <div className="text-center mb-4">
                    <Button 
                      variant="outline-success"
                      onClick={handleAddLesson}
                      className="d-flex align-items-center mx-auto"
                    >
                      <BsPlusCircle className="me-2" />
                      Add Another Lesson
                    </Button>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between mt-4 border-top pt-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handlePrevious}
                    className="d-flex align-items-center"
                  >
                    <BsArrowLeft className="me-2" />
                    Back to Course Details
                  </Button>
                  
                  <div>
                    <Button 
                      variant="outline-success" 
                      onClick={() => navigate('/instructor')} 
                      className="me-2"
                    >
                      Save Draft
                    </Button>
                    <Button 
                      type="submit" 
                      variant="success"
                      disabled={loading}
                      className="px-4"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Publishing...
                        </>
                      ) : (
                        'Publish Course'
                      )}
                    </Button>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}
        
        {/* Help section at bottom */}
        <div className="mt-5 text-center">
          <p className="text-muted small mb-0">
            Need help? <a href="#" style={{ color: colors.primaryGreen }}>View our course creation guidelines</a> or <a href="#" style={{ color: colors.primaryGreen }}>contact support</a>
          </p>
        </div>
      </Container>
    </div>
  );
}

export default AddCourse;