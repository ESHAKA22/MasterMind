import { useState } from 'react';
import { Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { FaBook, FaLayerGroup, FaUser, FaImage, FaFileAlt } from 'react-icons/fa';

function CourseForm({ initialData = {}, onSubmit, error }) {
  // Color scheme
  const colors = {
    primaryGreen: '#198754',  // Dark Green
    lightGreen: '#d1e7dd',    // Light Green
    darkGreen: '#1b5e20',     // Deep Green
    white: '#ffffff',
    lightGray: '#f8f9fa',
    darkGray: '#212529'
  };

  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || '',
    level: initialData.level || 'Beginner',
    thumbnail: initialData.thumbnail || null,
    instructor: initialData.instructor || '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (submitData.thumbnail && submitData.thumbnail instanceof File) {
      submitData.thumbnail = submitData.thumbnail.name; // Backend expects filename
    }
    onSubmit(submitData);
  };

  return (
    <Card className="border-0 shadow-sm rounded-4">
      <Card.Header 
        className="bg-white border-bottom-0 pt-4 pb-0 px-4"
        style={{ borderLeft: `5px solid ${colors.primaryGreen}` }}
      >
        <h4 style={{ color: colors.darkGray }} className="fw-bold">Course Information</h4>
        <p className="text-muted">Fill in the details to create your course</p>
      </Card.Header>
      <Card.Body className="p-4">
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}
          
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label className="fw-bold d-flex align-items-center">
                  <FaBook className="me-2" style={{ color: colors.primaryGreen }} />
                  Course Title
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a descriptive course title"
                  required
                  className="shadow-sm"
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="category">
                <Form.Label className="fw-bold d-flex align-items-center">
                  <FaLayerGroup className="me-2" style={{ color: colors.primaryGreen }} />
                  Category
                </Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Web Development, Data Science"
                  required
                  className="shadow-sm"
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="level">
                <Form.Label className="fw-bold d-flex align-items-center">
                  <FaLayerGroup className="me-2" style={{ color: colors.primaryGreen }} />
                  Level
                </Form.Label>
                <Form.Select 
                  name="level" 
                  value={formData.level} 
                  onChange={handleChange}
                  className="shadow-sm"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="instructor">
                <Form.Label className="fw-bold d-flex align-items-center">
                  <FaUser className="me-2" style={{ color: colors.primaryGreen }} />
                  Instructor
                </Form.Label>
                <Form.Control
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  placeholder="Name of the instructor"
                  className="shadow-sm"
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label className="fw-bold d-flex align-items-center">
                  <FaFileAlt className="me-2" style={{ color: colors.primaryGreen }} />
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed description of what students will learn"
                  required
                  className="shadow-sm"
                  style={{ resize: "vertical" }}
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="thumbnail">
                <Form.Label className="fw-bold d-flex align-items-center">
                  <FaImage className="me-2" style={{ color: colors.primaryGreen }} />
                  Course Thumbnail
                </Form.Label>
                <Form.Control
                  type="file"
                  name="thumbnail"
                  onChange={handleChange}
                  accept="image/*"
                  className="shadow-sm form-control-file"
                />
                <Form.Text className="text-muted">
                  Recommended size: 1280×720 pixels (16:9 ratio)
                </Form.Text>
                
                {formData.thumbnail && formData.thumbnail instanceof File && (
                  <div className="mt-2 p-2 border rounded bg-light">
                    <div className="small text-muted">Selected file:</div>
                    <div className="fw-medium">{formData.thumbnail.name}</div>
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
          
          <div className="d-flex justify-content-end border-top pt-4 mt-3">
            <Button 
              variant="outline-secondary" 
              type="button" 
              className="me-2"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button 
              variant="success" 
              type="submit"
              className="px-4"
              style={{ 
                backgroundColor: colors.primaryGreen,
                borderColor: colors.primaryGreen
              }}
            >
              Submit Course
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default CourseForm;