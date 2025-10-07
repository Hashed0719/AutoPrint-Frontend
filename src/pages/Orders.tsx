import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import OrderList from '@/components/orders/OrderList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Orders: React.FC = () => {
    return (
        <AppLayout>
            <div className="container py-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Your Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OrderList />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Orders;
