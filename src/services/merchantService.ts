// src/services/merchantService.ts
import api from './api';

interface MerchantLoginData {
  usernameOrEmail: string;
  password: string;
}

interface MerchantRegisterData {
  username: string;
  email: string;
  password: string;
  businessName: string;
  address?: string;
  phoneNumber: string;
}

export const merchantService = {
  async login({ usernameOrEmail, password }: MerchantLoginData) {
    try {
      const response = await api.post('/merchants/login', { 
        usernameOrEmail, 
        password 
      });
      
      if (response.data && response.data.token) {
        localStorage.setItem('merchantToken', response.data.token);
        localStorage.setItem('merchant', JSON.stringify(response.data.merchant));
        return response.data;
      }
      throw new Error('Authentication failed: No token received');
    } catch (error: any) {
      console.error('Merchant login error:', error);
      throw error;
    }
  },

  async register(merchantData: MerchantRegisterData) {
    try {
      const response = await api.post('/merchants/register', merchantData);
      return response.data;
    } catch (error: any) {
      console.error('Merchant registration error:', error);
      throw error;
    }
  },

  getCurrentMerchant() {
    const merchant = localStorage.getItem('merchant');
    return merchant ? JSON.parse(merchant) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('merchantToken');
  },

  logout() {
    localStorage.removeItem('merchantToken');
    localStorage.removeItem('merchant');
  }
};

export default merchantService;