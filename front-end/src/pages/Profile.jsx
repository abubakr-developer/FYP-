import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const Profile = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Cloudinary configuration
  const CLOUDINARY_UPLOAD_PRESET = "upload-data";
  const CLOUDINARY_CLOUD_NAME = "dwzvloht8";
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

  const uploadToCloudinary = async (file, resourceType = "image") => {
    console.log("Uploading file:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("resource_type", resourceType);

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Cloudinary Response:", response.data);
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(`Failed to upload file to Cloudinary: ${error.response?.data?.error?.message || error.message}`);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch("http://localhost:5000/api/auth/getCurrentUser", {
          method: 'GET',
           headers: {
              'Authorization': `Bearer ${token}`, // token from localStorage or context
              'Content-Type': 'application/json'
  },
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          // Split name into firstname and lastname
          const [firstname, ...lastnameParts] = (data.name || "User").split(" ");
          setValue("firstname", firstname || "");
          setValue("lastname", lastnameParts.join(" ") || "");
          setProfileImage(data.profileImage || "https://via.placeholder.com/40");
          setUserId(data._id);
          localStorage.setItem("name", data.name || "User");
          localStorage.setItem('id', data._id);
          localStorage.setItem("profileImage", data.profileImage || "https://via.placeholder.com/40");
        } else {
          alert("Please login to view profile");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        alert("Error loading profile");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchUser();
  }, [setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let profileImageUrl = profileImage;
      if (profileImage && typeof profileImage !== "string") {
        profileImageUrl = await uploadToCloudinary(profileImage);
      }

      const updateData = {
        name: `${data.firstname} ${data.lastname}`.trim(),
        profileImage: profileImageUrl,
      };

      console.log("Update Data:", updateData);

      const res = await fetch(`http://localhost:5000/api/auth/updateProfile/${userId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      
      const result = await res.json();
      console.log("Backend Response:", result);

      if (res.ok) {
        alert("Profile updated successfully!");
        setProfileImage(profileImageUrl);
        localStorage.setItem("name", updateData.name);
        localStorage.setItem("profileImage", profileImageUrl);
      } else {
        alert(result.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Error updating profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        alert("Please upload a valid image (JPEG, PNG, or GIF)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Profile image must be less than 5MB");
        return;
      }
      setProfileImage(file);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 min-h-screen">
      <div className="w-full max-w-2xl my-8">
        <div className="bg-gradient-to-br from-black via-gray-700 to-black rounded-2xl shadow-2xl overflow-hidden">
          <div className="py-6 px-8">
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            <p className="text-blue-200 mt-1">Update your profile details</p>
          </div>
          <div className="p-8">
            {fetchLoading ? (
              <p className="text-lg font-semibold text-white text-center">Loading profile...</p>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full bg-gray-100 mb-4 overflow-hidden border-4 border-white shadow-lg">
                    {profileImage ? (
                      <img
                        src={typeof profileImage === "string" ? profileImage : URL.createObjectURL(profileImage)}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-14 w-14"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                    Upload Profile Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      {...register("firstname", { required: "First name is required" })}
                      className="w-full text-white px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname.message}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="Enter your last name"
                      {...register("lastname", { required: "Last name is required" })}
                      className="w-full text-white px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname.message}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !userId}
                  className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all ${isLoading || !userId ? "opacity-80 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;