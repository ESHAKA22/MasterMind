import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import CreatePost from './components/CreatePost.jsx';
import EditPost from './components/EditPost.jsx';
import Login from './components/Login.jsx';
import AppNavbar from './components/Navbar.jsx';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 font-sans">
                <AppNavbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/create" element={<CreatePost />} />
                    <Route path="/edit/:id" element={<EditPost />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/auth/callback" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;