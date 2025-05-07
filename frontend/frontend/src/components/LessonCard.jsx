import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { BsPlayCircle, BsQuestionCircle, BsFilePdf, BsFileEarmarkText, 
         BsLockFill, BsUnlockFill, BsDownload, BsCheckCircle } from 'react-icons/bs';

const LessonCard = ({ lesson, isPreviewable, isActive, onClick }) => {
  // Helper to render the appropriate icon for the lesson type
  const getLessonIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return <BsPlayCircle className="me-2 text-primary" />;
      case 'quiz':
        return <BsQuestionCircle className="me-2 text-warning" />;
      case 'pdf':
        return <BsFilePdf className="me-2 text-danger" />;
      default:
        return <BsFileEarmarkText className="me-2 text-info" />;
    }
  };

  return (
    <Card 
      id={`lesson-${lesson.id}`}
      className={`mb-3 shadow-sm border-0 lesson-card ${isActive ? 'active' : ''}`}
      onClick={isPreviewable ? onClick : undefined}
      style={{ 
        cursor: isPreviewable ? 'pointer' : 'not-allowed',
        borderLeft: isActive ? '5px solid #4169e1' : lesson.completed ? '5px solid #28a745' : '1px solid #dee2e6',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Card.Body className="d-flex justify-content-between align-items-center py-3">
        <div className="d-flex align-items-center">
          <div className="me-3 fs-4">
            {lesson.completed ? <BsCheckCircle className="me-2 text-success" /> : getLessonIcon(lesson.lessonType)}
          </div>
          <div>
            <h5 className="mb-1">{lesson.title}</h5>
            <div className="d-flex align-items-center text-muted small">
              <span className="me-2">{lesson.lessonType}</span>
              {lesson.duration && (
                <>
                  <span className="me-2">•</span>
                  <span>{lesson.duration}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center">
          {lesson.resourceUrl && (
            <Button 
              variant="outline-secondary" 
              size="sm" 
              className="me-2 d-flex align-items-center"
              href={lesson.resourceUrl}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              <BsDownload className="me-1" />
            </Button>
          )}
          
          {lesson.previewEnabled ? (
            <Badge bg="success" pill className="px-3 py-2">
              <BsUnlockFill className="me-1" /> Preview
            </Badge>
          ) : isPreviewable ? (
            lesson.completed ? (
              <Badge bg="success" pill className="px-3 py-2">
                <BsCheckCircle className="me-1" /> Completed
              </Badge>
            ) : (
              <Badge bg="primary" pill className="px-3 py-2">
                <BsUnlockFill className="me-1" /> Unlocked
              </Badge>
            )
          ) : (
            <Badge bg="secondary" pill className="px-3 py-2">
              <BsLockFill className="me-1" /> Locked
            </Badge>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default LessonCard;