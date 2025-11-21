import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [profileImage, setProfileImage] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cloudinary configuration
  const CLOUDINARY_UPLOAD_PRESET = "upload-data";
  const CLOUDINARY_CLOUD_NAME = "dwzvloht8";
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

  const uploadToCloudinary = async (file, resourceType = "auto") => {
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

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let profileImageUrl = "";
      let documentFileUrl = "";

      if (profileImage) {
        profileImageUrl = await uploadToCloudinary(profileImage, "image");
        console.log("Profile Image URL:", profileImageUrl);
      }

      if (documentFile) {
        documentFileUrl = await uploadToCloudinary(documentFile, "auto");
        console.log("Document URL:", documentFileUrl);
      }

      const formData = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        profileImage: profileImageUrl,
        document: documentFileUrl,
      };

      console.log("Form Data:", formData);

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      console.log("Backend Response:", result);

      if (res.ok) {

        alert("Registration successful!");
        navigate("/login");
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error registering:", error.message);
      alert(`Registration failed: ${error.message}`);
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validDocTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!validDocTypes.includes(file.type)) {
        alert("Please upload a valid document (PDF, DOC, or DOCX)");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("Document must be less than 10MB");
        return;
      }
      setDocumentFile(file);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 min-h-screen">
      <div className="w-full max-w-2xl my-8">
        <div className="bg-gradient-to-br from-black via-gray-700 to-black rounded-2xl shadow-2xl overflow-hidden">
          <div className="py-6 px-8">
            <h1 className="text-3xl font-bold text-white">Register</h1>
            <p className="text-blue-200 mt-1">Create your account to get started</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 rounded-full bg-gray-100 mb-4 overflow-hidden border-4 border-white shadow-lg">
                  {profileImage ? (
                    <img
                      src={URL.createObjectURL(profileImage)}
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
                {errors.image && (
                  <p className="text-red-500 text-sm mt-2">{errors.image.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block flex left-0 text-gray-300 text-sm font-medium mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    {...register("firstname", { required: "First name is required" })}
                    className="w-full px-4 text-white py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.firstname && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstname.message}</p>
                  )}
                </div>

                <div>
                  <label className="block flex left-0 text-gray-300 text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    {...register("lastname", { required: "Last name is required" })}
                    className="w-full text-white px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.lastname && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastname.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block flex left-0 text-gray-300 text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full text-white px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block flex left-0 text-gray-300 text-sm font-medium mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      {...register("password", { required: "Password is required" })}
                      className="w-full text-white px-4 py-3 border border-gray-300 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block flex left-0 text-gray-300 text-sm font-medium mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) => value === watch("password") || "Passwords do not match",
                      })}
                      className="w-full text-white px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block flex left-0 text-gray-300 text-sm font-medium mb-2">
                    Upload Document (CV/Resume)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center transition-all hover:border-blue-400">
                    {documentFile ? (
                      <p className="text-green-600 font-medium">{documentFile.name}</p>
                    ) : (
                      <p className="text-gray-500">Drag & drop your file here or click to browse</p>
                    )}
                    <label className="cursor-pointer inline-block mt-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                      Select File
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {errors.file && (
                    <p className="text-red-500 text-xs mt-1">{errors.file.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all ${
                    isLoading ? "opacity-80 cursor-not-allowed" : ""
                  }`}
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
                      Processing...
                    </span>
                  ) : (
                    "Register Now"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-400">
                <p>
                  By registering, you agree to our{" "}
                  <Link to="/terms" className="text-blue-600 hover:underline font-medium">
                    Terms & Conditions
                  </Link>
                </p>
                <p className="mt-2">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 hover:underline font-medium">
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Register;