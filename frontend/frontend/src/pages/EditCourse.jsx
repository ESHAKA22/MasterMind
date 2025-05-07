import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Row, Col, Badge, Alert, Spinner } from 'react-bootstrap';
import { getCourseById, updateCourse } from '../api';
import { BsArrowLeft, BsImage, BsTag, BsTrash, BsInfoCircle } from 'react-icons/bs';

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Course data state
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    image: null,
    imagePath: '',
    duration: '',
    language: '',
    level: '',
    category: '',
    tags: []
  });
  
  // For tag input
  const [tagInput, setTagInput] = useState('');
  
  // Color scheme
  const colors = {
    primaryGreen: '#198754',
    lightGreen: '#d1e7dd',
    darkGreen: '#1b5e20',
    white: '#ffffff',
    lightGray: '#f8f9fa',
    darkGray: '#212529'
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
  
  // Fetch course data on component mount
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        // Fetch course info
        const courseInfo = await getCourseById(id);
        
        setCourseData({
          title: courseInfo.title || '',
          description: courseInfo.description || '',
          image: null, // We can't fetch the actual file, just the path
          imagePath: courseInfo.imagePath || '',
          duration: courseInfo.duration || '',
          language: courseInfo.language || '',
          level: courseInfo.level || '',
          tags: courseInfo.tags || [],
          category: courseInfo.category || ''
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseData();
  }, [id]);
  
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('duration', courseData.duration);
      formData.append('language', courseData.language);
      formData.append('level', courseData.level);
      formData.append('category', courseData.category);
      formData.append('tags', JSON.stringify(courseData.tags));
      
      // Only include image if a new one was selected
      if (courseData.image) {
        formData.append('image', courseData.image);
        
        // Use the updated updateCourse function with FormData
        await updateCourse(id, formData);
      } else {
        // If no new image, use a standard object
        await updateCourse(id, {
          title: courseData.title,
          description: courseData.description,
          duration: courseData.duration,
          language: courseData.language,
          level: courseData.level,
          category: courseData.category,
          tags: courseData.tags
        });
      }
      
      // Navigate to instructor dashboard on success
      navigate('/instructor');
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Failed to update course. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: colors.lightGray }}>
        <div className="text-center p-4 bg-white shadow-sm rounded-4">
          <Spinner 
            animation="border" 
            role="status"
            style={{ color: colors.primaryGreen, width: '3rem', height: '3rem' }}
          />
          <p className="mt-4 mb-0 fw-medium" style={{ color: colors.darkGray }}>Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.lightGray, minHeight: '100vh' }}>
      <Container className="py-5">
        {/* Page Header */}
        <Card className="border-0 shadow-sm mb-4 rounded-4 overflow-hidden">
          <div 
            className="py-4 px-4" 
            style={{ 
              backgroundImage: `linear-gradient(to right, ${colors.darkGreen}, ${colors.primaryGreen})`,
              borderBottom: `1px solid ${colors.lightGreen}`
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h2 fw-bold text-white mb-0">Edit Course</h1>
                <p className="text-white-50 mb-0">Update your course information and settings</p>
              </div>
              <Button 
                variant="outline-light" 
                size="sm"
                onClick={() => navigate('/instructor')} 
                className="d-flex align-items-center"
              >
                <BsArrowLeft className="me-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Error Alert */}
        {error && (
          <Alert 
            variant="danger" 
            className="mb-4 rounded-4 shadow-sm border-0 d-flex align-items-center"
          >
            <div className="me-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
            </div>
            <div>{error}</div>
          </Alert>
        )}
        
        {/* Course Information Form */}
        <Card className="shadow border-0 mb-5 rounded-4 overflow-hidden">
          <Card.Header 
            className="bg-white border-bottom py-3 px-4"
            style={{ borderLeft: `5px solid ${colors.primaryGreen}` }}
          >
            <h2 className="h5 fw-bold mb-0" style={{ color: colors.darkGray }}>Course Information</h2>
          </Card.Header>
          
          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              <Row className="g-4">
                <Col lg={7}>
                  {/* Left Column - Course Details */}
                  <div className="bg-white p-4 rounded-4 h-100">
                    <h3 className="h6 fw-bold mb-4" style={{ color: colors.darkGreen }}>
                      MAIN DETAILS
                    </h3>
                    
                    {/* Course Title */}
                    <Form.Group className="mb-4" controlId="courseTitle">
                      <Form.Label className="fw-semibold">Course Title<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={courseData.title}
                        onChange={handleChange}
                        placeholder="Enter a descriptive title"
                        required
                        className="shadow-sm rounded-3 border-secondary-subtle"
                      />
                    </Form.Group>
                    
                    {/* Course Description */}
                    <Form.Group className="mb-4" controlId="courseDescription">
                      <Form.Label className="fw-semibold">Course Description<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        value={courseData.description}
                        onChange={handleChange}
                        placeholder="Describe what students will learn"
                        required
                        className="shadow-sm rounded-3 border-secondary-subtle"
                        rows={6}
                        style={{ resize: 'vertical' }}
                      />
                      <Form.Text className="text-muted">
                        A compelling description helps attract students to your course
                      </Form.Text>
                    </Form.Group>
                    
                    {/* Course Category */}
                    <Form.Group className="mb-4" controlId="courseCategory">
                      <Form.Label className="fw-semibold">Category<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="category"
                        value={courseData.category}
                        onChange={handleChange}
                        placeholder="e.g., Programming, Design, Business"
                        required
                        className="shadow-sm rounded-3 border-secondary-subtle"
                      />
                    </Form.Group>
                    
                    {/* Tags Input */}
                    <Form.Group className="mb-0" controlId="courseTags">
                      <Form.Label className="fw-semibold d-flex align-items-center">
                        <BsTag className="me-2" style={{ color: colors.primaryGreen }} />
                        Tags
                      </Form.Label>
                      <div className="d-flex">
                        <Form.Control
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Add tags (e.g., Python, Web Dev)"
                          className="shadow-sm rounded-start rounded-0 border-secondary-subtle"
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
                          className="rounded-end rounded-0"
                          style={{
                            backgroundColor: colors.primaryGreen,
                            borderColor: colors.primaryGreen
                          }}
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
                                bg="light" 
                                className="px-3 py-2 d-flex align-items-center"
                                style={{
                                  backgroundColor: colors.lightGreen,
                                  color: colors.darkGreen,
                                  border: `1px solid ${colors.primaryGreen}`,
                                }}
                              >
                                {tag}
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 ms-2 text-decoration-none"
                                  onClick={() => removeTag(tag)}
                                  style={{ color: colors.darkGreen }}
                                >
                                  <BsTrash size={14} />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <div className="small text-muted mt-2">No tags added yet</div>
                        )}
                      </div>
                    </Form.Group>
                  </div>
                </Col>
                
                <Col lg={5}>
                  {/* Right Column - Course Settings and Image */}
                  <div className="d-flex flex-column gap-4">
                    {/* Course Settings Card */}
                    <div className="bg-white p-4 rounded-4">
                      <h3 className="h6 fw-bold mb-4" style={{ color: colors.darkGreen }}>
                        COURSE SETTINGS
                      </h3>
                      
                      {/* Course Duration */}
                      <Form.Group className="mb-3" controlId="courseDuration">
                        <Form.Label className="fw-semibold">Course Duration<span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="duration"
                          value={courseData.duration}
                          onChange={handleChange}
                          required
                          className="shadow-sm rounded-3 border-secondary-subtle"
                        >
                          {durationOptions.map((option) => (
                            <option key={option} value={option === 'Select Duration' ? '' : option}>
                              {option}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      
                      {/* Course Language */}
                      <Form.Group className="mb-3" controlId="courseLanguage">
                        <Form.Label className="fw-semibold">Language<span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="language"
                          value={courseData.language}
                          onChange={handleChange}
                          required
                          className="shadow-sm rounded-3 border-secondary-subtle"
                        >
                          {languageOptions.map((option) => (
                            <option key={option} value={option === 'Select Language' ? '' : option}>
                              {option}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      
                      {/* Course Level */}
                      <Form.Group className="mb-0" controlId="courseLevel">
                        <Form.Label className="fw-semibold">Skill Level<span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="level"
                          value={courseData.level}
                          onChange={handleChange}
                          required
                          className="shadow-sm rounded-3 border-secondary-subtle"
                        >
                          <option value="">Select Level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                    
                    {/* Course Image Card */}
                    <div className="bg-white p-4 rounded-4">
                      <h3 className="h6 fw-bold mb-4" style={{ color: colors.darkGreen }}>
                        <BsImage className="me-2" />
                        COURSE IMAGE
                      </h3>
                      
                      {/* Current Image Preview */}
                      {courseData.imagePath && !courseData.image && (
                        <div className="mb-3 text-center p-3 rounded-3" style={{ backgroundColor: colors.lightGray }}>
                          <img 
                            src={courseData.imagePath} 
                            alt="Current course thumbnail" 
                            className="img-fluid rounded-3 shadow-sm"
                            style={{ maxHeight: '160px' }}
                          />
                          <div className="small text-muted mt-2">Current image</div>
                        </div>
                      )}
                      
                      {/* Course Image Upload */}
                      <Form.Group controlId="courseImage">
                        <div className="d-flex align-items-center mb-3">
                          <Form.Label className="fw-semibold mb-0">Update Course Image</Form.Label>
                          <Button 
                            variant="link" 
                            className="p-0 ms-2 text-decoration-none"
                            title="Image Guidelines"
                            style={{ color: colors.primaryGreen }}
                          >
                            <BsInfoCircle size={16} />
                          </Button>
                        </div>
                        
                        <div 
                          className="border border-dashed rounded-3 p-3"
                          style={{ borderStyle: 'dashed', backgroundColor: colors.lightGray }}
                        >
                          <Form.Control
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="form-control-sm"
                          />
                          <Form.Text className="text-muted d-block mt-2">
                            Recommended size: 1280×720 pixels (16:9 ratio)
                          </Form.Text>
                        </div>
                        
                        {/* New Image Selection Preview */}
                        {courseData.image && (
                          <div className="mt-3 p-2 rounded-3 border border-success-subtle">
                            <div className="d-flex align-items-center">
                              <div 
                                className="bg-success-subtle rounded-circle p-2 me-2"
                                style={{ color: colors.primaryGreen }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                                </svg>
                              </div>
                              <div>
                                <div className="small fw-medium">New image selected:</div>
                                <div className="small text-muted">{courseData.image.name}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Form.Group>
                    </div>
                  </div>
                </Col>
              </Row>
              
              <div 
                className="d-flex justify-content-between mt-4 pt-4 border-top"
                style={{ borderColor: colors.lightGray }}
              >
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate('/instructor')} 
                  className="d-flex align-items-center fw-medium"
                >
                  <BsArrowLeft className="me-2" />
                  Cancel
                </Button>
                
                <Button 
                  type="submit" 
                  variant="success"
                  disabled={submitting}
                  className="px-4 fw-medium"
                  style={{
                    backgroundColor: colors.primaryGreen,
                    borderColor: colors.primaryGreen
                  }}
                >
                  {submitting ? (
                    <>
                      <Spinner 
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Saving Changes...
                    </>
                  ) : 'Save Changes'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default EditCourse;