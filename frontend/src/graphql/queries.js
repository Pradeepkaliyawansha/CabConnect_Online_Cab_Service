import { gql } from "@apollo/client";

export const GET_CABS = gql`
  query GetCabs {
    getCabs {
      id
      driverName
      carModel
      licensePlate
      capacity
      pricePerKm
      location
      isAvailable
      driverPhone
      createdAt
    }
  }
`;

export const GET_AVAILABLE_CABS = gql`
  query GetAvailableCabs {
    getAvailableCabs {
      id
      driverName
      carModel
      licensePlate
      capacity
      pricePerKm
      location
      isAvailable
      driverPhone
    }
  }
`;

export const GET_USER_BOOKINGS = gql`
  query GetUserBookings {
    getUserBookings {
      id
      pickupLocation
      dropLocation
      distance
      totalPrice
      status
      bookingDate
      cab {
        driverName
        carModel
        licensePlate
        driverPhone
      }
    }
  }
`;

export const GET_ALL_BOOKINGS = gql`
  query GetAllBookings {
    getAllBookings {
      id
      pickupLocation
      dropLocation
      distance
      totalPrice
      status
      bookingDate
      user {
        name
        email
        phone
      }
      cab {
        driverName
        carModel
        licensePlate
      }
    }
  }
`;

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    getDashboardStats {
      totalUsers
      totalCabs
      totalBookings
      totalRevenue
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      email
      phone
      role
      createdAt
    }
  }
`;
