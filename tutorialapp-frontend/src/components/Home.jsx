import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookmarkIcon, HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { Container, Row, Col, Card, Form, Button, Badge, Carousel } from 'react-bootstrap';

function Home() {
    const [tutorials, setTutorials] = useState([]);
    const [bookmarks, setBookmarks] = useState(JSON.parse(localStorage.getItem('bookmarks')) || []);
    const [likes, setLikes] = useState({});
    const [comments, setComments] = useState({});
    const [commentInput, setCommentInput] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchUser();
        fetchTutorials();
    }, []);

    const fetchUser = async () => {
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get('token');
        let token = tokenFromUrl || localStorage.getItem('token');

        if (token) {
            try {
                const response = await fetch('http://localhost:9090/api/auth/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    if (tokenFromUrl) {
                        localStorage.setItem('token', tokenFromUrl); // Store the new token if from URL
                    }
                } else {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
    };

    const fetchTutorials = async () => {
        try {
            const response = await fetch('http://localhost:9090/api/tutorials');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            setTutorials(Array.isArray(data) ? data : []);
            const initialLikes = data.reduce((acc, tut) => ({ ...acc, [tut.id]: tut.likes || 0 }), {});
            const initialComments = data.reduce((acc, tut) => ({ ...acc, [tut.id]: tut.comments || [] }), {});
            setLikes(initialLikes);
            setComments(initialComments);
        } catch (error) {
            console.error('Error fetching tutorials:', error);
            setTutorials([]);
        }
    };

    const toggleBookmark = (id) => {
        const updatedBookmarks = bookmarks.includes(id)
            ? bookmarks.filter(bookmarkId => bookmarkId !== id)
            : [...bookmarks, id];
        setBookmarks(updatedBookmarks);
        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    };

    const handleLike = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:9090/api/tutorials/${id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const updatedTutorial = await response.json();
                setLikes({ ...likes, [id]: updatedTutorial.likes });
            }
        } catch (error) {
            console.error('Error liking tutorial:', error);
        }
    };

    const handleComment = async (id, comment) => {
        if (!comment.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:9090/api/tutorials/${id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(comment),
            });
            if (response.ok) {
                const updatedTutorial = await response.json();
                setComments({ ...comments, [id]: updatedTutorial.comments });
                setCommentInput({ ...commentInput, [id]: '' });
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const deleteTutorial = async (id) => {
        if (!window.confirm('Are you sure you want to delete this tutorial?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:9090/api/tutorials/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                alert('Tutorial deleted successfully!');
                fetchTutorials();
            } else {
                alert('Failed to delete tutorial.');
            }
        } catch (error) {
            alert('Error deleting tutorial: ' + error.message);
        }
    };

    const filteredTutorials = tutorials.filter(tutorial =>
        tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tutorial.tags && tutorial.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    const trendingTags = ['Java', 'React', 'Python', 'Streams', 'WebDev', 'JavaScript', 'Spring', 'Node.js'];

    const handleCreatePostNavigation = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            navigate('/create');
        } catch (error) {
            console.error('Navigation to /create failed:', error);
            alert('Unable to navigate to Create Post. Please check your routes.');
        }
    };

    return (
        <Container className="my-5" style={{ minHeight: '100vh', display: 'block', padding: '0' }}>
            <Row className="justify-content-center align-items-center w-100" style={{ minHeight: '100vh' }}>
                <div className="ad-play-container w-100">
                    <Carousel 
                        interval={3000} 
                        pause={false} 
                        controls={false} 
                        indicators={true}
                        slide={true}
                        className="bg-success text-white"
                        style={{ width: '100%', margin: '0 auto' }}
                    >
                        <Carousel.Item>
                            <div className="d-flex justify-content-center align-items-center p-5 text-center" style={{ height: '300px' }}>
                                <div>
                                    <h1 className="display-4 fw-bold mb-3">Welcome to MasterMind</h1>
                                    <p className="lead mb-4">Share and discover coding Knowledge from developers around the world</p>
                                    <Button 
                                        variant="outline-light" 
                                        size="lg" 
                                        onClick={handleCreatePostNavigation}
                                    >
                                        Share Your Knowledge
                                    </Button>
                                </div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="d-flex justify-content-center align-items-center p-5 text-center" style={{ height: '300px' }}>
                                <div>
                                    <h2 className="display-5 fw-bold mb-3">Ad Placeholder 1</h2>
                                    <p className="lead mb-4">This is a placeholder for an ad. Link your ad content here.</p>
                                    <Button variant="outline-light" size="lg">
                                        Learn More
                                    </Button>
                                </div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="d-flex justify-content-center align-items-center p-5 text-center" style={{ height: '300px' }}>
                                <div>
                                    <h2 className="display-5 fw-bold mb-3">Ad Placeholder 2</h2>
                                    <p className="lead mb-4">This is another placeholder for an ad. Link your ad content here.</p>
                                    <Button variant="outline-light" size="lg">
                                        Learn More
                                    </Button>
                                </div>
                            </div>
                        </Carousel.Item>
                    </Carousel>
                </div>
                <div className="sponsored-section bg-light p-3 text-center w-100" style={{ margin: '0 auto' }}>
                    <Container>
                        <p className="mb-0">
                            <span className="text-muted">Sponsored:</span> Master React with our new comprehensive course!
                            <Button variant="success" size="sm" className="ms-2">Learn More</Button>
                        </p>
                    </Container>
                </div>
                <Container className="my-4 w-100">
                    <Row className="justify-content-between">
                        <Col lg={8}>
                            <div className="d-flex justify-content-end mb-4">
                                <Form.Control
                                    type="text"
                                    placeholder="Search tutorials..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="me-2 shadow-sm"
                                    style={{ maxWidth: '300px' }}
                                />
                                <Button 
                                    variant="success"
                                    onClick={handleCreatePostNavigation}
                                >
                                    Create Post
                                </Button>
                            </div>
                            {filteredTutorials.length === 0 ? (
                                <Card className="text-center p-4">
                                    <p className="text-muted">No tutorials found. Be the first to create one!</p>
                                    <Button 
                                        variant="success"
                                        onClick={handleCreatePostNavigation}
                                    >
                                        Create Post
                                    </Button>
                                </Card>
                            ) : (
                                filteredTutorials.map(tutorial => (
                                    <Card key={tutorial.id} className="post-card mb-4 shadow-sm">
                                        <Card.Body>
                                            <div className="post-header d-flex justify-content-between align-items-center mb-3">
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src="https://via.placeholder.com/40"
                                                        alt="User Avatar"
                                                        className="rounded-circle me-2"
                                                        width="40"
                                                        height="40"
                                                    />
                                                    <div>
                                                        <h6 className="mb-0 fw-bold">{tutorial.creatorId}</h6>
                                                        <small className="text-muted">Just now</small>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => toggleBookmark(tutorial.id)}
                                                    className="btn btn-sm"
                                                >
                                                    {bookmarks.includes(tutorial.id) ? (
                                                        <BookmarkIconSolid className="text-warning" width={20} />
                                                    ) : (
                                                        <BookmarkIcon width={20} />
                                                    )}
                                                </button>
                                            </div>
                                            <Card.Title className="mb-2">{tutorial.title}</Card.Title>
                                            <Card.Text className="text-muted mb-3">{tutorial.description}</Card.Text>
                                            <div className="code-snippet bg-light p-3 mb-3" style={{ borderLeft: '4px solid #28a745' }}>
                                                <pre><code>{tutorial.codeSnippet}</code></pre>
                                            </div>
                                            <div className="post-tags mb-3">
                                                {Array.isArray(tutorial.tags) && tutorial.tags.map(tag => (
                                                    <Badge key={tag} bg="success" text="white" className="me-1">
                                                        #{tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <button
                                                    onClick={() => handleLike(tutorial.id)}
                                                    className="btn btn-sm me-3 d-flex align-items-center text-success"
                                                >
                                                    {likes[tutorial.id] ? (
                                                        <HeartIconSolid className="text-danger me-1" width={18} />
                                                    ) : (
                                                        <HeartIcon className="me-1" width={18} />
                                                    )}
                                                    <span>{likes[tutorial.id] || 0}</span>
                                                </button>
                                                <button className="btn btn-sm d-flex align-items-center text-success">
                                                    <ChatBubbleLeftIcon className="me-1" width={18} />
                                                    <span>{comments[tutorial.id] ? comments[tutorial.id].length : 0}</span>
                                                </button>
                                            </div>
                                            <Form.Group className="mb-3">
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    value={commentInput[tutorial.id] || ''}
                                                    onChange={(e) => setCommentInput({ ...commentInput, [tutorial.id]: e.target.value })}
                                                    placeholder="Add a comment..."
                                                    className="mb-2"
                                                />
                                                <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    onClick={() => handleComment(tutorial.id, commentInput[tutorial.id])}
                                                >
                                                    Post Comment
                                                </Button>
                                            </Form.Group>
                                            {comments[tutorial.id] && comments[tutorial.id].length > 0 && (
                                                <div className="comment-section">
                                                    <h6 className="mb-2">Comments</h6>
                                                    {comments[tutorial.id].map((comment, index) => (
                                                        <div key={index} className="comment mb-2">
                                                            <p className="mb-0 small">{comment}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {user && tutorial.creatorId === user.email && (
                                                <div className="d-flex mt-3">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => navigate(`/edit/${tutorial.id}`)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => deleteTutorial(tutorial.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                ))
                            )}
                        </Col>
                        <Col lg={4}>
                            <Card className="sidebar-card mb-4">
                                <Card.Title className="mb-3">Trending Tags</Card.Title>
                                <div className="d-flex flex-wrap">
                                    {trendingTags.map(tag => (
                                        <Badge 
                                            key={tag} 
                                            bg="success" 
                                            text="white" 
                                            className="me-2 mb-2 p-2"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </Card>
                            <Card className="sidebar-card">
                                <Card.Title className="mb-3">Popular This Week</Card.Title>
                                <div className="list-group list-group-flush">
                                    {tutorials.slice(0, 3).map(tutorial => (
                                        <button 
                                            key={tutorial.id} 
                                            className="list-group-item list-group-item-action"
                                            onClick={() => window.scrollTo({
                                                top: document.getElementById(`post-${tutorial.id}`)?.offsetTop - 20,
                                                behavior: 'smooth'
                                            })}
                                        >
                                            <div className="d-flex w-100 justify-content-between">
                                                <h6 className="mb-1">{tutorial.title}</h6>
                                                <small>{likes[tutorial.id] || 0} ♥</small>
                                            </div>
                                            <small className="text-muted">
                                                {tutorial.tags?.slice(0, 2).join(', ')}
                                            </small>
                                        </button>
                                    ))}
                                </div>
                            </Card>
                            <Card className="sidebar-card mt-4">
                                <Card.Title className="mb-3">Stay Updated</Card.Title>
                                <p className="mb-3">Subscribe to our newsletter for weekly tutorials</p>
                                <Form.Control
                                    type="email"
                                    placeholder="Your email"
                                    className="mb-2"
                                />
                                <Button variant="success">Subscribe</Button>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Row>
        </Container>
    );
}

export default Home;