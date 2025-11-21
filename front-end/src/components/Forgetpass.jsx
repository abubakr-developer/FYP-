import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

const Forgetpass = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();


  const handleNavigate = () => {
   navigate("/verifyOtp")
  } 
  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });

      const result = await res.json();
      
      if (res.status === 200) {
        setMessage("Password reset email sent successfully. Please check your inbox.");
        setError("");
      } else {
        setError(result.message || "An error occurred. Please try again.");
        setMessage("");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      setMessage("");
      console.error("Error in forget password:", error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-700 to-black min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label 
            htmlFor="email-input" 
            className="block text-white text-lg font-medium mb-2"
          >
            Email
          </label>
          <input 
            id="email-input"
            type="email" 
            placeholder="Enter your Email" 
            className={`w-full px-4 py-2 bg-gray-800 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
              errors.email ? 'border-red-500' : 'border-gray-600'
            }`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
          
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          {message && (
            <p className="text-green-500 text-sm mt-2">{message}</p>
          )}

          <button 
            type="submit"
           onClick={handleNavigate}
            className="block border-2 border-white rounded-md px-4 py-2 hover:bg-gray-200 hover:text-black mt-7 text-white text-lg font-medium mx-auto"
          >
            Send Otp
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forgetpass;