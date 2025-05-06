import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, BookOpen, Users, Award } from 'lucide-react';
import { Container, Row, Col, Button, Card, Badge, Form, InputGroup } from 'react-bootstrap';

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      description: "Learn HTML, CSS, JavaScript, React and Node.js to become a full-stack web developer",
      category: "Web Development",
      level: "Beginner"
    },
    {
      id: 2,
      title: "Python for Data Science",
      description: "Master Python programming and essential libraries for data analysis and visualization",
      category: "Data Science",
      level: "Intermediate"
    },
    {
      id: 3,
      title: "Advanced React & Redux",
      description: "Take your React skills to the next level with advanced patterns and state management",
      category: "Web Development",
      level: "Advanced"
    }
  ]);

  useEffect(() => {
    // Simulate API call - would be replaced with actual API call
    const fetchCourses = async () => {
      try {
        // const courses = await getCourses();
        // setFeaturedCourses(courses.slice(0, 3));
        console.log("Courses loaded from state");
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    
    fetchCourses();
  }, []);

  // Function to get category image - simplified for demo
  const getCourseImage = (category) => {
    const imageMap = {
      "Web Development": "/api/placeholder/800/450",
      "Data Science": "/api/placeholder/800/450",
      "Mobile Development": "/api/placeholder/800/450",
      "DevOps": "/api/placeholder/800/450"
    };
    
    return imageMap[category] || "/api/placeholder/800/450";
  };

  // Bootstrap color variables to replace Tailwind colors
  const colors = {
    primary: '#198754',
    primaryDark: '#1b5e20',
    primaryLight: '#d1e7dd',
    light: '#f8f9fa',
    white: '#ffffff'
  };

  return (
    <div className="font-sans">
      {/* Hero Section - Modern and Clean */}
      <section style={{ backgroundColor: colors.primary }} className="text-white py-5">
        <Container className="py-5">
          <Row className="align-items-center gy-4">
            <Col lg={6} className="text-center text-lg-start">
              <div className="mb-4">
                <h1 className="display-4 fw-bold">
                  Master <span style={{ color: colors.primaryLight }}>Coding Skills</span> With Expert-Led Courses
                </h1>
                <p className="lead opacity-90">
                  Learn from industry experts and build real-world projects to advance your career in tech
                </p>
              </div>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Button 
                  variant="light" 
                  className="d-inline-flex align-items-center gap-2 px-4 py-2 fw-semibold"
                  style={{ color: colors.primary }}
                  as={Link} 
                  to="/courses"
                >
                  Explore Courses <ArrowRight size={18} />
                </Button>
                <Button 
                  variant="outline-light" 
                  className="px-4 py-2 fw-semibold"
                  as={Link} 
                  to="/instructor"
                >
                  Become an Instructor
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <div className="position-relative">
                <div 
                  className="position-absolute rounded-circle opacity-25"
                  style={{ 
                    backgroundColor: colors.primaryDark,
                    width: "6rem", 
                    height: "6rem",
                    top: "-1rem",
                    left: "-1rem",
                    zIndex: 0
                  }}
                ></div>
                <div 
                  className="position-absolute rounded-circle opacity-25"
                  style={{ 
                    backgroundColor: colors.primaryDark,
                    width: "8rem", 
                    height: "8rem",
                    bottom: "-1rem",
                    right: "-1rem",
                    zIndex: 0
                  }}
                ></div>
                <img
                  src="/api/placeholder/600/400"
                  alt="Student learning coding"
                  className="rounded-4 shadow img-fluid w-100 object-fit-cover"
                  style={{ height: "320px", position: "relative", zIndex: 1 }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Bar */}
      <section className="bg-white py-3 shadow-sm">
        <Container>
          <Row className="justify-content-center justify-content-md-between text-center text-md-start">
            <Col xs={6} md={3} className="p-4">
              <p className="display-6 fw-bold mb-0" style={{ color: colors.primary }}>150+</p>
              <p className="text-secondary">Expert Instructors</p>
            </Col>
            <Col xs={6} md={3} className="p-4">
              <p className="display-6 fw-bold mb-0" style={{ color: colors.primary }}>500+</p>
              <p className="text-secondary">Quality Courses</p>
            </Col>
            <Col xs={6} md={3} className="p-4">
              <p className="display-6 fw-bold mb-0" style={{ color: colors.primary }}>25k+</p>
              <p className="text-secondary">Happy Students</p>
            </Col>
            <Col xs={6} md={3} className="p-4">
              <p className="display-6 fw-bold mb-0" style={{ color: colors.primary }}>99%</p>
              <p className="text-secondary">Satisfaction Rate</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Courses Section */}
      <section className="py-5" style={{ backgroundColor: colors.light }}>
        <Container className="py-5">
          <div className="text-center mb-5">
            <h6 className="fw-semibold mb-2" style={{ color: colors.primary }}>FEATURED COURSES</h6>
            <h2 className="display-5 fw-bold mb-3">Top Rated Learning Paths</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: "36rem" }}>
              Start your learning journey with our most popular and highly rated courses
            </p>
          </div>

          <Row xs={1} md={2} lg={3} className="g-4">
            {featuredCourses.map(course => (
              <Col key={course.id}>
                <Card className="h-100 rounded-4 shadow border-0 overflow-hidden">
                  <div style={{ height: "12rem", overflow: "hidden" }}>
                    <Card.Img 
                      src={getCourseImage(course.category)} 
                      alt={course.title}
                      className="img-fluid h-100 w-100 object-fit-cover"
                    />
                  </div>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Badge 
                        pill 
                        bg="success" 
                        text="white" 
                        className="px-3 py-2"
                        style={{ backgroundColor: colors.primaryLight, color: colors.primary }}
                      >
                        {course.category}
                      </Badge>
                      <Badge pill bg="light" text="dark" className="px-3 py-2">
                        {course.level}
                      </Badge>
                    </div>
                    <Card.Title className="fw-bold mb-2">{course.title}</Card.Title>
                    <Card.Text className="text-secondary mb-4" style={{ 
                      display: "-webkit-box", 
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {course.description}
                    </Card.Text>
                    <Button 
                      variant="success" 
                      className="w-100 d-flex align-items-center justify-content-center gap-2"
                      as={Link} 
                      to={`/courses/${course.id}`}
                      style={{ backgroundColor: colors.primary }}
                    >
                      View Course <ArrowRight size={18} />
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-5">
            <Button 
              variant="outline-success" 
              className="px-4 py-2 fw-semibold"
              as={Link}
              to="/courses"
              style={{ borderColor: colors.primary, color: colors.primary }}
            >
              View All Courses
            </Button>
          </div>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-5">
        <Container className="py-5">
          <div className="text-center mb-5">
            <h6 className="fw-semibold mb-2" style={{ color: colors.primary }}>WHY CHOOSE US</h6>
            <h2 className="display-5 fw-bold mb-3">The MasterMind Advantage</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: "36rem" }}>
              We provide the best learning experience for developers at all levels
            </p>
          </div>

          <Row xs={1} md={2} lg={3} className="g-4">
            <Col>
              <Card className="h-100 text-center p-4 border-0" style={{ backgroundColor: colors.light }}>
                <div className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center" 
                  style={{ 
                    backgroundColor: colors.primaryLight, 
                    width: "4rem", 
                    height: "4rem"
                  }}
                >
                  <Award style={{ color: colors.primary }} size={28} />
                </div>
                <Card.Body>
                  <Card.Title className="fw-bold mb-3">Expert Instructors</Card.Title>
                  <Card.Text className="text-secondary">
                    Learn from industry professionals with years of real-world experience in top tech companies
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col>
              <Card className="h-100 text-center p-4 border-0" style={{ backgroundColor: colors.light }}>
                <div className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center" 
                  style={{ 
                    backgroundColor: colors.primaryLight, 
                    width: "4rem", 
                    height: "4rem"
                  }}
                >
                  <BookOpen style={{ color: colors.primary }} size={28} />
                </div>
                <Card.Body>
                  <Card.Title className="fw-bold mb-3">Practical Curriculum</Card.Title>
                  <Card.Text className="text-secondary">
                    Hands-on projects and exercises to reinforce your learning with real-world applications
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col>
              <Card className="h-100 text-center p-4 border-0" style={{ backgroundColor: colors.light }}>
                <div className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center" 
                  style={{ 
                    backgroundColor: colors.primaryLight, 
                    width: "4rem", 
                    height: "4rem"
                  }}
                >
                  <Users style={{ color: colors.primary }} size={28} />
                </div>
                <Card.Body>
                  <Card.Title className="fw-bold mb-3">Community Support</Card.Title>
                  <Card.Text className="text-secondary">
                    Connect with fellow learners and get help when you need it through our active community
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-5" style={{ backgroundColor: colors.light }}>
        <Container className="py-5">
          <div className="text-center mb-5">
            <h6 className="fw-semibold mb-2" style={{ color: colors.primary }}>TESTIMONIALS</h6>
            <h2 className="display-5 fw-bold mb-3">What Our Students Say</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: "36rem" }}>
              Hear from our students who have transformed their careers through our platform
            </p>
          </div>

          <Row xs={1} md={2} lg={3} className="g-4">
            <Col>
              <Card className="h-100 border-0 shadow-sm p-4">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle me-3 d-flex align-items-center justify-content-center" 
                      style={{ 
                        backgroundColor: colors.primaryLight, 
                        color: colors.primary,
                        width: "3rem", 
                        height: "3rem"
                      }}
                    >
                      <span className="fw-bold">JD</span>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0">John Doe</h5>
                      <p className="small text-secondary mb-0">Web Developer</p>
                    </div>
                  </div>
                  <Card.Text className="fst-italic text-secondary mb-3">
                    "The courses here completely transformed my career. Within 6 months of completing the web development bootcamp, I landed my dream job."
                  </Card.Text>
                  <div style={{ color: colors.primary }}>★★★★★</div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col>
              <Card className="h-100 border-0 shadow-sm p-4">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle me-3 d-flex align-items-center justify-content-center" 
                      style={{ 
                        backgroundColor: colors.primaryLight, 
                        color: colors.primary,
                        width: "3rem", 
                        height: "3rem"
                      }}
                    >
                      <span className="fw-bold">SJ</span>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0">Sarah Johnson</h5>
                      <p className="small text-secondary mb-0">Data Scientist</p>
                    </div>
                  </div>
                  <Card.Text className="fst-italic text-secondary mb-3">
                    "The data science course was incredibly practical. The instructors explain complex concepts in an easy-to-understand way with real-world examples."
                  </Card.Text>
                  <div style={{ color: colors.primary }}>★★★★★</div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col>
              <Card className="h-100 border-0 shadow-sm p-4">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle me-3 d-flex align-items-center justify-content-center" 
                      style={{ 
                        backgroundColor: colors.primaryLight, 
                        color: colors.primary,
                        width: "3rem", 
                        height: "3rem"
                      }}
                    >
                      <span className="fw-bold">RM</span>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0">Robert Miller</h5>
                      <p className="small text-secondary mb-0">Mobile Developer</p>
                    </div>
                  </div>
                  <Card.Text className="fst-italic text-secondary mb-3">
                    "The community support is what sets this platform apart. Whenever I got stuck, there was always someone willing to help me solve my problems."
                  </Card.Text>
                  <div style={{ color: colors.primary }}>★★★★★</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 text-center text-white" style={{ backgroundColor: colors.primary }}>
        <Container className="py-5">
          <div className="mx-auto" style={{ maxWidth: "48rem" }}>
            <h2 className="display-5 fw-bold mb-3">Ready to Start Your Learning Journey?</h2>
            <p className="lead mb-4 opacity-90">
              Join thousands of students already learning on our platform and advance your career today.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Button 
                variant="light" 
                className="d-inline-flex align-items-center gap-2 px-4 py-2 fw-semibold"
                style={{ color: colors.primary }}
                as={Link}
                to="/courses"
              >
                Browse All Courses <ArrowRight size={18} />
              </Button>
              <Button 
                variant="outline-light" 
                className="px-4 py-2 fw-semibold"
                as={Link}
                to="/instructor"
              >
                Become an Instructor
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Newsletter Section */}
      {/* <section className="py-5" style={{ backgroundColor: colors.light }}>
        <Container className="py-3">
          <div className="mx-auto text-center" style={{ maxWidth: "48rem" }}>
            <h3 className="fw-bold mb-3">Subscribe to Our Newsletter</h3>
            <p className="text-secondary mb-4">
              Get the latest updates on new courses, promotions, and tech tips directly to your inbox
            </p>
            <Row className="justify-content-center">
              <Col xs={12} sm={10} md={8}>
                <InputGroup className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    style={{ padding: "0.75rem 1rem" }}
                  />
                  <Button 
                    variant="success" 
                    className="px-4 fw-semibold"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Subscribe
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </div>
        </Container>
      </section> */}
    </div>
  );
}