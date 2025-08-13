const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    phone: String!
    role: String!
    createdAt: String!
  }

  type Cab {
    id: ID!
    driverName: String!
    carModel: String!
    licensePlate: String!
    capacity: Int!
    pricePerKm: Float!
    location: String!
    isAvailable: Boolean!
    driverPhone: String!
    createdAt: String!
  }

  type Booking {
    id: ID!
    user: User!
    cab: Cab!
    pickupLocation: String!
    dropLocation: String!
    distance: Float!
    totalPrice: Float!
    status: String!
    bookingDate: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    phone: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CabInput {
    driverName: String!
    carModel: String!
    licensePlate: String!
    capacity: Int!
    pricePerKm: Float!
    location: String!
    driverPhone: String!
  }

  input BookingInput {
    cabId: ID!
    pickupLocation: String!
    dropLocation: String!
    distance: Float!
  }

  type Query {
    getUsers: [User!]!
    getCabs: [Cab!]!
    getAvailableCabs: [Cab!]!
    getUserBookings: [Booking!]!
    getAllBookings: [Booking!]!
    getDashboardStats: DashboardStats!
  }

  type DashboardStats {
    totalUsers: Int!
    totalCabs: Int!
    totalBookings: Int!
    totalRevenue: Float!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    addCab(input: CabInput!): Cab!
    updateCab(id: ID!, input: CabInput!): Cab!
    deleteCab(id: ID!): Boolean!
    bookCab(input: BookingInput!): Booking!
    updateBookingStatus(id: ID!, status: String!): Booking!
  }
`;

module.exports = { typeDefs };
