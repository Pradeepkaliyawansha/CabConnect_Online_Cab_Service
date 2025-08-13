const mongoose = require("mongoose");

const cabSchema = new mongoose.Schema(
  {
    driverName: {
      type: String,
      required: true,
    },
    carModel: {
      type: String,
      required: true,
    },
    licensePlate: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    pricePerKm: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    driverPhone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cab", cabSchema);
