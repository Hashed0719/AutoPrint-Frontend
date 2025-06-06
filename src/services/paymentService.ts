import axios from 'axios';
import { getAuthToken } from './authService';
import { config } from '../config';

const API_BASE_URL = config.api.baseUrl;
const RAZORPAY_KEY_ID = config.razorpay.key;

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  notes?: Record<string, string>;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const verifyPayment = async (orderId: number, razorpayPaymentId: string, razorpaySignature: string, razorpayOrderId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/payments/verify`,
      {
        orderId: orderId, // Internal order ID (number)
        razorpayPaymentId,
        razorpaySignature,
        razorpayOrderId
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Payment verification failed:', error);
    throw new Error('Payment verification failed');
  }
};

export const openRazorpay = (options: Omit<RazorpayOptions, 'key'>) => {
  if (!window.Razorpay) {
    throw new Error('Razorpay SDK not loaded');
  }
  
  const razorpay = new window.Razorpay({
    key: RAZORPAY_KEY_ID,
    ...options,
    modal: {
      ...options.modal,
      ondismiss: () => {
        // Handle modal close
        if (options.modal?.ondismiss) {
          options.modal.ondismiss();
        }
      }
    }
  });
  
  razorpay.open();
  
  return razorpay;
};
