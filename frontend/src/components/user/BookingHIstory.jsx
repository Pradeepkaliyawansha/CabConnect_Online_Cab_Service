import React from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_BOOKINGS } from "../../graphql/queries";
import { Calendar, MapPin, Car, Phone, DollarSign } from "lucide-react";

const BookingHistory = () => {
  const { data, loading, error } = useQuery(GET_USER_BOOKINGS);

  if (loading)
    return <div className="text-center py-8">Loading your bookings...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error.message}
      </div>
    );

  const bookings = data?.getUserBookings || [];

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
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Booking History</h1>

      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Booking Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
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

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Booked on:</span>
                      <span>{formatDate(booking.bookingDate)}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-700">
                            From:
                          </div>
                          <div className="text-gray-600">
                            {booking.pickupLocation}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-red-700">To:</div>
                          <div className="text-gray-600">
                            {booking.dropLocation}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 pt-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Distance:</span>
                        <span>{booking.distance} km</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          ${booking.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cab Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Cab Details
                  </h4>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Vehicle:</span>
                      <span>{booking.cab.carModel}</span>
                    </div>

                    <div>
                      <span className="font-medium">Driver:</span>
                      <span className="ml-2">{booking.cab.driverName}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Contact:</span>
                      <span>{booking.cab.driverPhone}</span>
                    </div>

                    <div>
                      <span className="font-medium">License Plate:</span>
                      <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                        {booking.cab.licensePlate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Progress Indicator */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Trip Progress</span>
                  <span>{booking.status}</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      booking.status === "completed"
                        ? "bg-green-500 w-full"
                        : booking.status === "confirmed"
                        ? "bg-blue-500 w-2/3"
                        : booking.status === "pending"
                        ? "bg-yellow-500 w-1/3"
                        : "bg-red-500 w-1/4"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Bookings Yet
            </h3>
            <p className="text-gray-600 mb-4">
              You haven't made any bookings yet. Start by booking your first
              ride!
            </p>
            <a
              href="/book-cab"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Book Your First Ride
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
