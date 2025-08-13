import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_STATS } from "../../graphql/queries";
import CabManagement from "./CabManagement";
import UserManagement from "./UserManagement";
import BookingManagement from "./BookingManagement";
import { Car, Users, Calendar, DollarSign, Settings } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { data, loading, error } = useQuery(GET_DASHBOARD_STATS);

  if (loading)
    return <div className="text-center py-8">Loading dashboard...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error.message}
      </div>
    );

  const stats = data?.getDashboardStats;

  const tabs = [
    { id: "overview", label: "Overview", icon: Settings },
    { id: "cabs", label: "Cab Management", icon: Car },
    { id: "users", label: "User Management", icon: Users },
    { id: "bookings", label: "Booking Management", icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Users
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats?.totalUsers || 0}
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
                    Total Cabs
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats?.totalCabs || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats?.totalBookings || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${stats?.totalRevenue?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab("cabs")}
                className="p-4 border border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <Car className="h-6 w-6 text-blue-600 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Manage Cabs</div>
                  <div className="text-sm text-gray-600">
                    Add, edit, or remove cabs
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("users")}
                className="p-4 border border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <Users className="h-6 w-6 text-blue-600 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Manage Users</div>
                  <div className="text-sm text-gray-600">
                    View and manage user accounts
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("bookings")}
                className="p-4 border border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Manage Bookings</div>
                  <div className="text-sm text-gray-600">
                    View and update booking status
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other Tabs */}
      {activeTab === "cabs" && <CabManagement />}
      {activeTab === "users" && <UserManagement />}
      {activeTab === "bookings" && <BookingManagement />}
    </div>
  );
};

export default AdminDashboard;
