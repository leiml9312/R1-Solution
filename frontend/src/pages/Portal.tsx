import { useEffect, useState } from 'react';
import { Button, Container, Stack, Alert } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AppShell from '../components/AppShell';
import RecordForm from '../components/RecordForm';
import RecordTable from '../components/RecordTable';
import { RecordItem, createRecord, deleteRecord, exportUrl, listRecords } from '../api/client';

export default function Portal() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await listRecords();
      setRecords(data);
    } catch (err) {
      setApiError(
        'Could not reach the API. Run the local mock server (api-node/mock-server.js) or the Azure Functions host, then reload.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (input: { name: string; amount: number }) => {
    await createRecord(input);
    await refresh();
  };

  const handleDelete = async (id: string) => {
    await deleteRecord(id);
    await refresh();
  };

  return (
    <AppShell>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {apiError && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {apiError}
          </Alert>
        )}

        <RecordForm onSubmit={handleCreate} />
        <RecordTable records={records} onDelete={handleDelete} loading={loading} />

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            component="a"
            href={exportUrl('excel')}
            target="_blank"
            rel="noopener noreferrer"
          >
            Export Excel
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            component="a"
            href={exportUrl('pdf')}
            target="_blank"
            rel="noopener noreferrer"
          >
            Export PDF
          </Button>
        </Stack>
      </Container>
    </AppShell>
  );
}
