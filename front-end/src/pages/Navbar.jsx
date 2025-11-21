import React, { useState } from 'react'

const Navbar = ({ name, profileImage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleCloseModal = (e) => {
    if (e.target.id === 'modal-overlay') {
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <nav className="bg-gradient-to-br from-black via-gray-700 to-black text-white p-4 flex items-center justify-between shadow-lg">
        {/* Logo on the left */}
        <div className="flex items-center">
          <img
            src={profileImage || "https://via.placeholder.com/80"}
            alt="Logo"
            className="h-20 w-20 object-cover mr-4 "
          />
        </div>

        {/* Welcome message in the center */}
        <div className="flex-1 flex justify-center items-center">
          <h1 className="text-2xl font-bold text-white">Welcome, {name || "User"}!</h1>
        </div>

        {/* Profile picture and name as toggle button on the right */}
        <button
          onClick={toggleModal}
          className="flex items-center focus:outline-none hover:bg-gray-800 rounded-full p-2 transition-colors duration-200"
        >
          <img
            src={profileImage || "https://via.placeholder.com/40"}
            alt="Profile"
            className="h-10 w-10 rounded-full mr-2 border-2 border-white"
          />
          <span className="text-sm text-white">{name || "User"}</span>
        </button>
      </nav>

      {/* Modal Pop-up */}
      {isModalOpen && (
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div className="bg-white rounded-lg shadow-xl p-6 w-80 transform transition-all duration-300">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Name</h2>

            <button
              onClick={toggleModal}
              className="mt-4 w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-900 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar