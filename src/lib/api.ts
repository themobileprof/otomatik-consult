import { z } from 'zod';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Types
export type BookingType = 'free' | 'paid';

export interface Booking {
  id: number;
  date: string;
  time: string;
  endTime?: string;
  type: BookingType;
  cost: string;
  email: string;
  createdAt: string;
}

export interface User {
  email: string;
  name: string;
  picture: string;
  role: 'user' | 'admin';
  sub: string;
}

export interface TimeSlot {
  from: number;
  to: number;
}

export interface AvailabilityResponse {
  unavailable: Record<string, TimeSlot[]>;
  workDays: number[];
  workStart: number;
  workEnd: number;
  bufferMinutes: number;
}

// API Client
class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    };
  }

  // Auth
  async googleSignIn(credential: string): Promise<{ token: string; user: User }> {
    const response = await axios.post(`${BASE_URL}/api/auth/google`, { credential }, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  // Booking Endpoints
  async createBooking(data: any) {
    const response = await axios.post(`${BASE_URL}/api/bookings`, data, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async getBookings() {
    const response = await axios.get(`${BASE_URL}/api/bookings`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async getAvailability() {
    const response = await axios.get(`${BASE_URL}/api/bookings/availability`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  // Payment Endpoints
  async initiatePayment(data: any) {
    const response = await axios.post(
      `${BASE_URL}/api/payment/flutterwave/initiate`,
      data,
      {
        headers: this.getHeaders(),
      }
    );
    return response.data;
  }

  async verifyPayment(transactionId: string, bookingData: any) {
    const response = await axios.post(
      `${BASE_URL}/api/payment/flutterwave/verify`,
      {
        transaction_id: transactionId,
        booking_data: bookingData,
      },
      {
        headers: this.getHeaders(),
      }
    );
    return response.data;
  }

  // Admin Endpoints
  async getUsers() {
    const response = await axios.get(`${BASE_URL}/api/admin/users`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async updateUserRole(userId: number, role: 'user' | 'admin') {
    const response = await axios.patch(
      `${BASE_URL}/api/admin/users/${userId}/role`,
      { role },
      {
        headers: this.getHeaders(),
      }
    );
    return response.data;
  }

  async getSettings() {
    const response = await axios.get(`${BASE_URL}/api/admin/settings`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async updateSettings(data: {
    workDays: number[];
    workStart: number;
    workEnd: number;
    bufferMinutes: number;
  }) {
    const response = await axios.patch(
      `${BASE_URL}/api/admin/settings`,
      data,
      {
        headers: this.getHeaders(),
      }
    );
    return response.data;
  }

  async getStats() {
    const response = await axios.get(`${BASE_URL}/api/admin/stats`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }
}

export const api = new ApiClient(); 