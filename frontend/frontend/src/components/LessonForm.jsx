import React, { useState } from 'react';
import { Form, Button, Row, Col, Card, Badge, CloseButton } from 'react-bootstrap';
import { BsPlusCircle } from 'react-icons/bs';

const LessonForm = ({ onAddLesson, onRemoveLesson, lesson, index }) => {
  const [lessonData, setLessonData] = useState(lesson || {
    title: '',
    lessonType: 'Video',
    duration: '',
    videoUrl: '',
    previewEnabled: false,
    resourceUrl: '',
    quizLink: '',
    content: '',
    contentType: 'text',
    order: index + 1
  });

  const [file, setFile] = useState(null);
  const [resourceFile, setResourceFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLessonData({
      ...lessonData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddLesson(lessonData, file, resourceFile);
  };

  const lessonTypes = ['Video', 'Quiz', 'PDF', 'Text'];

  return (
    <Card className="mb-4 shadow-sm border-0">
      <Card.Header 
        className="bg-white d-flex justify-content-between align-items-center py-3"
        style={{ borderLeft: '5px solid #4169e1' }}
      >
        <h5 className="mb-0">Lesson {index + 1}</h5>
        {index > 0 && (
          <CloseButton onClick={() => onRemoveLesson(index)} />
        )}
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId={`lessonTitle-${index}`}>
                <Form.Label className="fw-medium">Lesson Title*</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={lessonData.title}
                  onChange={handleChange}
                  placeholder="Enter lesson title"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3" controlId={`lessonType-${index}`}>
                <Form.Label className="fw-medium">Lesson Type*</Form.Label>
                <Form.Select
                  name="lessonType"
                  value={lessonData.lessonType}
                  onChange={handleChange}
                  required
                >
                  {lessonTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3" controlId={`lessonDuration-${index}`}>
                <Form.Label className="fw-medium">Duration</Form.Label>
                <Form.Control
                  type="text"
                  name="duration"
                  value={lessonData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 15 minutes"
                />
              </Form.Group>
            </Col>
          </Row>

          {lessonData.lessonType === 'Video' && (
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId={`videoUpload-${index}`}>
                  <Form.Label className="fw-medium">Video Upload</Form.Label>
                  <Form.Control
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <Form.Text className="text-muted">
                    Upload a video file or provide a YouTube link below
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId={`videoUrl-${index}`}>
                  <Form.Label className="fw-medium">Video URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="videoUrl"
                    value={lessonData.videoUrl}
                    onChange={handleChange}
                    placeholder="YouTube or Vimeo URL"
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          {lessonData.lessonType === 'Quiz' && (
            <Form.Group className="mb-3" controlId={`quizLink-${index}`}>
              <Form.Label className="fw-medium">Quiz Link or Embed Code</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="quizLink"
                value={lessonData.quizLink}
                onChange={handleChange}
                placeholder="Enter quiz link or embed code"
              />
            </Form.Group>
          )}

          {(lessonData.lessonType === 'PDF' || lessonData.lessonType === 'Text') && (
            <Form.Group className="mb-3" controlId={`content-${index}`}>
              <Form.Label className="fw-medium">Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="content"
                value={lessonData.content}
                onChange={handleChange}
                placeholder={`Enter ${lessonData.lessonType === 'PDF' ? 'description' : 'lesson content'}`}
              />
            </Form.Group>
          )}

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId={`resources-${index}`}>
                <Form.Label className="fw-medium">Lesson Resources</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setResourceFile(e.target.files[0])}
                />
                <Form.Text className="text-muted">
                  Upload PDF, code files, or additional materials
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end">
              <Form.Check
                type="checkbox"
                id={`preview-${index}`}
                name="previewEnabled"
                label="Allow lesson preview (available without enrollment)"
                checked={lessonData.previewEnabled}
                onChange={handleChange}
                className="mb-3"
              />
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LessonForm;