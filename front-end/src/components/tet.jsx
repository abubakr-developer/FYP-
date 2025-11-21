import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Newpage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem('name');
    const userEmail = localStorage.getItem('email');
    
    if (!userName || !userEmail) {
      navigate('/login');
      return;
    }

    setName(userName);
    setEmail(userEmail);
    
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-400 flex flex-col items-center justify-center p-6">
      <div className={`max-w-2xl w-full bg-gradient-to-br from-black via-gray-800 to-black rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-800 to-blue-600 py-8 px-8 text-center">
          <h1 className="text-4xl font-bold text-white animate-pulse">
            Welcome to Auth System
          </h1>
          <div className="w-20 h-1 bg-blue-300 mx-auto mt-4 rounded-full animate-bounce"></div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg mb-6 animate-spin-slow">
              <span className="text-5xl text-white font-bold">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2 animate-fade-in">
              Hello, {name}!
            </h2>
            <p className="text-gray-300 mb-6 animate-fade-in-delay">
              {email}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg hover:bg-opacity-70 transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-blue-300 font-semibold">Dashboard</h3>
            </div>
            <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg hover:bg-opacity-70 transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-blue-300 font-semibold">Profile</h3>
            </div>
            <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg hover:bg-opacity-70 transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-blue-300 font-semibold">Settings</h3>
            </div>
          </div>

          <div className="pt-6 text-center">
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Floating elements for decoration */}
      <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-blue-500 opacity-20 animate-float-1"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-indigo-500 opacity-20 animate-float-2"></div>
      <div className="absolute top-1/3 right-1/3 w-12 h-12 rounded-full bg-blue-400 opacity-20 animate-float-3"></div>
    </div>
  );
};

export default Newpage;