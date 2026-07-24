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
import { PackingListData, PackingListLineItem } from '../../types/documents';

// Deliberately minimal/structural (rather than importing the Customer-domain
// Order type) so this component stays reusable outside a customer context.
// Any Order object already satisfies this shape.
export interface SelectableOrder {
  id: string;
  orderNo: string;
  date: string;
  lineItems: { partNo: string; description: string; qty: number }[];
}

const emptyLineItem = (): PackingListLineItem => ({
  palletNo: '1',
  ctnNo: 0,
  partNo: '',
  description: '',
  quantity: 0,
  netWeight: 0,
  grossWeight: 0,
  measurement: '',
});

function isBlankLineItem(item: PackingListLineItem): boolean {
  return (
    !item.partNo && !item.description && !item.quantity && !item.netWeight && !item.grossWeight && !item.measurement
  );
}

const defaultPackingListData: PackingListData = {
  shipTo: '',
  billTo: '',
  no: '',
  date: new Date().toISOString().slice(0, 10),
  lineItems: [emptyLineItem()],
};

interface Props {
  // Pre-fills the form (e.g. from a customer) on first render; still fully
  // editable afterward. Only read once — pass a `key` on the parent if it
  // needs to reset the form when this changes.
  initialData?: PackingListData;
  // When provided, shows an order picker above the line items so orders can
  // be turned into packing list rows instead of typing everything by hand.
  // Pallet/CTN/weight/measurement aren't part of an order, so those come in
  // blank for the user to fill in per physical package.
  availableOrders?: SelectableOrder[];
}

export default function PackingListForm({ initialData, availableOrders }: Props) {
  const [data, setData] = useState<PackingListData>(initialData ?? defaultPackingListData);
  const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<SelectableOrder[]>([]);

  const updateField = <K extends keyof PackingListData>(key: K, value: PackingListData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const updateLineItem = (index: number, patch: Partial<PackingListLineItem>) =>
    setData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));

  const addLineItem = () => setData((prev) => ({ ...prev, lineItems: [...prev.lineItems, emptyLineItem()] }));

  const addLineItemsFromOrders = () => {
    if (selectedOrders.length === 0) return;
    const newRows: PackingListLineItem[] = selectedOrders.flatMap((order) =>
      order.lineItems.map((item) => ({
        palletNo: '1',
        ctnNo: 0,
        partNo: item.partNo,
        description: item.description,
        quantity: item.qty,
        netWeight: 0,
        grossWeight: 0,
        measurement: '',
      })),
    );
    setData((prev) => {
      const keepExisting = prev.lineItems.length > 1 || !isBlankLineItem(prev.lineItems[0]);
      return { ...prev, lineItems: [...(keepExisting ? prev.lineItems : []), ...newRows] };
    });
    setSelectedOrders([]);
  };
  const removeLineItem = (index: number) =>
    setData((prev) => ({ ...prev, lineItems: prev.lineItems.filter((_, i) => i !== index) }));

  const pallets = new Set(data.lineItems.map((i) => i.palletNo));
  const totalCtns = data.lineItems.reduce((sum, i) => sum + (Number(i.ctnNo) || 0), 0);
  const totalQty = data.lineItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);

  const handleExport = async (format: 'excel' | 'pdf') => {
    setError(null);
    setExporting(format);
    try {
      await exportDocument('packing-list', format, data, `packing-list-${data.no || 'export'}`);
    } catch {
      setError('Failed to export packing list. Is the Python export API (api-python) running?');
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
        <Grid item xs={12} sm={6}>
          <TextField label="Packing List No" value={data.no} onChange={(e) => updateField('no', e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Date"
            type="date"
            value={data.date}
            onChange={(e) => updateField('date', e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      {availableOrders && availableOrders.length > 0 && (
        <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Populate from orders
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'flex-start' }}>
            <Autocomplete
              multiple
              size="small"
              options={availableOrders}
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
                  {option.orderNo} — {option.date}
                </li>
              )}
              renderInput={(params) => <TextField {...params} label="Select orders" placeholder="Orders" />}
              sx={{ flex: 1, minWidth: 280 }}
            />
            <Button variant="outlined" disabled={selectedOrders.length === 0} onClick={addLineItemsFromOrders}>
              Add to Packing List
            </Button>
          </Stack>
        </Paper>
      )}

      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
        Line Items
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Repeat the same Pallet No. (and Measurement) across rows in the same pallet — they'll be merged
        automatically on export.
      </Typography>
      <Stack spacing={1.5} sx={{ mt: 1 }}>
        {data.lineItems.map((item, index) => (
          <Stack
            key={index}
            direction={{ xs: 'column', md: 'row' }}
            spacing={1}
            alignItems={{ md: 'center' }}
            sx={{ md: { flexWrap: 'wrap' } }}
          >
            <TextField
              label="Pallet #"
              size="small"
              value={item.palletNo}
              onChange={(e) => updateLineItem(index, { palletNo: e.target.value })}
              sx={{ width: { md: 90 }, flexShrink: { md: 0 } }}
            />
            <TextField
              label="CTN #"
              size="small"
              type="number"
              value={item.ctnNo}
              onChange={(e) => updateLineItem(index, { ctnNo: Number(e.target.value) })}
              sx={{ width: { md: 85 }, flexShrink: { md: 0 } }}
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
              label="Quantity"
              size="small"
              type="number"
              value={item.quantity}
              onChange={(e) => updateLineItem(index, { quantity: Number(e.target.value) })}
              sx={{ width: { md: 110 }, flexShrink: { md: 0 } }}
            />
            <TextField
              label="Net Wt."
              size="small"
              type="number"
              value={item.netWeight}
              onChange={(e) => updateLineItem(index, { netWeight: Number(e.target.value) })}
              sx={{ width: { md: 95 }, flexShrink: { md: 0 } }}
            />
            <TextField
              label="Gross Wt."
              size="small"
              type="number"
              value={item.grossWeight}
              onChange={(e) => updateLineItem(index, { grossWeight: Number(e.target.value) })}
              sx={{ width: { md: 95 }, flexShrink: { md: 0 } }}
            />
            <TextField
              label="Measure (cm)"
              size="small"
              value={item.measurement}
              onChange={(e) => updateLineItem(index, { measurement: e.target.value })}
              sx={{ width: { md: 140 }, flexShrink: { md: 0 } }}
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
        <Typography variant="body2">Pallets: {pallets.size}</Typography>
        <Typography variant="body2">Total CTNs: {totalCtns}</Typography>
        <Typography variant="body2">Total Qty: {totalQty}</Typography>
      </Stack>

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
