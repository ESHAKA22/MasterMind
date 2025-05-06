import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function CourseForm({ initialData = {}, onSubmit, error }) {
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
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>Course Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="category">
        <Form.Label>Category</Form.Label>
        <Form.Control
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="level">
        <Form.Label>Level</Form.Label>
        <Form.Select name="level" value={formData.level} onChange={handleChange}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="instructor">
        <Form.Label>Instructor</Form.Label>
        <Form.Control
          type="text"
          name="instructor"
          value={formData.instructor}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="thumbnail">
        <Form.Label>Thumbnail</Form.Label>
        <Form.Control
          type="file"
          name="thumbnail"
          onChange={handleChange}
          accept="image/*"
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default CourseForm;