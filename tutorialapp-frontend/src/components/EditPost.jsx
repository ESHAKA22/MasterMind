import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';

function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        codeSnippet: '',
        tags: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchTutorial();
    }, [id]);

    const fetchTutorial = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:9090/api/tutorials/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }
            
            const tutorial = await response.json();
            const tagsArray = Array.isArray(tutorial.tags) ? tutorial.tags.join(', ') : 
                            (typeof tutorial.tags === 'string' ? tutorial.tags : '');
            
            setFormData({
                title: tutorial.title || '',
                description: tutorial.description || '',
                codeSnippet: tutorial.codeSnippet || '',
                tags: tagsArray,
            });
            setLoading(false);
        } catch (error) {
            console.error('Fetch Error:', error);
            setError(error.message);
            setLoading(false);
        }
    };

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
            const response = await fetch(`http://localhost:9090/api/tutorials/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(tutorial),
            });
            
            if (response.ok) {
                navigate('/', { state: { message: 'Tutorial updated successfully!' } });
            } else {
                const errorText = await response.text();
                throw new Error(`Failed to update tutorial: ${errorText}`);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container className="text-center my-5" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spinner animation="border" role="status" variant="success">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading post...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Alert variant="danger">
                    <Alert.Heading>Error Loading Post</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-danger" onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
                </Alert>
            </Container>
        );
    }

    const containerStyle = {
        minHeight: '100vh',
        display: 'block',
        padding: '0',
    };

    return (
        <Container className="my-5" style={containerStyle}>
            <div className="text-center mb-5" style={{ color: '#1b5e20' }}>
                <h1 className="fw-bold">Update a Post</h1>
                <p className="text-muted">Share your knowledge with the community</p>
            </div>
            
            <Row className="justify-content-center align-items-center w-100" style={{ minHeight: '100vh' }}>
                <Col lg={12}>
                    <Card className="shadow-sm" style={{ backgroundColor: '#ffffff', borderColor: '#198754' }}>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label style={{ color: '#212529' }}>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
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
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default EditPost;