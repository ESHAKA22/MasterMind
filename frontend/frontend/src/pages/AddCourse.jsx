import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Row, Col, Badge, Alert, ProgressBar } from 'react-bootstrap';
import { createCourse, addContentToCourse } from '../api';
import LessonForm from '../components/LessonForm';
import { BsPlusCircle } from 'react-icons/bs';

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

  // Professional color scheme
  const colors = {
    mediumBlue: '#0000cd',
    darkBlue: '#00008b',
    royalBlue: '#4169e1',
    dodgerBlue: '#1e90ff',
  };

  return (
    <Container className="py-5">
      {/* Page Header */}
      <div className="text-center mb-4">
        <h1 
          className="display-4 fw-bold" 
          style={{ color: colors.darkBlue }}
        >
          Create New Course
        </h1>
        <p 
          className="lead" 
          style={{ color: colors.mediumBlue }}
        >
          Fill in the details below to create your course
        </p>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-5">
        <ProgressBar 
          now={(currentStep / totalSteps) * 100} 
          variant="primary" 
          style={{ height: '8px' }} 
          className="mb-2"
        />
        <div className="d-flex justify-content-between">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <Badge 
              bg={currentStep >= 1 ? "primary" : "secondary"}
              pill
              style={{ padding: '8px 16px' }}
            >
              1
            </Badge>
            <span className="ms-2 fw-medium">Course Information</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <Badge 
              bg={currentStep >= 2 ? "primary" : "secondary"}
              pill
              style={{ padding: '8px 16px' }}
            >
              2
            </Badge>
            <span className="ms-2 fw-medium">Course Lessons</span>
          </div>
        </div>
      </div>
      
      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {/* Step 1: Course Information */}
      {currentStep === 1 && (
        <Card className="shadow-sm border-0 mb-5">
          <Card.Header 
            className="bg-white border-bottom-0 pt-4 pb-0 px-4"
            style={{ borderLeft: `5px solid ${colors.royalBlue}` }}
          >
            <h2 style={{ color: colors.darkBlue }}>Basic Course Information</h2>
            <p className="text-muted">Enter the main details of your course</p>
          </Card.Header>
          
          <Card.Body className="p-4">
            <Form>
              <Row className="mb-4">
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
                
                <Col md={6}>
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
                  </Form.Group>
                  
                  {/* Course Image */}
                  <Form.Group className="mb-4" controlId="courseImage">
                    <Form.Label className="fw-bold">Course Image</Form.Label>
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
                    
                    {courseData.image && (
                      <div className="mt-2 border rounded p-2">
                        <div className="small text-muted">Selected file:</div>
                        <div className="fw-medium">{courseData.image.name}</div>
                      </div>
                    )}
                  </Form.Group>
                  
                  {/* Tags Input */}
                  <Form.Group className="mb-4" controlId="courseTags">
                    <Form.Label className="fw-bold">Tags</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add tags (e.g., Python, Web Dev)"
                        className="shadow-sm me-2"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                      />
                      <Button 
                        variant="outline-primary" 
                        onClick={addTag}
                        style={{
                          borderColor: colors.royalBlue,
                          color: colors.royalBlue
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    
                    {/* Display tags */}
                    <div className="mt-2">
                      {courseData.tags.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                          {courseData.tags.map((tag) => (
                            <Badge 
                              key={tag} 
                              bg="info" 
                              className="px-3 py-2 d-flex align-items-center"
                              style={{
                                backgroundColor: colors.royalBlue,
                              }}
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
                        <div className="small text-muted">No tags added yet</div>
                      )}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-flex justify-content-end mt-4 border-top pt-4">
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/instructor')} 
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleNext}
                  variant="primary"
                  style={{
                    backgroundColor: colors.royalBlue,
                    borderColor: colors.royalBlue
                  }}
                >
                  Continue to Lessons
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
      
      {/* Step 2: Course Lessons */}
      {currentStep === 2 && (
        <Card className="shadow-sm border-0 mb-5">
          <Card.Header 
            className="bg-white border-bottom-0 pt-4 pb-0 px-4"
            style={{ borderLeft: `5px solid ${colors.royalBlue}` }}
          >
            <h2 style={{ color: colors.darkBlue }}>Course Lessons</h2>
            <p className="text-muted">Add lessons to your course</p>
          </Card.Header>
          
          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              <div className="lessons-container mb-4">
                {lessons.map((lesson, index) => (
                  <LessonForm
                    key={index}
                    index={index}
                    lesson={lesson}
                    onAddLesson={(lessonData, videoFile, resourceFile) => 
                      handleLessonChange(index, lessonData, videoFile, resourceFile)
                    }
                    onRemoveLesson={handleRemoveLesson}
                  />
                ))}
                
                {/* Add another lesson button */}
                <div className="text-center mb-4">
                  <Button 
                    variant="outline-primary"
                    onClick={handleAddLesson}
                    className="d-flex align-items-center mx-auto"
                    style={{
                      borderColor: colors.royalBlue,
                      color: colors.royalBlue
                    }}
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
                >
                  Back to Course Details
                </Button>
                
                <div>
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate('/instructor')} 
                    className="me-2"
                  >
                    Save Draft
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={loading}
                    style={{
                      backgroundColor: colors.royalBlue,
                      borderColor: colors.royalBlue
                    }}
                  >
                    {loading ? 'Publishing...' : 'Publish Course'}
                  </Button>
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default AddCourse;