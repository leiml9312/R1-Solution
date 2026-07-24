import { useEffect, useState } from 'react';
import {
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { getCustomer } from '../api/customers';
import { Customer, OrderStatus } from '../types/customers';
import { orderTotal } from '../utils/orders';

const STATUS_COLOR: Record<OrderStatus, 'default' | 'warning' | 'success'> = {
  Intake: 'default',
  'In Progress': 'warning',
  Completed: 'success',
};

export default function CustomerOrders() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null | undefined>(undefined);

  useEffect(() => {
    if (!customerId) return;
    getCustomer(customerId).then(setCustomer);
  }, [customerId]);

  if (customer === undefined) {
    return (
      <AppShell>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <CircularProgress />
        </Container>
      </AppShell>
    );
  }

  if (customer === null) {
    return (
      <AppShell>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography>Customer not found.</Typography>
        </Container>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <RouterLink to={`/customers/${customer.id}`}>&larr; {customer.name}</RouterLink>
        </Typography>
        <Typography variant="h5" gutterBottom>
          Orders
        </Typography>

        <TableContainer component={Paper} elevation={1}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Order No.</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customer.orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.orderNo}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Chip size="small" label={order.status} color={STATUS_COLOR[order.status]} />
                  </TableCell>
                  <TableCell align="right">
                    {order.currency} {orderTotal(order).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      startIcon={<ReceiptLongIcon />}
                      onClick={() => navigate(`/customers/${customer.id}/orders/${order.id}/invoice`)}
                    >
                      Generate Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {customer.orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      No orders yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </AppShell>
  );
}
