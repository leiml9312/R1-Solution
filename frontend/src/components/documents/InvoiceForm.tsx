import { useState } from 'react';
import { Alert, Box, Button, Grid, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { exportDocument } from '../../api/documents';
import { InvoiceData, InvoiceLineItem } from '../../types/documents';

const emptyLineItem = (line: number): InvoiceLineItem => ({
  poNo: '',
  line,
  partNo: '',
  description: '',
  qty: 0,
  unitPrice: 0,
  dc: '',
});

const initialData: InvoiceData = {
  shipTo: '',
  billTo: '',
  date: new Date().toISOString().slice(0, 10),
  invoiceNo: '',
  terms: { incoterm: 'EXW SZ', shipMethod: 'By Sea', hsCode: '' },
  paymentTerm: '',
  remark: '',
  lineItems: [emptyLineItem(1)],
};

export default function InvoiceForm() {
  const [data, setData] = useState<InvoiceData>(initialData);
  const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const updateTerm = (key: keyof InvoiceData['terms'], value: string) =>
    setData((prev) => ({ ...prev, terms: { ...prev.terms, [key]: value } }));

  const updateLineItem = (index: number, patch: Partial<InvoiceLineItem>) =>
    setData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));

  const addLineItem = () =>
    setData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, emptyLineItem(prev.lineItems.length + 1)],
    }));

  const removeLineItem = (index: number) =>
    setData((prev) => ({ ...prev, lineItems: prev.lineItems.filter((_, i) => i !== index) }));

  const totalQty = data.lineItems.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  const totalAmount = data.lineItems.reduce(
    (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0),
    0,
  );

  const handleExport = async (format: 'excel' | 'pdf') => {
    setError(null);
    setExporting(format);
    try {
      await exportDocument('invoice', format, data, `invoice-${data.invoiceNo || 'export'}`);
    } catch {
      setError('Failed to export invoice. Is the Python export API (api-python) running?');
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
            label="Ship To"
            value={data.shipTo}
            onChange={(e) => updateField('shipTo', e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Bill To"
            value={data.billTo}
            onChange={(e) => updateField('billTo', e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Date"
            type="date"
            value={data.date}
            onChange={(e) => updateField('date', e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField label="Invoice No" value={data.invoiceNo} onChange={(e) => updateField('invoiceNo', e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField label="HS Code" value={data.terms.hsCode} onChange={(e) => updateTerm('hsCode', e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Incoterm" value={data.terms.incoterm} onChange={(e) => updateTerm('incoterm', e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Ship Method" value={data.terms.shipMethod} onChange={(e) => updateTerm('shipMethod', e.target.value)} fullWidth />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
        Line Items
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
              label="PO No."
              size="small"
              value={item.poNo}
              onChange={(e) => updateLineItem(index, { poNo: e.target.value })}
              sx={{ width: { md: 140 }, flexShrink: { md: 0 } }}
            />
            <TextField
              label="Part No."
              size="small"
              value={item.partNo}
              onChange={(e) => updateLineItem(index, { partNo: e.target.value })}
              sx={{ width: { md: 110 }, flexShrink: { md: 0 } }}
            />
            <TextField
              label="Description"
              size="small"
              value={item.description}
              onChange={(e) => updateLineItem(index, { description: e.target.value })}
              sx={{ flexGrow: 1, minWidth: { md: 180 } }}
            />
            <TextField
              label="Qty"
              size="small"
              type="number"
              value={item.qty}
              onChange={(e) => updateLineItem(index, { qty: Number(e.target.value) })}
              sx={{ width: { md: 100 }, flexShrink: { md: 0 } }}
            />
            <TextField
              label="Unit Price"
              size="small"
              type="number"
              value={item.unitPrice}
              onChange={(e) => updateLineItem(index, { unitPrice: Number(e.target.value) })}
              sx={{ width: { md: 110 }, flexShrink: { md: 0 } }}
            />
            <TextField
              label="D/C"
              size="small"
              value={item.dc}
              onChange={(e) => updateLineItem(index, { dc: e.target.value })}
              sx={{ width: { md: 120 }, flexShrink: { md: 0 } }}
            />
            <IconButton aria-label="remove line" onClick={() => removeLineItem(index)} disabled={data.lineItems.length === 1}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
      <Button startIcon={<AddIcon />} onClick={addLineItem} sx={{ mt: 1 }}>
        Add Line
      </Button>

      <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
        <Typography variant="body2">Total Qty: {totalQty}</Typography>
        <Typography variant="body2">Total Amount: {totalAmount.toFixed(2)}</Typography>
      </Stack>

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
