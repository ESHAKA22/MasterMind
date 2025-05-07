import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

function CreatePost() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        codeSnippet: '',
        tags: '',
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        const tutorial = { ...formData, tags };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:9090/api/tutorials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(tutorial),
            });
            
            if (response.ok) {
                navigate('/', { state: { message: 'Tutorial created successfully!' } });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create tutorial');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerStyle = {
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '20px'
    };

    const formContainerStyle = {
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        border: '1px solid #198754',
        borderRadius: '8px',
        padding: '30px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    };

    return (
        <div style={containerStyle}>
            <div className="text-center mb-5" style={{ color: '#1b5e20' }}>
                <h1 className="fw-bold">Create a New Post</h1>
                <p className="text-muted">Share your knowledge with the community</p>
            </div>
            
            <div style={formContainerStyle}>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                        <Form.Label style={{ color: '#212529' }}>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter a descriptive title"
                            required
                            style={{ backgroundColor: '#f8f9fa', borderColor: '#198754' }}
                        />
                        <Form.Text className="text-muted">
                            Make it clear and concise
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label style={{ color: '#212529' }}>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Explain what your post is about"
                            required
                            style={{ backgroundColor: '#f8f9fa', borderColor: '#198754' }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label style={{ color: '#212529' }}>Code Snippet</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="codeSnippet"
                            value={formData.codeSnippet}
                            onChange={handleChange}
                            rows={8}
                            placeholder="Paste your code here"
                            className="font-monospace"
                            required
                            style={{ backgroundColor: '#f8f9fa', borderColor: '#198754' }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label style={{ color: '#212529' }}>Tags</Form.Label>
                        <Form.Control
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="e.g., Java, React, Programming"
                            style={{ backgroundColor: '#f8f9fa', borderColor: '#198754' }}
                        />
                        <Form.Text className="text-muted">
                            Separate tags with commas
                        </Form.Text>
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                        <Button
                            variant="outline-secondary"
                            className="me-2"
                            onClick={() => navigate('/')}
                            disabled={isSubmitting}
                            style={{ color: '#212529', borderColor: '#212529' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outline-success"
                            type="submit"
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#198754', color: '#ffffff', borderColor: '#198754' }}
                        >
                            {isSubmitting ? 'Publishing...' : 'Publish Post'}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default CreatePost;