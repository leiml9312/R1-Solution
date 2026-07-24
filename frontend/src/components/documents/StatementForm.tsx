import { useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { exportDocument } from '../../api/documents';
import { StatementData, StatementLineItem } from '../../types/documents';

// Deliberately minimal/structural (rather than importing the Customer-domain
// Order type) so this component stays reusable outside a customer context.
// Callers compute `amount` (e.g. sum of an order's line items) up front,
// since that's domain logic this component shouldn't need to know about.
export interface SelectableOrder {
  id: string;
  orderNo: string;
  date: string;
  currency: string;
  amount: number;
  remark?: string;
}

const emptyLineItem = (): StatementLineItem => ({
  date: new Date().toISOString().slice(0, 10),
  invoiceNo: '',
  currency: 'USD',
  amount: 0,
  remark: '',
});

function isBlankLineItem(item: StatementLineItem): boolean {
  return !item.invoiceNo && !item.amount && !item.remark;
}

const defaultStatementData: StatementData = {
  to: '',
  attn: '',
  tel: '',
  date: new Date().toISOString().slice(0, 10),
  from: '',
  paymentTerm: '',
  remark: '',
  lineItems: [emptyLineItem()],
};

interface Props {
  // Pre-fills the form (e.g. from a customer's recent orders) on first
  // render; still fully editable afterward. Only read once — pass a `key`
  // on the parent if it needs to reset the form when this changes.
  initialData?: StatementData;
  // When provided, shows an order picker above the line items so more
  // orders can be added as statement lines instead of typing them by hand.
  availableOrders?: SelectableOrder[];
}

export default function StatementForm({ initialData, availableOrders }: Props) {
  const [data, setData] = useState<StatementData>(initialData ?? defaultStatementData);
  const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<SelectableOrder[]>([]);

  const updateField = <K extends keyof StatementData>(key: K, value: StatementData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const updateLineItem = (index: number, patch: Partial<StatementLineItem>) =>
    setData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));

  const addLineItem = () => setData((prev) => ({ ...prev, lineItems: [...prev.lineItems, emptyLineItem()] }));
  const removeLineItem = (index: number) =>
    setData((prev) => ({ ...prev, lineItems: prev.lineItems.filter((_, i) => i !== index) }));

  const addLineItemsFromOrders = () => {
    if (selectedOrders.length === 0) return;
    const newRows: StatementLineItem[] = selectedOrders.map((order) => ({
      date: order.date,
      invoiceNo: order.orderNo,
      currency: order.currency,
      amount: order.amount,
      remark: order.remark ?? '',
    }));
    setData((prev) => {
      const keepExisting = prev.lineItems.length > 1 || !isBlankLineItem(prev.lineItems[0]);
      return { ...prev, lineItems: [...(keepExisting ? prev.lineItems : []), ...newRows] };
    });
    setSelectedOrders([]);
  };

  // Orders already represented as a line item (matched by invoice no.)
  // drop out of the picker so they can't be added twice.
  const addedInvoiceNos = new Set(data.lineItems.map((item) => item.invoiceNo).filter(Boolean));
  const pickableOrders = (availableOrders ?? []).filter((order) => !addedInvoiceNos.has(order.orderNo));

  const total = data.lineItems.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  const handleExport = async (format: 'excel' | 'pdf') => {
    setError(null);
    setExporting(format);
    try {
      await exportDocument('statement', format, data, `statement-${data.date || 'export'}`);
    } catch {
      setError('Failed to export statement. Is the Python export API (api-python) running?');
    } finally {
      setExporting(null);
    }
  };

  return (
    <Paper sx={{ p: 3 }} elevation={1}>
      <Box component="img" src="/company-header.png" alt="R1 Solution" sx={{ width: '100%', maxWidth: 640, mb: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="To"
            value={data.to}
            onChange={(e) => updateField('to', e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Date"
            type="date"
            value={data.date}
            onChange={(e) => updateField('date', e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            helperText="Used as the 'as of' date for the aging buckets below"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField label="Attn" value={data.attn} onChange={(e) => updateField('attn', e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField label="Tel" value={data.tel} onChange={(e) => updateField('tel', e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField label="From" value={data.from} onChange={(e) => updateField('from', e.target.value)} fullWidth />
        </Grid>
      </Grid>

      {availableOrders && availableOrders.length > 0 && (
        <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Add orders
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'flex-start' }}>
            <Autocomplete
              multiple
              size="small"
              options={pickableOrders}
              value={selectedOrders}
              onChange={(_e, value) => setSelectedOrders(value)}
              getOptionLabel={(order) => `${order.orderNo} — ${order.date}`}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              disableCloseOnSelect
              renderOption={(props, option, { selected }) => (
                <li {...props} key={option.id}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    checked={selected}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  {option.orderNo} — {option.date} ({option.currency} {option.amount.toFixed(2)})
                </li>
              )}
              renderInput={(params) => <TextField {...params} label="Select orders" placeholder="Orders" />}
              sx={{ flex: 1, minWidth: 280 }}
            />
            <Button variant="outlined" disabled={selectedOrders.length === 0} onClick={addLineItemsFromOrders}>
              Add to Statement
            </Button>
          </Stack>
        </Paper>
      )}

      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
        Invoices
      </Typography>
      <Stack spacing={1.5}>
        {data.lineItems.map((item, index) => (
          <Stack
            key={index}
            direction={{ xs: 'column', md: 'row' }}
            spacing={1}
            alignItems={{ md: 'center' }}
            sx={{ md: { flexWrap: 'wrap' } }}
          >
            <TextField
              label="Date"
              type="date"
              size="small"
              value={item.date}
              onChange={(e) => updateLineItem(index, { date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ width: { md: 160 }, flexShrink: { md: 0 } }}
            />
            <TextField
              label="Invoice No."
              size="small"
              value={item.invoiceNo}
              onChange={(e) => updateLineItem(index, { invoiceNo: e.target.value })}
              sx={{ width: { md: 160 }, flexShrink: { md: 0 } }}
            />
            <TextField
              label="Currency"
              size="small"
              value={item.currency}
              onChange={(e) => updateLineItem(index, { currency: e.target.value })}
              sx={{ width: { md: 90 }, flexShrink: { md: 0 } }}
            />
            <TextField
              label="Amount"
              size="small"
              type="number"
              value={item.amount}
              onChange={(e) => updateLineItem(index, { amount: Number(e.target.value) })}
              sx={{ width: { md: 120 }, flexShrink: { md: 0 } }}
            />
            <TextField
              label="Remark"
              size="small"
              value={item.remark}
              onChange={(e) => updateLineItem(index, { remark: e.target.value })}
              sx={{ flexGrow: 1, minWidth: { md: 180 } }}
            />
            <IconButton aria-label="remove line" onClick={() => removeLineItem(index)} disabled={data.lineItems.length === 1}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
      <Button startIcon={<AddIcon />} onClick={addLineItem} sx={{ mt: 1 }}>
        Add Invoice
      </Button>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Total: {total.toFixed(2)}
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <TextField label="Payment Term" value={data.paymentTerm} onChange={(e) => updateField('paymentTerm', e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Remark" value={data.remark} onChange={(e) => updateField('remark', e.target.value)} fullWidth />
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button variant="outlined" startIcon={<DownloadIcon />} disabled={exporting !== null} onClick={() => handleExport('excel')}>
          {exporting === 'excel' ? 'Exporting...' : 'Export Excel'}
        </Button>
        <Button variant="outlined" startIcon={<DownloadIcon />} disabled={exporting !== null} onClick={() => handleExport('pdf')}>
          {exporting === 'pdf' ? 'Exporting...' : 'Export PDF'}
        </Button>
      </Stack>
    </Paper>
  );
}
