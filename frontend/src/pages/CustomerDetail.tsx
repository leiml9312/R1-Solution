import { SyntheticEvent, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useNavigate, useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import PackingListForm from '../components/documents/PackingListForm';
import StatementForm from '../components/documents/StatementForm';
import { getCustomer } from '../api/customers';
import { Customer } from '../types/customers';
import { PackingListData, StatementData } from '../types/documents';
import { isWithinLastMonth, orderTotal } from '../utils/orders';

const TABS = ['packing-list', 'statement'] as const;
type TabKey = (typeof TABS)[number];

function buildPackingListInitialData(customer: Customer): PackingListData {
  return {
    shipTo: `${customer.name}\n${customer.address}`,
    billTo: `${customer.name}\n${customer.billingAddress}`,
    no: '',
    date: new Date().toISOString().slice(0, 10),
    lineItems: [
      { palletNo: '1', ctnNo: 0, partNo: '', description: '', quantity: 0, netWeight: 0, grossWeight: 0, measurement: '' },
    ],
  };
}

function buildStatementInitialData(customer: Customer): StatementData {
  const recentOrders = customer.orders.filter((order) => isWithinLastMonth(order.date));
  const lineItems = recentOrders.map((order) => ({
    date: order.date,
    invoiceNo: order.orderNo,
    currency: order.currency,
    amount: orderTotal(order),
    remark: order.status,
  }));
  return {
    to: `${customer.name}\n${customer.address}`,
    attn: '',
    tel: customer.phone,
    date: new Date().toISOString().slice(0, 10),
    from: '',
    paymentTerm: '',
    remark: '',
    lineItems: lineItems.length > 0
      ? lineItems
      : [{ date: new Date().toISOString().slice(0, 10), invoiceNo: '', currency: 'USD', amount: 0, remark: '' }],
  };
}

export default function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null | undefined>(undefined);
  const [tab, setTab] = useState<TabKey>('packing-list');

  useEffect(() => {
    if (!customerId) return;
    getCustomer(customerId).then(setCustomer);
  }, [customerId]);

  const handleChange = (_e: SyntheticEvent, value: TabKey) => setTab(value);

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
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
          <Typography variant="h5">{customer.name}</Typography>
          <Button
            variant="contained"
            startIcon={<ListAltIcon />}
            onClick={() => navigate(`/customers/${customer.id}/orders`)}
          >
            View Orders
          </Button>
        </Stack>

        <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
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

        <Tabs value={tab} onChange={handleChange} sx={{ mb: 3 }}>
          <Tab value="packing-list" label="Packing List" />
          <Tab value="statement" label="Statement" />
        </Tabs>

        <Box hidden={tab !== 'packing-list'}>
          <PackingListForm initialData={buildPackingListInitialData(customer)} availableOrders={customer.orders} />
        </Box>
        <Box hidden={tab !== 'statement'}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Pre-filled with this customer's orders from the past month — still fully editable.
          </Typography>
          <StatementForm initialData={buildStatementInitialData(customer)} />
        </Box>
      </Container>
    </AppShell>
  );
}
