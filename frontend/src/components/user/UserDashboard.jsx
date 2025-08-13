import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GET_USER_BOOKINGS } from "../../graphql/queries";
import {
  Car,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Plus,
  History,
} from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const { data, loading, error } = useQuery(GET_USER_BOOKINGS);

  if (loading)
    return <div className="text-center py-8">Loading dashboard...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error.message}
      </div>
    );

  const bookings = data?.getUserBookings || [];

  // Calculate stats
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(
    (b) => b.status === "completed"
  ).length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const totalSpent = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  // Get recent bookings (last 3)
  const recentBookings = bookings
    .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
    .slice(0, 3);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100">
          Ready to book your next ride? We're here to get you there safely.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/book-cab"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Book a New Ride
              </h3>
              <p className="text-gray-600">
                Find and book available cabs near you
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/bookings"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <History className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                View Booking History
              </h3>
              <p className="text-gray-600">
                Check your past and current bookings
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Bookings
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalBookings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Car className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Completed Rides
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {completedBookings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Pending Bookings
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {pendingBookings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${totalSpent.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Bookings
          </h2>
          <Link
            to="/bookings"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            View All
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">
                        {booking.cab.carModel}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-green-500" />
                        <span>{booking.pickupLocation}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-red-500" />
                        <span>{booking.dropLocation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ${booking.totalPrice.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(booking.bookingDate)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Car className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No bookings yet</p>
            <Link
              to="/book-cab"
              className="inline-block mt-2 text-blue-600 hover:text-blue-500 font-medium"
            >
              Book your first ride
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
