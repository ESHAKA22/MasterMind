import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getCourseImage } from '../utils/imageUtils';
import { BsClock } from 'react-icons/bs';

function CourseCard({ course, showInstructorOptions, onDelete }) {
  if (!course) return null;
  
  const { id, title, description, category, level, language, duration, colors, tags } = course;
  
  return (
    <Card 
      className="h-100 border-0 shadow-sm hover-card" 
      style={{ 
        borderRadius: '12px', 
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Card.Img 
        variant="top" 
        src={getCourseImage(category)}
        style={{ 
          height: '370px', 
          objectFit: 'cover',
          backgroundColor: '#f8f9fa',
        }}
        alt={`${title} course image`}
      />
      <div 
        style={{ 
          height: '6px', 
          background: colors?.border || '#4169e1' 
        }} 
      />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex flex-wrap justify-content-between align-items-start mb-2 gap-2">
          <Badge 
            bg="secondary" 
            pill
            style={{
              backgroundColor: '#6c757d',
              padding: '5px 10px',
              fontSize: '0.8rem'
            }}
          >
            {category || 'General'}
          </Badge>
          <Badge 
            bg="info" 
            pill
            style={{
              backgroundColor: level === 'Beginner' ? '#28a745' : 
                              level === 'Intermediate' ? '#fd7e14' : '#dc3545',
              padding: '5px 10px',
              fontSize: '0.8rem'
            }}
          >
            {level || 'All Levels'}
          </Badge>
        </div>
        
        <Card.Title 
          className="fw-bold mb-2"
          style={{ color: colors?.text || '#333', fontSize: '1.25rem' }}
        >
          {title || 'Untitled Course'}
        </Card.Title>
        
        {/* Duration and language information */}
        <div className="d-flex flex-wrap align-items-center gap-3 mb-3 text-muted small">
          {duration && (
            <div className="d-flex align-items-center">
              <BsClock className="me-1" />
              {duration}
            </div>
          )}
          {language && (
            <div>
              <span className="fw-medium">Language:</span> {language}
            </div>
          )}
        </div>
        
        <Card.Text 
          className="mb-3 flex-grow-1"
          style={{ fontSize: '0.9rem' }}
        >
          {description?.length > 100 
            ? `${description.substring(0, 100)}...` 
            : description || 'No description available'}
        </Card.Text>
        
        {/* Display tags if available */}
        {tags && tags.length > 0 && (
          <div className="mb-3 d-flex flex-wrap gap-1">
            {tags.slice(0, 3).map(tag => (
              <Badge 
                key={tag} 
                bg="light" 
                text="dark" 
                className="rounded-pill"
                style={{ fontSize: '0.7rem' }}
              >
                #{tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge 
                bg="light" 
                text="dark" 
                className="rounded-pill"
                style={{ fontSize: '0.7rem' }}
              >
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="mt-auto pt-3 d-flex justify-content-between align-items-center border-top">
          {showInstructorOptions ? (
            <>
              <Button 
                as={Link} 
                to={`/edit-course/${id}`}
                variant="outline-primary"
                size="sm"
                style={{
                  borderColor: colors?.buttonBg || '#4169e1',
                  color: colors?.buttonBg || '#4169e1',
                }}
              >
                Edit
              </Button>
              <Button 
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(id)}
              >
                Delete
              </Button>
            </>
          ) : (
            <Button 
              as={Link} 
              to={`/courses/${id}`}
              variant="primary"
              className="w-100"
              style={{
                backgroundColor: colors?.buttonBg || '#4169e1',
                borderColor: colors?.buttonBg || '#4169e1',
                fontWeight: '600'
              }}
            >
              View Course
            </Button>
          )}
        </div>
      </Card.Body>
      
      <style jsx>{`
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </Card>
  );
}

export default CourseCard;