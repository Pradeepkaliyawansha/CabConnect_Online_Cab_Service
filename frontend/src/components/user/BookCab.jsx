import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_AVAILABLE_CABS } from "../../graphql/queries";
import { BOOK_CAB_MUTATION } from "../../graphql/mutations";
import { Car, MapPin, Users, DollarSign, Phone } from "lucide-react";

const BookCab = () => {
  const [selectedCab, setSelectedCab] = useState(null);
  const [bookingData, setBookingData] = useState({
    pickupLocation: "",
    dropLocation: "",
    distance: "",
  });
  const [step, setStep] = useState(1); // 1: Enter details, 2: Select cab, 3: Confirm
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { data, loading, error: queryError } = useQuery(GET_AVAILABLE_CABS);

  const [bookCab, { loading: bookingLoading }] = useMutation(
    BOOK_CAB_MUTATION,
    {
      onCompleted: () => {
        navigate("/bookings");
      },
      onError: (error) => {
        setError(error.message);
      },
    }
  );

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    if (
      !bookingData.pickupLocation ||
      !bookingData.dropLocation ||
      !bookingData.distance
    ) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleCabSelect = (cab) => {
    setSelectedCab(cab);
    setStep(3);
  };

  const handleBooking = async () => {
    if (!selectedCab) return;

    try {
      await bookCab({
        variables: {
          input: {
            cabId: selectedCab.id,
            pickupLocation: bookingData.pickupLocation,
            dropLocation: bookingData.dropLocation,
            distance: parseFloat(bookingData.distance),
          },
        },
      });
    } catch (err) {
      // Error handled in onError callback
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading available cabs...</div>;
  if (queryError)
    return (
      <div className="text-center py-8 text-red-600">
        Error: {queryError.message}
      </div>
    );

  const availableCabs = data?.getAvailableCabs || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Book a Cab</h1>

      {/* Progress Steps */}
      <div className="flex items-center space-x-4 mb-8">
        <div
          className={`flex items-center space-x-2 ${
            step >= 1 ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            1
          </div>
          <span>Trip Details</span>
        </div>
        <div
          className={`w-8 h-1 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}
        ></div>
        <div
          className={`flex items-center space-x-2 ${
            step >= 2 ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            2
          </div>
          <span>Select Cab</span>
        </div>
        <div
          className={`w-8 h-1 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`}
        ></div>
        <div
          className={`flex items-center space-x-2 ${
            step >= 3 ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            3
          </div>
          <span>Confirm</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Step 1: Trip Details */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Enter Trip Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="pickupLocation"
                  value={bookingData.pickupLocation}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter pickup location"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drop Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="dropLocation"
                  value={bookingData.dropLocation}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter drop location"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance (km)
              </label>
              <input
                type="number"
                name="distance"
                value={bookingData.distance}
                onChange={handleInputChange}
                step="0.1"
                min="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter distance in kilometers"
              />
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Next: Select Cab
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Cab */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Select a Cab</h2>
            <button
              onClick={() => setStep(1)}
              className="text-blue-600 hover:text-blue-500"
            >
              ← Back to Details
            </button>
          </div>

          {availableCabs.length > 0 ? (
            <div className="grid gap-4">
              {availableCabs.map((cab) => {
                const totalPrice =
                  parseFloat(bookingData.distance) * cab.pricePerKm;
                return (
                  <div
                    key={cab.id}
                    className="bg-white rounded-lg shadow-md p-6 border-2 border-transparent hover:border-blue-200 cursor-pointer transition-colors"
                    onClick={() => handleCabSelect(cab)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {cab.carModel}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4" />
                            <span>Driver: {cab.driverName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Capacity: {cab.capacity} passengers</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>Location: {cab.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{cab.driverPhone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          Rate: ${cab.pricePerKm}/km
                        </div>
                        <div className="text-xl font-bold text-green-600">
                          ${totalPrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">Total fare</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Car className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Cabs Available
              </h3>
              <p className="text-gray-600">
                Sorry, there are no available cabs at the moment. Please try
                again later.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Confirm Booking */}
      {step === 3 && selectedCab && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Confirm Your Booking</h2>
            <button
              onClick={() => setStep(2)}
              className="text-blue-600 hover:text-blue-500"
            >
              ← Back to Selection
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Trip Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">From:</span>
                <span className="font-medium">
                  {bookingData.pickupLocation}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To:</span>
                <span className="font-medium">{bookingData.dropLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Distance:</span>
                <span className="font-medium">{bookingData.distance} km</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Cab Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-medium">{selectedCab.carModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Driver:</span>
                <span className="font-medium">{selectedCab.driverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contact:</span>
                <span className="font-medium">{selectedCab.driverPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">License Plate:</span>
                <span className="font-medium">{selectedCab.licensePlate}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Fare:</span>
              <span className="text-2xl font-bold text-blue-600">
                $
                {(
                  parseFloat(bookingData.distance) * selectedCab.pricePerKm
                ).toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Rate: ${selectedCab.pricePerKm}/km × {bookingData.distance} km
            </p>
          </div>

          <button
            onClick={handleBooking}
            disabled={bookingLoading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {bookingLoading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookCab;
