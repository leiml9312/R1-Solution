import { useEffect, useState } from 'react';
import { CircularProgress, Container, Typography } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import PackingListForm from '../components/documents/PackingListForm';
import { getCustomer } from '../api/customers';
import { Customer } from '../types/customers';
import { buildPackingListInitialData, ordersToPackingListOptions } from '../utils/orders';

export default function CustomerPackingList() {
  const { customerId } = useParams<{ customerId: string }>();
  const [customer, setCustomer] = useState<Customer | null | undefined>(undefined);

  useEffect(() => {
    if (!customerId) return;
    getCustomer(customerId).then(setCustomer);
  }, [customerId]);

  if (customer === undefined) {
    return (
      <AppShell>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <CircularProgress />
        </Container>
      </AppShell>
    );
  }

  if (!customer) {
    return (
      <AppShell>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography>Customer not found.</Typography>
        </Container>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <RouterLink to={`/customers/${customer.id}`}>&larr; {customer.name}</RouterLink>
        </Typography>
        <Typography variant="h5" gutterBottom>
          Packing List
        </Typography>
        <PackingListForm
          initialData={buildPackingListInitialData(customer)}
          availableOrders={ordersToPackingListOptions(customer.orders)}
        />
      </Container>
    </AppShell>
  );
}
