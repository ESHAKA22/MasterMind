import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

export default function Post() {
  const { currentUser } = useSelector((state) => state.user);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [notification, setNotification] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/Get`);
      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }
      const data = await res.json();
      setWorkouts(data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
      setError("Failed to load challenges. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChallenge = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this challenge?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8081/api/delete/${postId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setWorkouts((prev) => prev.filter((workout) => workout.id !== postId));
        setNotification("Challenge deleted successfully");
      } else {
        throw new Error(`Server responded with status: ${res.status}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      setNotification("Failed to delete challenge. Please try again.");
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`http://localhost:8081/api/like/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setWorkouts((prev) =>
          prev.map((w) => (w.id === postId ? { ...w, likes: w.likes + 1 } : w))
        );
        setNotification("Challenge liked!");
      }
    } catch (error) {
      console.error("Error liking post:", error);
      setNotification("Failed to like challenge. Please try again.");
    }
  };

  const handleComment = async (postId, commentText) => {
    if (!commentText.trim()) {
      setNotification("Comment cannot be empty");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8081/api/comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: commentText }),
      });
      if (res.ok) {
        setNotification("Comment added successfully!");
        setCommentText("");
        // Refresh the data instead of reloading the page
        await fetchChallenges();
      } else {
        throw new Error(`Server responded with status: ${res.status}`);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setNotification("Failed to add comment. Please try again.");
    }
  };

  const handleShare = (postId) => {
    const postLink = window.location.origin + `/share/${postId}`;
    navigator.clipboard
      .writeText(postLink)
      .then(() => {
        setNotification("Link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy: ", error);
        setNotification("Failed to copy link. Please try manually.");
      });
  };

  const handleEditComment = async (postId, commentId) => {
    if (!editedCommentText.trim()) {
      setNotification("Comment cannot be empty");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8081/api/comment/${postId}/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: editedCommentText }),
        }
      );

      if (res.ok) {
        setNotification("Comment updated successfully!");
        setEditingCommentId(null);
        setEditedCommentText("");
        // Refresh the data
        await fetchChallenges();
      } else {
        throw new Error(`Server responded with status: ${res.status}`);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      setNotification("Failed to update comment. Please try again.");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8081/api/comment/${postId}/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setNotification("Comment deleted successfully!");
        await fetchChallenges();
      } else {
        throw new Error(`Server responded with status: ${res.status}`);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setNotification("Failed to delete comment. Please try again.");
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading challenges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Challenges
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchChallenges}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-2.5 shadow-md transition-all w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 w-full">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all animate-fade-in">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-white hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Hero section with overlay */}
      <div className="relative h-64 md:h-80 mb-6 w-full">
        <img
          src="https://images.pexels.com/photos/34600/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Coding challenges banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-indigo-800/70"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center shadow-sm">
            Coding Challenges
          </h1>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-5xl mx-auto px-4 pb-16 -mt-10">
        <div className="flex justify-end mb-6 w-full">
          <Link to="/create">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-2.5 shadow-md transition-all flex items-center gap-2"
              aria-label="Create new challenge"
            >
              <span>New Challenge</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Link>
        </div>

        {workouts.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No challenges yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first coding challenge to get started!
            </p>
            <Link to="/create">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-2.5 shadow-md transition-all">
                Create Challenge
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6 w-full">
            {workouts.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full"
              >
                {/* Header with user info and actions */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.pexels.com/photos/34600/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt="User avatar"
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">Ranyan</h3>
                        <p className="text-xs text-gray-500">
                          {moment(challenge.created).format(
                            "MMM DD, YYYY • h:mm A"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/updatepost/${challenge.id}`}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        title="Edit challenge"
                        aria-label="Edit challenge"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDeleteChallenge(challenge.id)}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        title="Delete challenge"
                        aria-label="Delete challenge"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Post content */}
                <div className="p-5">
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        #coding
                      </span>
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        #challenge
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {challenge.title}
                    </h2>
                    <p className="text-gray-700">{challenge.content}</p>
                  </div>

                  {/* Resource links */}
                  <div className="flex flex-col gap-2 my-4">
                    {challenge.glink && (
                      <a
                        href={challenge.glink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        aria-label="View coding challenge"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Coding Challenge</span>
                      </a>
                    )}

                    {challenge.ylink && (
                      <a
                        href={challenge.ylink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                        aria-label="Watch video guide"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                          <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                        </svg>
                        <span>Video Guide</span>
                      </a>
                    )}
                  </div>

                  {/* Post image */}
                  {challenge.image && challenge.image.length > 0 && (
                    <div className="mt-4 rounded-lg overflow-hidden">
                      <img
                        src={challenge.image[0]}
                        alt="Challenge visual"
                        className="w-full h-auto max-h-96 object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>

                {/* Actions bar */}
                <div className="flex items-center px-5 py-3 border-t border-gray-100">
                  <button
                    onClick={() => handleLike(challenge.id)}
                    className="flex items-center gap-1.5 text-gray-700 hover:text-red-600 transition-colors"
                    aria-label={`Like this challenge (${challenge.likes} likes)`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`w-5 h-5 ${
                        challenge.likes > 0 ? "text-red-500" : ""
                      }`}
                    >
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                    <span className="text-sm font-medium">
                      {challenge.likes}
                    </span>
                  </button>

                  <button
                    onClick={() => toggleComments(challenge.id)}
                    className="ml-6 flex items-center gap-1.5 text-gray-700 hover:text-blue-600 transition-colors"
                    aria-label={`${
                      expandedComments[challenge.id] ? "Hide" : "Show"
                    } comments (${challenge.comments.length} comments)`}
                    aria-expanded={
                      expandedComments[challenge.id] ? "true" : "false"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`w-5 h-5 ${
                        expandedComments[challenge.id] ? "text-blue-500" : ""
                      }`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      {challenge.comments.length}
                    </span>
                  </button>

                  <button
                    onClick={() => handleShare(challenge.id)}
                    className="ml-6 flex items-center gap-1.5 text-gray-700 hover:text-green-600 transition-colors"
                    aria-label="Share this challenge"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>

                {/* Comments section */}
                <div
                  className={`border-t border-gray-100 overflow-hidden transition-all duration-300 ${
                    expandedComments[challenge.id] ? "max-h-screen" : "max-h-0"
                  }`}
                >
                  <div className="p-5">
                    {/* Comment input */}
                    <div className="flex items-center gap-3 mb-4">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        maxLength={200}
                        className="w-full px-4 py-2 text-sm rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        aria-label="Add a comment"
                      />
                      <button
                        onClick={() => handleComment(challenge.id, commentText)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                        disabled={!commentText.trim()}
                      >
                        Post
                      </button>
                    </div>

                    {/* Comments list */}
                    {challenge.comments.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {challenge.comments.map((comment, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-3"
                          >
                            {editingCommentId === comment.id ? (
                              <div className="flex flex-col gap-2">
                                <input
                                  type="text"
                                  value={editedCommentText}
                                  onChange={(e) =>
                                    setEditedCommentText(e.target.value)
                                  }
                                  className="w-full px-3 py-1.5 text-sm rounded bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                  autoFocus
                                  aria-label="Edit comment"
                                />
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingCommentId(null);
                                      setEditedCommentText("");
                                    }}
                                    className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleEditComment(
                                        challenge.id,
                                        comment.id
                                      )
                                    }
                                    className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                                    disabled={!editedCommentText.trim()}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                                      {comment.comment &&
                                        comment.comment.charAt(0).toUpperCase()}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      {moment(comment.createdAt).fromNow()}
                                    </p>
                                  </div>

                                  {/* Only show edit/delete if user is the comment author */}
                                  {currentUser && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => {
                                          setEditingCommentId(comment.id);
                                          setEditedCommentText(comment.comment);
                                        }}
                                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                                        aria-label="Edit comment"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3.5 w-3.5 text-gray-500"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteComment(
                                            challenge.id,
                                            comment.id
                                          )
                                        }
                                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                                        aria-label="Delete comment"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3.5 w-3.5 text-gray-500"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700">
                                  {comment.comment}
                                </p>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 mx-auto text-gray-300 mb-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <p className="text-gray-500 text-sm">
                          No comments yet. Be the first to comment!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Back to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Add this at the end of your component for accessibility support */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        /* Basic scrollbar styling */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }
        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: #f3f4f6;
        }
      `}</style>
    </div>
  );
}
