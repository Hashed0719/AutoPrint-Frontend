import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderResponse, getOrders } from '@/services/orderService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Loader2, Clock, CheckCircle2, XCircle, CreditCard } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import authService from '@/services/authService';

interface OrderListProps {
  // Optional prop to use external orders data
  initialOrders?: OrderResponse[];
  // Set to true to disable internal data fetching
  disableAutoFetch?: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    case 'PENDING_PAYMENT':
      return <Badge className="bg-yellow-100 text-yellow-800">Pending Payment</Badge>;
    case 'PAYMENT_RECEIVED':
      return <Badge className="bg-purple-100 text-purple-800">Payment Received</Badge>;
    case 'PROCESSING':
      return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
    case 'CANCELLED':
      return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
    case 'FAILED':
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="outline">{status.replace('_', ' ').toLowerCase()}</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'PENDING_PAYMENT':
      return <CreditCard className="h-4 w-4 text-yellow-500" />;
    case 'PROCESSING':
    case 'PAYMENT_RECEIVED':
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    case 'CANCELLED':
    case 'FAILED':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const OrderList: React.FC<OrderListProps> = ({ 
  initialOrders = [],
  disableAutoFetch = false
}) => {
  const [orders, setOrders] = useState<OrderResponse[]>(initialOrders);
  const [loading, setLoading] = useState(!disableAutoFetch);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (disableAutoFetch) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        navigate('/login', { state: { from: '/orders' } });
        return;
      }

      // Get current user
      const user = authService.getCurrentUser();
      if (!user?.username) {
        throw new Error('User information not available');
      }

      // Fetch user's orders
      const userOrders = await getOrders(user.username);
      setOrders(userOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on component mount if auto-fetch is enabled
  useEffect(() => {
    if (!disableAutoFetch) {
      fetchOrders();
    }
  }, [disableAutoFetch]);
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchOrders} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <h3 className="text-sm font-medium text-gray-900">No orders found</h3>
        <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[120px]">Order ID</TableHead>
            <TableHead>File</TableHead>
            <TableHead className="text-right">Pages</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const totalPages = order.items.reduce(
              (total, item) => total + (item.pageCount || 0) * (item.printSettings?.copies || 1),
              0
            );
            
            return (
              <TableRow key={order.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <span className="text-sm text-gray-900">#{order.orderNumber || order.id}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="truncate max-w-[200px] inline-block text-sm">
                      {order.items[0]?.fileName || 'N/A'}
                      {order.items.length > 1 && ` +${order.items.length - 1} more`}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm text-gray-900">
                  {totalPages}
                </TableCell>
                <TableCell className="text-right text-sm font-medium text-gray-900">
                  ₹{order.totalAmount?.toFixed(2) || '0.00'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    {getStatusBadge(order.status)}
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm text-gray-500">
                  {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderList;
