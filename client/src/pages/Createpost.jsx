import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

export default function CreateBeutyshop() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  console.log(formData);

  const navigate = useNavigate();

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: [downloadURL] }); // Note the array brackets
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8081/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        alert("success");
        navigate(``);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="relative bg-slate-100">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-200 to-slate-100"></div>

      {/* Content container */}
      <div className="relative min-h-screen flex justify-center items-center py-12">
        <div className="w-full max-w-2xl px-4">
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            {/* Header bar */}
            <div className="bg-slate-800 px-8 py-4">
              <h1 className="text-2xl font-semibold text-white">
                Create New Challenge
              </h1>
            </div>

            {/* Form content */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload Area */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Post Image
                  </label>
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="uploadInput"
                      className="flex-1 h-14 flex items-center justify-center bg-slate-50 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-100 transition"
                    >
                      <span className="text-slate-600 font-medium flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Select Image
                      </span>
                      <input
                        id="uploadInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleUpdloadImage}
                      disabled={imageUploadProgress}
                      className="h-14 px-4 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-600 transition disabled:opacity-70"
                    >
                      {imageUploadProgress ? (
                        <div className="w-10 h-10 mx-auto">
                          <CircularProgressbar
                            value={imageUploadProgress}
                            text={`${imageUploadProgress || 0}%`}
                            styles={{
                              path: { stroke: "#fff" },
                              text: { fill: "#fff", fontSize: "24px" },
                            }}
                          />
                        </div>
                      ) : (
                        "Upload Image"
                      )}
                    </button>
                  </div>
                </div>

                {/* Image Preview */}
                {formData.image && (
                  <div className="mt-4">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-slate-200"
                    />
                  </div>
                )}

                {imageUploadError && (
                  <div className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm">
                    {imageUploadError}
                  </div>
                )}

                {/* Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter post title"
                      required
                      className="w-full h-12 px-4 text-slate-800 rounded-lg bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Coding Guide URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/guide"
                      required
                      className="w-full h-12 px-4 text-slate-800 rounded-lg bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      onChange={(e) =>
                        setFormData({ ...formData, ylink: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Coding Challenges URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/challenges"
                      required
                      className="w-full h-12 px-4 text-slate-800 rounded-lg bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      onChange={(e) =>
                        setFormData({ ...formData, glink: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Content Textarea */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Content
                  </label>
                  <textarea
                    placeholder="Write your content here..."
                    required
                    maxLength={1000}
                    className="w-full h-32 p-4 text-slate-800 rounded-lg bg-slate-50 border border-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                  />
                  <div className="mt-1 text-xs text-slate-500 text-right">
                    Max 999 characters
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-12 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                  >
                    Create Post
                  </button>
                </div>

                {/* Publish Error */}
                {publishError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {publishError}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
