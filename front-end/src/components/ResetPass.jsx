import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const ResetPass = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Validate email presence
      if (!email) {
        setError("No email found. Please request an OTP again.");
        setMessage("");
        return;
      }

      // Send reset password request
      const response = await axios.post("http://localhost:5000/api/auth/resetPassword", {
        email,
        otp,
        newPassword: data.newPassword,
      });

      if (response.status === 200) {
        setMessage("Password updated successfully. You can now log in with your new password.");
        setError("");
        setTimeout(() => navigate("/login"), 2000); // Navigate after 2 seconds to show message
      } else {
        setError(response.data.message || "An error occurred. Please try again.");
        setMessage("");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again.");
      setMessage("");
      console.error("Error in reset password:", error);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-700 to-black min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          Reset Your Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label
            htmlFor="new-password-input"
            className="block text-white text-lg font-medium mb-2"
          >
            New Password
          </label>
          <input
            id="new-password-input"
            type="password"
            placeholder="Enter your new password"
            className={`w-full px-4 py-2 bg-gray-800 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
              errors.newPassword ? "border-red-500" : "border-gray-600"
            }`}
            {...register("newPassword", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
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
                    "Update Password"
                  )}
                </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPass;