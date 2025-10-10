import axios from 'axios';
import authService from './authService';

const API_BASE_URL = 'http://localhost:8080';
const API_URL = `${API_BASE_URL}/api/orders`;

interface CreateOrderRequest {
  userId: string;
  merchantId: string; // Added merchant ID field
  documents: {
    documentId: string;
    fileName: string;
    pageCount: number;
    price: number;
    printSettings: {
      sides: 'single' | 'double';
      color: 'color' | 'blackAndWhite';
      pageSize: 'A4' | 'A3' | 'letter' | 'legal';
      copies: number;
      orientation: 'portrait' | 'landscape';
      pages: string;
    };
  }[];
  totalAmount: number;
  currency: string;
  notes?: string;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  userId: number;
  userEmail: string;
  items: OrderItemDto[];
  totalAmount: number;
  currency: string;
  status: 'PENDING_PAYMENT' | 'PAYMENT_RECEIVED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  paymentId: string | null;
  razorpayOrderId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrderItemDto {
  id: number;
  documentId: string;
  fileName: string;
  pageCount: number;
  price: number;
  printSettings: {
    sides: 'single' | 'double';
    color: 'color' | 'blackAndWhite';
    pageSize: 'A4' | 'A3' | 'letter' | 'legal';
    copies: number;
    orientation: 'portrait' | 'landscape';
    pages: string;
  };
}

export const createOrder = async (data: Omit<CreateOrderRequest, 'userId'>): Promise<OrderResponse> => {
  const authHeader = authService.getAuthHeader();
  if (!authHeader) {
    throw new Error('Authentication required');
  }

  const response = await axios.post<OrderResponse>(
    API_URL,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader
      }
    }
  );

  return response.data;
};

// Get a single order by ID
export const getOrder = async (orderId: number): Promise<OrderResponse> => {
  const authHeader = authService.getAuthHeader();
  if (!authHeader) {
    throw new Error('Authentication required');
  }

  const response = await axios.get<OrderResponse>(
    `${API_URL}/${orderId}`,
    {
      headers: authHeader
    }
  );

  return response.data;
};

// Get all orders for the current user
export const getOrders = async (username: string): Promise<OrderResponse[]> => {
  const authHeader = authService.getAuthHeader();
  if (!authHeader) {
    throw new Error('Authentication required');
  }

  const response = await axios.get<OrderResponse[]>(
    `${API_URL}/user`,
    {
      params: {
        username
      },
      headers: authHeader
    }
  );

  return response.data;
};
