import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AllCourses from './pages/AllCourses';
import AddCourse from './pages/AddCourse';
import EditCourse from './pages/EditCourse';
import CourseView from './pages/CourseView';
import InstructorDashboard from './pages/InstructorDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function App() {
  return (
    <Router>
      <Header />
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<AllCourses />} />
          <Route path="/courses/:id" element={<CourseView />} />
          <Route path="/add-course" element={<AddCourse />} />
          <Route path="/edit-course/:id" element={<EditCourse />} />
          <Route path="/instructor" element={<InstructorDashboard />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;