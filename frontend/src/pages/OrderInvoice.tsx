import { useEffect, useState } from 'react';
import { CircularProgress, Container, Typography } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import InvoiceForm from '../components/documents/InvoiceForm';
import { getCustomer, getOrder } from '../api/customers';
import { Customer, Order } from '../types/customers';
import { orderToInvoiceData } from '../utils/orders';

export default function OrderInvoice() {
  const { customerId, orderId } = useParams<{ customerId: string; orderId: string }>();
  const [customer, setCustomer] = useState<Customer | null | undefined>(undefined);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (!customerId || !orderId) return;
    getCustomer(customerId).then(setCustomer);
    getOrder(customerId, orderId).then(setOrder);
  }, [customerId, orderId]);

  if (customer === undefined || order === undefined) {
    return (
      <AppShell>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <CircularProgress />
        </Container>
      </AppShell>
    );
  }

  if (!customer || !order) {
    return (
      <AppShell>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography>Order not found.</Typography>
        </Container>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <RouterLink to={`/customers/${customer.id}/orders`}>&larr; {customer.name} orders</RouterLink>
        </Typography>
        <Typography variant="h5" gutterBottom>
          Invoice for Order {order.orderNo}
        </Typography>
        <InvoiceForm initialData={orderToInvoiceData(customer, order)} />
      </Container>
    </AppShell>
  );
}
