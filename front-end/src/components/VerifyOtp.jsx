import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOtp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle sending OTP
  const onSendOtp = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgetPassword", {
        email: data.email,
      });
      setMessage(response.data.message || "OTP sent to your email");
      setError("");
      setEmail(data.email); // Store email for OTP verification
      setIsOtpSent(true); // Switch to OTP input form
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const onVerifyOtp = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verifyOtp", {
        email,
        otp: data.otp,
      });
      setMessage(response.data.message || "OTP verified successfully");
      setError("");
      // Navigate to reset password page or another route
      navigate(`/resetPassword?email=${email}&otp=${data.otp}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to verify OTP");
      setMessage("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-700 to-black min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          {isOtpSent ? "Verify OTP" : "Request OTP"}
        </h2>

        {!isOtpSent ? (
          // Form to send OTP
          <form onSubmit={handleSubmit(onSendOtp)}>
            <label
              htmlFor="email-input"
              className="block text-white text-lg font-medium mb-2"
            >
              Email
            </label>
            <input
              id="email-input"
              type="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-2 bg-gray-800 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                errors.email ? "border-red-500" : "border-gray-600"
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
                    "Send OTP"
                  )}
                </button>
          </form>
        ) : (
          // Form to verify OTP
          <form onSubmit={handleSubmit(onVerifyOtp)}>
            <label
              htmlFor="otp-input"
              className="block text-white text-lg font-medium mb-2"
            >
              Enter OTP
            </label>
            <input
              id="otp-input"
              type="text"
              placeholder="Enter the OTP"
              className={`w-full px-4 py-2 bg-gray-800 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                errors.otp ? "border-red-500" : "border-gray-600"
              }`}
              {...register("otp", {
                required: "OTP is required",
                minLength: {
                  value: 6,
                  message: "OTP must be 6 digits",
                },
                maxLength: {
                  value: 6,
                  message: "OTP must be 6 digits",
                },
              })}
            />
            {errors.otp && (
              <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
                <button
                  type="submit"
                  onClick={handleSubmit}
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
                    "Verify OTP"
                  )}
                </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;