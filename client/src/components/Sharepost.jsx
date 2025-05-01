import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import girl from "../img/new2.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export default function SharePost() {
  const { ShareId } = useParams();
  const [formData, setFormData] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/Get?itemId=${ShareId}`);
        const data = await res.json();

        const selected = data.find((workout) => workout.id === ShareId);
        if (selected) {
          setFormData(selected);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchWorkout();
  }, [ShareId]);

  const handleLike = async () => {
    try {
      const res = await fetch(`http://localhost:8081/api/like/${ShareId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setFormData((prev) => ({ ...prev, likes: prev.likes + 1 }));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleShare = () => {
    const postLink = window.location.href;
    navigator.clipboard.writeText(postLink)
      .then(() => setNotification("Link copied!"))
      .catch(() => setNotification("Failed to copy link."));
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div className="relative w-full">
    <img
      src="https://images.pexels.com/photos/34600/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      alt=""
      className="w-full h-[700px] opacity-95 object-cover"
    />
  
    <div className="absolute top-0 w-full px-4 py-6 bg-[#d9d9da]/90">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 max-h-[650px] scrollbar-none overflow-y-auto scrollbar-thin pr-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl mx-auto relative">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUA61gIlA_YnqrwGhxKIffyTO-f8B1V44Y9ypZDKV2pQ&s"
                  alt="User avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-slate-800 font-medium">Ranyan123</h1>
                  <p className="text-xs text-gray-500">
                    {moment(formData.created).format("YYYY-MM-DD HH:mm:ss")}
                  </p>
                </div>
              </div>
            </div>
  
            <div className="mt-4">
              <p className="text-sm text-blue-700 font-medium">#post #popular</p>
              <p className="text-gray-800">{formData.title}</p>
            </div>
  
            {formData.image && (
              <img
                src={formData.image[0]}
                alt="Post visual"
                className="mt-4 rounded-xl w-full h-80 object-cover"
              />
            )}
  
            <div className="flex items-center gap-4 mt-4">
              <button onClick={handleLike}>
                <FontAwesomeIcon icon={faHeart} className="text-red-600 text-2xl hover:text-red-400" />
              </button>
              <span className="text-xs text-gray-500">{formData.likes} likes</span>
  
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSRxA34bc9afVlpRRAEXhaHkX-KBdT9gn3CUaqJDXftA&s"
                onClick={handleShare}
                alt="Share"
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
  
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700">Yashitha</h3>
              <p className="text-gray-600">{formData.content}</p>
            </div>
  
            <div className="bg-slate-100 rounded-xl mt-4 p-3">
              <h4 className="text-sm text-gray-500 mb-2">Comments</h4>
              <p className="text-gray-500 text-sm">
                Comments are disabled in shared view.
              </p>
            </div>
          </div>
        </div>
  
        {notification && (
          <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-md px-4 py-2 shadow-lg text-sm z-50">
            {notification}
          </div>
        )}
      </div>
    </div>
  </div>
  
  );
}
