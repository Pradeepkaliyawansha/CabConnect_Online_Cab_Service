const User = require("../models/User");
const Cab = require("../models/Cab");
const Booking = require("../models/Booking");
const jwt = require("jsonwebtoken");
const {
  AuthenticationError,
  ForbiddenError,
} = require("apollo-server-express");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const requireAuth = (user) => {
  if (!user) {
    throw new AuthenticationError("You must be logged in");
  }
};

const requireAdmin = (user) => {
  requireAuth(user);
  if (user.role !== "admin") {
    throw new ForbiddenError("Admin access required");
  }
};

const resolvers = {
  Query: {
    getUsers: async (_, __, { user }) => {
      requireAdmin(user);
      return await User.find().select("-password");
    },

    getCabs: async () => {
      return await Cab.find();
    },

    getAvailableCabs: async () => {
      return await Cab.find({ isAvailable: true });
    },

    getUserBookings: async (_, __, { user }) => {
      requireAuth(user);
      return await Booking.find({ user: user.userId })
        .populate("user")
        .populate("cab");
    },

    getAllBookings: async (_, __, { user }) => {
      requireAdmin(user);
      return await Booking.find().populate("user").populate("cab");
    },

    getDashboardStats: async (_, __, { user }) => {
      requireAdmin(user);
      const totalUsers = await User.countDocuments({ role: "user" });
      const totalCabs = await Cab.countDocuments();
      const totalBookings = await Booking.countDocuments();

      const revenue = await Booking.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]);

      const totalRevenue = revenue.length > 0 ? revenue[0].total : 0;

      return {
        totalUsers,
        totalCabs,
        totalBookings,
        totalRevenue,
      };
    },
  },

  Mutation: {
    register: async (_, { input }) => {
      const existingUser = await User.findOne({ email: input.email });
      if (existingUser) {
        throw new Error("User already exists with this email");
      }

      const user = new User(input);
      await user.save();

      const token = generateToken(user._id);
      return { token, user };
    },

    login: async (_, { input }) => {
      const user = await User.findOne({ email: input.email });
      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isValid = await user.comparePassword(input.password);
      if (!isValid) {
        throw new Error("Invalid email or password");
      }

      const token = generateToken(user._id);
      return { token, user };
    },

    addCab: async (_, { input }, { user }) => {
      requireAdmin(user);
      const cab = new Cab(input);
      return await cab.save();
    },

    updateCab: async (_, { id, input }, { user }) => {
      requireAdmin(user);
      return await Cab.findByIdAndUpdate(id, input, { new: true });
    },

    deleteCab: async (_, { id }, { user }) => {
      requireAdmin(user);
      await Cab.findByIdAndDelete(id);
      return true;
    },

    bookCab: async (_, { input }, { user }) => {
      requireAuth(user);

      const cab = await Cab.findById(input.cabId);
      if (!cab || !cab.isAvailable) {
        throw new Error("Cab is not available");
      }

      const totalPrice = input.distance * cab.pricePerKm;

      const booking = new Booking({
        user: user.userId,
        cab: input.cabId,
        pickupLocation: input.pickupLocation,
        dropLocation: input.dropLocation,
        distance: input.distance,
        totalPrice,
      });

      await booking.save();

      // Mark cab as unavailable
      await Cab.findByIdAndUpdate(input.cabId, { isAvailable: false });

      return await Booking.findById(booking._id)
        .populate("user")
        .populate("cab");
    },

    updateBookingStatus: async (_, { id, status }, { user }) => {
      requireAdmin(user);

      const booking = await Booking.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      )
        .populate("user")
        .populate("cab");

      // If booking is completed or cancelled, make cab available again
      if (status === "completed" || status === "cancelled") {
        await Cab.findByIdAndUpdate(booking.cab._id, { isAvailable: true });
      }

      return booking;
    },
  },
};

module.exports = { resolvers };
