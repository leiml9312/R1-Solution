import { useEffect, useState } from 'react';
import {
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate, useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { getCustomer } from '../api/customers';
import { Customer, OrderStatus } from '../types/customers';
import { isWithinLastMonth, orderTotal } from '../utils/orders';

const STATUS_COLOR: Record<OrderStatus, 'default' | 'warning' | 'success'> = {
  Intake: 'default',
  'In Progress': 'warning',
  Completed: 'success',
};

export default function CustomerDetail() {
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

  const recentOrders = customer.orders.filter((order) => isWithinLastMonth(order.date));

  return (
    <AppShell>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {customer.name}
        </Typography>

        <Paper sx={{ p: 3, mb: 4 }} elevation={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Address
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {customer.address}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Billing Address
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {customer.billingAddress}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body2">{customer.phone}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body2">{customer.email}</Typography>
            </Grid>
          </Grid>
        </Paper>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">Recent Orders (past 30 days)</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/customers/${customer.id}/orders/new`)}
            >
              New Order
            </Button>
            <Button
              variant="outlined"
              startIcon={<ListAltIcon />}
              onClick={() => navigate(`/customers/${customer.id}/orders`)}
            >
              View All Orders
            </Button>
          </Stack>
        </Stack>

        <TableContainer component={Paper} elevation={1} sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Order No.</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.orderNo}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Chip size="small" label={order.status} color={STATUS_COLOR[order.status]} />
                  </TableCell>
                  <TableCell align="right">
                    {order.currency} {orderTotal(order).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {recentOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      No orders in the past 30 days.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Documents
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<ReceiptIcon />}
            onClick={() => navigate(`/customers/${customer.id}/packing-list`)}
          >
            Packing List
          </Button>
          <Button
            variant="contained"
            startIcon={<DescriptionIcon />}
            onClick={() => navigate(`/customers/${customer.id}/statement`)}
          >
            Statement
          </Button>
        </Stack>
      </Container>
    </AppShell>
  );
}
