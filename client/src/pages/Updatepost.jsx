import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from "firebase/storage";
  import { app } from "../firebase";
  import { useEffect, useState } from "react";
  import { CircularProgressbar } from "react-circular-progressbar";
  import "react-circular-progressbar/dist/styles.css";
  import { useNavigate, useParams } from "react-router-dom";
  import girl from "../img/girl2.jpg"


  export default function CreateBeutyshop() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    console.log(formData.id);
  
    const navigate = useNavigate();
    const { postId } = useParams();
    useEffect(() => {
        try {
          const fetchworkout = async () => {
            const res = await fetch(`http://localhost:8081/api/Get?itemId=${postId}`);
            const data = await res.json();
            console.log("data", data);
    
            if (!res.ok) {
              console.log(data.message);
            }
            if (res.ok) {
                const selected = data.find((workout) => workout.id === postId);
                if (selected) {
                  setFormData(selected);
                }
              }
          };
          fetchworkout();
        } catch (error) {
          console.log(error.message);
        }
      }, [postId]);


  
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
          const res = await fetch(`http://localhost:8081/api/update/${formData.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          console.log(data);
          if (!res.ok) {
            setPublishError(data.message);
            return;
          }
    
          if (res.ok) {
            setPublishError(null);
            alert("succesfull")
           
          }
        } catch (error) {
            setPublishError("Something went wrong");
        }
      };
  
    return (
     
      <div className="relative bg-[#d9d9da]">
  <img
    src="https://images.pexels.com/photos/34600/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    alt="Background"
    className="w-full h-[700px] object-cover opacity-90"
  />

<div className="absolute top-0 w-full px-4 py-6 h-screen bg-gradient-to-r from-[#76aff0] to-[#056af05b] via-white">
  <div className="absolute inset-0 px-4 flex justify-center items-start pt-16">

  <div className="grid gap-10 max-h-[580px] scrollbar-none overflow-y-auto scrollbar-thin pr-2">
    <div className="w-full max-w-2xl bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-md">
      <h1 className="text-3xl font-serif text-center text-slate-800 mb-6">
        Update Post
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Area */}
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="uploadInput"
            className="w-1/2 h-24 flex items-center justify-center bg-white hover:bg-gray-200 border border-gray-300 rounded-xl cursor-pointer transition"
          >
            <span className="text-lg text-gray-600 font-medium">📤 Click to Upload</span>
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
            className="w-1/2 h-10 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition"
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16 mx-auto">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            required
            value={formData.title}
            className="w-full h-10 px-4 text-gray-800 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <input
            type="url"
            placeholder="YouTube Link"
            required
            value={formData.ylink}
            className="w-full h-10 px-4 text-gray-800 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => setFormData({ ...formData, ylink: e.target.value })}
          />

          <input
            type="url"
            placeholder="GitHub Link"
            required
            value={formData.glink}
            className="w-full h-10 px-4 text-gray-800 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => setFormData({ ...formData, glink: e.target.value })}
          />
        </div>

        {/* Image Preview */}
        {formData.image && (
          <div className="mt-4">
            <img
              src={formData.image}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>
        )}

        {imageUploadError && (
          <p className="text-red-600 text-center">{imageUploadError}</p>
        )}

        {/* Content Textarea */}
        <textarea
          placeholder="Update your content..."
          required
          maxLength={1000}
          value={formData.content}
          className="w-full h-40 p-4 text-gray-800 rounded-md bg-white border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-28 h-10 bg-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
          >
            Update Post
          </button>
        </div>

        {/* Error */}
        {publishError && (
          <p className="text-red-600 text-center bg-red-100 py-2 rounded-lg">
            {publishError}
          </p>
        )}
      </form>
    </div>
    </div>
  </div>
  </div>
</div>

     
    );
  }
  
  
  
  