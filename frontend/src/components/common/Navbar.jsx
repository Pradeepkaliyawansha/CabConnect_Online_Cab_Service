import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Car, User, LogOut, Settings } from "lucide-react";

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold"
          >
            <Car className="h-6 w-6" />
            <span>CabHire</span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm">Welcome, {user?.name}</span>

                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/book-cab"
                      className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Book Cab
                    </Link>
                    <Link
                      to="/bookings"
                      className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      My Bookings
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 bg-blue-700 rounded-md hover:bg-blue-800 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
