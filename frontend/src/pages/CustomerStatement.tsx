import { useEffect, useState } from 'react';
import { CircularProgress, Container, Typography } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import StatementForm from '../components/documents/StatementForm';
import { getCustomer } from '../api/customers';
import { Customer } from '../types/customers';
import { buildStatementInitialData, ordersToStatementOptions } from '../utils/orders';

export default function CustomerStatement() {
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
          Statement
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Pre-filled with this customer's orders from the past month — add more from the picker below, or edit
          freely.
        </Typography>
        <StatementForm
          initialData={buildStatementInitialData(customer)}
          availableOrders={ordersToStatementOptions(customer.orders)}
        />
      </Container>
    </AppShell>
  );
}
