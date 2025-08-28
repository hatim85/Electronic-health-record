import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        EHR-System
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <span className="font-medium text-gray-700">
              {user.role.toUpperCase()}
            </span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
