import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Button, Alert } from 'react-bootstrap';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('token', token);
            navigate('/home');
        }
    }, [location, navigate]);

    const handleLogin = (provider) => {
        window.location.href = `http://localhost:9090/oauth2/authorization/${provider}`;        };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="text-center">
                <h1 className="mb-4">Welcome to TutorialHub</h1>
                {error && <Alert variant="danger">{error}</Alert>}
                <Button
                    variant="outline-primary"
                    className="mb-3 w-100"
                    onClick={() => handleLogin('google')}
                >
                    Login with Google
                </Button>
                <Button
                    variant="outline-dark"
                    className="w-100"
                    onClick={() => handleLogin('github')}
                >
                    Login with GitHub
                </Button>
            </div>
        </Container>
    );
}

export default Login;