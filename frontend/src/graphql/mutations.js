import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
        phone
        role
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        name
        email
        phone
        role
      }
    }
  }
`;

export const ADD_CAB_MUTATION = gql`
  mutation AddCab($input: CabInput!) {
    addCab(input: $input) {
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

export const UPDATE_CAB_MUTATION = gql`
  mutation UpdateCab($id: ID!, $input: CabInput!) {
    updateCab(id: $id, input: $input) {
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

export const DELETE_CAB_MUTATION = gql`
  mutation DeleteCab($id: ID!) {
    deleteCab(id: $id)
  }
`;

export const BOOK_CAB_MUTATION = gql`
  mutation BookCab($input: BookingInput!) {
    bookCab(input: $input) {
      id
      pickupLocation
      dropLocation
      distance
      totalPrice
      status
      bookingDate
    }
  }
`;

export const UPDATE_BOOKING_STATUS = gql`
  mutation UpdateBookingStatus($id: ID!, $status: String!) {
    updateBookingStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;
