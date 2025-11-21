import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate(); 

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });

      const result = await res.json();
      console.log(result);

      if (res.ok) {
        alert("Login successful!");
        localStorage.setItem('name', result.user.name || 'User');
        localStorage.setItem('email', result.user.email || '');
        localStorage.setItem('profileImage', result.user.profileImage || 'https://via.placeholder.com/40');
        navigate("/dashboard"); 
      } else {
        alert(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 min-h-screen  ">
      <div className="w-full max-w-md my-8">
        <div className="bg-gradient-to-br from-black via-gray-700 to-black rounded-2xl shadow-2xl overflow-hidden">
          {/* Gradient Header */}
          <div className="py-6 px-8">
            <h1 className="text-3xl font-bold text-white">Login</h1>
            <p className="text-blue-200 mt-1">Welcome back to your account</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block flex left-0 text-gray-300 text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block flex left-0  text-gray-300 text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", { required: "Password is required" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button>
                <a href="/verifyOtp" className="text-sm text-blue-400 hover:underline float-right mb-4">
                  Forgot Password?
                </a>
              </button>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Login
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center text-sm text-gray-400">
              <p>
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-400 hover:underline font-medium">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;