import { FormEvent, useState } from 'react';
import {
  Alert,
  Button,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { createOrder } from '../api/customers';
import { OrderLineItem, OrderStatus } from '../types/customers';

const STATUSES: OrderStatus[] = ['Intake', 'In Progress', 'Completed'];

const emptyLineItem = (): OrderLineItem => ({ partNo: '', description: '', qty: 0, unitPrice: 0 });

export default function NewOrder() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  const [orderNo, setOrderNo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<OrderStatus>('Intake');
  const [poNo, setPoNo] = useState('');
  const [incoterm, setIncoterm] = useState('EXW SZ');
  const [shipMethod, setShipMethod] = useState('By Sea');
  const [hsCode, setHsCode] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [lineItems, setLineItems] = useState<OrderLineItem[]>([emptyLineItem()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLineItem = (index: number, patch: Partial<OrderLineItem>) =>
    setLineItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  const addLineItem = () => setLineItems((prev) => [...prev, emptyLineItem()]);
  const removeLineItem = (index: number) => setLineItems((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!customerId) return;
    setError(null);
    if (!orderNo.trim()) {
      setError('Order No. is required.');
      return;
    }
    setSubmitting(true);
    try {
      await createOrder(customerId, {
        orderNo: orderNo.trim(),
        date,
        status,
        poNo,
        incoterm,
        shipMethod,
        hsCode,
        currency,
        lineItems: lineItems.filter((item) => item.partNo || item.description),
      });
      navigate(`/customers/${customerId}/orders`);
    } catch {
      setError('Failed to create order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <RouterLink to={`/customers/${customerId}`}>&larr; Back</RouterLink>
        </Typography>
        <Typography variant="h5" gutterBottom>
          New Order
        </Typography>

        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }} elevation={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Order No."
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                fullWidth
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="PO No." value={poNo} onChange={(e) => setPoNo(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Incoterm" value={incoterm} onChange={(e) => setIncoterm(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Ship Method"
                value={shipMethod}
                onChange={(e) => setShipMethod(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="HS Code" value={hsCode} onChange={(e) => setHsCode(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} fullWidth />
            </Grid>
          </Grid>

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Line Items
          </Typography>
          <Stack spacing={1.5}>
            {lineItems.map((item, index) => (
              <Stack
                key={index}
                direction={{ xs: 'column', md: 'row' }}
                spacing={1}
                alignItems={{ md: 'center' }}
                sx={{ md: { flexWrap: 'wrap' } }}
              >
                <TextField
                  label="Part No."
                  size="small"
                  value={item.partNo}
                  onChange={(e) => updateLineItem(index, { partNo: e.target.value })}
                  sx={{ width: { md: 140 }, flexShrink: { md: 0 } }}
                />
                <TextField
                  label="Description"
                  size="small"
                  value={item.description}
                  onChange={(e) => updateLineItem(index, { description: e.target.value })}
                  sx={{ flexGrow: 1, minWidth: { md: 200 } }}
                />
                <TextField
                  label="Qty"
                  size="small"
                  type="number"
                  value={item.qty}
                  onChange={(e) => updateLineItem(index, { qty: Number(e.target.value) })}
                  sx={{ width: { md: 110 }, flexShrink: { md: 0 } }}
                />
                <TextField
                  label="Unit Price"
                  size="small"
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateLineItem(index, { unitPrice: Number(e.target.value) })}
                  sx={{ width: { md: 120 }, flexShrink: { md: 0 } }}
                />
                <IconButton
                  aria-label="remove line"
                  onClick={() => removeLineItem(index)}
                  disabled={lineItems.length === 1}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
          <Button startIcon={<AddIcon />} onClick={addLineItem} sx={{ mt: 1 }}>
            Add Line
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Order'}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </AppShell>
  );
}
