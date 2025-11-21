import { Link } from "react-router-dom";

const Sidebar = ({handleLogout}) => {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100 p-4 flex flex-col justify-between border-r border-gray-300">
        <div className="">
          <ul className=" flex flex-col space-y-3">
            <Link 
            to= "/dashboard"
            className="text-gray-700 hover:bg-blue-500 hover:text-white p-2 rounded cursor-pointer transition">
              Dashboard
            </Link>
            <Link
            to= "/profile"
            className="text-gray-700 hover:bg-blue-500 hover:text-white p-2 rounded cursor-pointer transition">
              Profile
            </Link>
            <Link
            to= "/setting"
            className="text-gray-700 hover:bg-blue-500 hover:text-white p-2 rounded cursor-pointer transition">
              Settings
            </Link>
          </ul>
        </div>

        {/* Logout button at the bottom */}
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
