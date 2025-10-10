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
  },
  
  async getMerchants() {
    try {
      console.log('Fetching merchants from /merchants endpoint...');
      const response = await api.get('/merchants');
      console.log('Merchants API response:', response.data);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Unexpected response format from /merchants:', response.data);
        throw new Error('Invalid response format from server');
      }
      
      // Log each merchant's ID to verify they're present
      response.data.forEach((merchant: any, index: number) => {
        console.log(`Merchant ${index + 1}:`, {
          id: merchant.id,
          businessName: merchant.businessName,
          hasId: 'id' in merchant
        });
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching merchants:', error);
      throw error;
    }
  }
};

export default merchantService;