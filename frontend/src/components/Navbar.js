import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">
        IssueTracker Pro
      </h1>

      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="font-semibold">{user?.name}</span>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
            {user?.role}
          </span>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;