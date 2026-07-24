import { useState } from 'react';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';

interface Props {
  onSubmit: (input: { name: string; amount: number }) => Promise<void>;
}

export default function RecordForm({ onSubmit }: Props) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    const amountNum = Number(amount);
    if (Number.isNaN(amountNum)) {
      setError('Amount must be a number.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), amount: amountNum });
      setName('');
      setAmount('');
    } catch (err) {
      setError('Failed to save record. Is the API running?');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
      <Typography variant="h6" gutterBottom>
        Add Record
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            size="small"
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={submitting} sx={{ minWidth: 120 }}>
            {submitting ? 'Saving...' : 'Add'}
          </Button>
        </Stack>
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
