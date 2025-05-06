import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600 font-medium">Loading challenges...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100"
        >
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Error Loading Challenges
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchChallenges}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full px-6 py-2.5 shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 w-full">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 backdrop-blur-sm bg-opacity-90"
          >
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
              className="ml-2 hover:opacity-80 transition-opacity"
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
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative h-72 md:h-96 mb-8 w-full overflow-hidden">
        <img
          src="https://images.pexels.com/photos/34600/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Coding challenges banner"
          className="w-full h-full object-cover transform scale-105 transition-transform duration-1000 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-indigo-800/60 backdrop-blur-sm"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-lg tracking-tight">
            Coding Challenges
          </h1>
        </motion.div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 pb-16 -mt-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end mb-8"
        >
          <Link to="/create">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full px-6 py-3 shadow-lg transition-all duration-300 flex items-center gap-2 group"
              aria-label="Create new challenge"
            >
              <span className="group-hover:scale-105 transition-transform">
                New Challenge
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:rotate-45 transition-transform"
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
        </motion.div>

        {workouts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-12 text-center border border-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
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
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              No challenges yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first coding challenge to get started!
            </p>
            <Link to="/create">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full px-6 py-3 shadow-lg transition-all duration-300">
                Create Challenge
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {workouts.map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* <img
                        src="https://images.pexels.com/photos/34600/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt="User avatar"
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 transform hover:scale-105 transition-transform"
                      /> */}
                      <div>
                        {/* <h3 className="font-semibold text-gray-800 text-lg">
                          Ranyan
                        </h3> */}
                        <p className="text-sm text-gray-500">
                          {moment(challenge.created).format(
                            "MMM DD, YYYY • h:mm A"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        to={`/updatepost/${challenge.id}`}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
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
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
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

                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                        #coding
                      </span>
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                        #challenge
                      </span>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                      {challenge.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {challenge.content}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 my-5">
                    {challenge.glink && (
                      <a
                        href={challenge.glink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors group"
                        aria-label="View coding challenge"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 group-hover:scale-110 transition-transform"
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
                        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors group"
                        aria-label="Watch video guide"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 group-hover:scale-110 transition-transform"
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

                  {challenge.image && challenge.image.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-5 rounded-xl overflow-hidden"
                    >
                      <img
                        src={challenge.image[0]}
                        alt="Challenge visual"
                        className="w-full h-auto max-h-96 object-cover transform hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center px-6 py-4 border-t border-gray-100/50">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLike(challenge.id)}
                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
                    aria-label={`Like this challenge (${challenge.likes} likes)`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`w-6 h-6 ${
                        challenge.likes > 0 ? "text-red-500" : ""
                      }`}
                    >
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                    <span className="text-sm font-medium">
                      {challenge.likes}
                    </span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleComments(challenge.id)}
                    className="ml-8 flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
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
                      className={`w-6 h-6 ${
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
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare(challenge.id)}
                    className="ml-8 flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
                    aria-label="Share this challenge"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">Share</span>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {expandedComments[challenge.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100/50"
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                          <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            maxLength={200}
                            className="w-full px-5 py-3 text-sm rounded-full bg-gray-100/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                            aria-label="Add a comment"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleComment(challenge.id, commentText)
                            }
                            className="px-6 py-3 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-all duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed shadow-md"
                            disabled={!commentText.trim()}
                          >
                            Post
                          </motion.button>
                        </div>

                        {challenge.comments.length > 0 ? (
                          <div className="space-y-4 max-h-96 overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {challenge.comments.map((comment, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-50/50 rounded-xl p-4 backdrop-blur-sm border border-gray-100"
                              >
                                {editingCommentId === comment.id ? (
                                  <div className="flex flex-col gap-3">
                                    <input
                                      type="text"
                                      value={editedCommentText}
                                      onChange={(e) =>
                                        setEditedCommentText(e.target.value)
                                      }
                                      className="w-full px-4 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                      autoFocus
                                      aria-label="Edit comment"
                                    />
                                    <div className="flex justify-end gap-2">
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                          setEditingCommentId(null);
                                          setEditedCommentText("");
                                        }}
                                        className="px-4 py-1.5 text-xs font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                                      >
                                        Cancel
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() =>
                                          handleEditComment(
                                            challenge.id,
                                            comment.id
                                          )
                                        }
                                        className="px-4 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all disabled:bg-blue-300 disabled:cursor-not-allowed"
                                        disabled={!editedCommentText.trim()}
                                      >
                                        Save
                                      </motion.button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                                          {comment.comment &&
                                            comment.comment
                                              .charAt(0)
                                              .toUpperCase()}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                          {moment(comment.createdAt).fromNow()}
                                        </p>
                                      </div>

                                      {currentUser && (
                                        <div className="flex gap-2">
                                          <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            onClick={() => {
                                              setEditingCommentId(comment.id);
                                              setEditedCommentText(
                                                comment.comment
                                              );
                                            }}
                                            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                                            aria-label="Edit comment"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-4 w-4 text-gray-500"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                            >
                                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                          </motion.button>
                                          <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            onClick={() =>
                                              handleDeleteComment(
                                                challenge.id,
                                                comment.id
                                              )
                                            }
                                            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                                            aria-label="Delete comment"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-4 w-4 text-gray-500"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          </motion.button>
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-700">
                                      {comment.comment}
                                    </p>
                                  </>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10">
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-all duration-300"
        aria-label="Back to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      </motion.button>
    </div>
  );
}
