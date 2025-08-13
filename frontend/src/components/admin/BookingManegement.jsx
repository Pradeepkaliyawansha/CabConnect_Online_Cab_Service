import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_BOOKINGS } from "../../graphql/queries";
import { UPDATE_BOOKING_STATUS } from "../../graphql/mutations";
import { Calendar, MapPin, User, Car, Phone, DollarSign } from "lucide-react";

const BookingManagement = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_BOOKINGS);

  const [updateBookingStatus] = useMutation(UPDATE_BOOKING_STATUS, {
    onCompleted: () => {
      refetch();
    },
  });

  if (loading)
    return <div className="text-center py-8">Loading bookings...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error.message}
      </div>
    );

  const bookings = data?.getAllBookings || [];

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

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus({
        variables: { id: bookingId, status: newStatus },
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
        <div className="text-sm text-gray-600">
          Total Bookings: {bookings.length}
        </div>
      </div>

      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Booking Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Booking #{booking.id.slice(-8)}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDate(booking.bookingDate)}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">From:</div>
                        <div className="text-gray-600">
                          {booking.pickupLocation}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                      <div>
                        <div className="font-medium">To:</div>
                        <div className="text-gray-600">
                          {booking.dropLocation}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-green-600">
                        ${booking.totalPrice.toFixed(2)}
                      </span>
                      <span className="text-gray-500">
                        ({booking.distance} km)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Customer</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{booking.user.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">
                        {booking.user.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{booking.user.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Cab & Actions */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Cab Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-gray-400" />
                      <span>{booking.cab.carModel}</span>
                    </div>
                    <div className="text-gray-600">
                      Driver: {booking.cab.driverName}
                    </div>
                    <div className="text-gray-600">
                      License: {booking.cab.licensePlate}
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Status:
                    </label>
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusUpdate(booking.id, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Bookings Found
            </h3>
            <p className="text-gray-600">No bookings have been made yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;
