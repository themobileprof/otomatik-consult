import { z } from 'zod';

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
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'An error occurred' }));
      throw new Error(error.error || 'An error occurred');
    }

    return response.json();
  }

  // Auth
  async googleSignIn(credential: string): Promise<{ token: string; user: User }> {
    return this.request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
  }

  // Bookings
  async createBooking(booking: {
    date: string;
    time: string;
    endTime?: string;
    type: BookingType;
    email: string;
  }): Promise<{ message: string; booking: Booking }> {
    return this.request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  async getBookings(): Promise<Booking[]> {
    return this.request('/api/bookings');
  }

  async getAvailability(): Promise<AvailabilityResponse> {
    return this.request('/api/bookings/availability');
  }

  // Payments
  async initiatePayment(data: {
    amount: string;
    email: string;
    name: string;
    tx_ref: string;
    redirect_url: string;
    booking_data?: {
      date: string;
      time: string;
      endTime: string;
      type: BookingType;
      email: string;
    };
  }): Promise<{ status: string; message: string; data: { link: string } }> {
    return this.request('/api/payment/flutterwave/initiate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyPayment(transactionId: string, bookingData?: {
    date: string;
    time: string;
    endTime: string;
    type: BookingType;
    email: string;
  }): Promise<{ status: string; message: string; data: any }> {
    return this.request('/api/payment/flutterwave/verify', {
      method: 'POST',
      body: JSON.stringify({ 
        transaction_id: transactionId,
        booking_data: bookingData
      }),
    });
  }
}

export const api = new ApiClient(); 