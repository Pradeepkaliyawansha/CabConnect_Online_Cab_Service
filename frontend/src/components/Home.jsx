import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Car, Clock, Shield, Users } from "lucide-react";

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-900">
          Book Your Perfect Ride
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Fast, reliable, and affordable cab services at your fingertips. Book a
          ride in seconds and get to your destination safely.
        </p>

        {!isAuthenticated ? (
          <div className="space-x-4">
            <Link
              to="/register"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-block border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div className="space-x-4">
            {isAdmin ? (
              <Link
                to="/admin"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Go to Admin Panel
              </Link>
            ) : (
              <>
                <Link
                  to="/book-cab"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Book a Cab
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-block border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-4 gap-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Car className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold">Wide Fleet</h3>
          <p className="text-gray-600">
            Choose from a variety of vehicles to suit your needs and budget.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold">24/7 Service</h3>
          <p className="text-gray-600">
            Book rides anytime, anywhere. We're always available for you.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold">Safe & Secure</h3>
          <p className="text-gray-600">
            All our drivers are verified and vehicles are regularly inspected.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold">Professional Drivers</h3>
          <p className="text-gray-600">
            Experienced and courteous drivers ensuring a comfortable journey.
          </p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-blue-600 text-white rounded-2xl p-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold">10,000+</div>
            <div className="text-blue-200">Happy Customers</div>
          </div>
          <div>
            <div className="text-4xl font-bold">500+</div>
            <div className="text-blue-200">Vehicles Available</div>
          </div>
          <div>
            <div className="text-4xl font-bold">24/7</div>
            <div className="text-blue-200">Customer Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
