import { SyntheticEvent, useState } from 'react';
import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import AppShell from '../components/AppShell';
import InvoiceForm from '../components/documents/InvoiceForm';
import PackingListForm from '../components/documents/PackingListForm';
import StatementForm from '../components/documents/StatementForm';

const TABS = ['invoice', 'packing-list', 'statement'] as const;
type TabKey = (typeof TABS)[number];

const TAB_LABELS: Record<TabKey, string> = {
  invoice: 'Invoice',
  'packing-list': 'Packing List',
  statement: 'Statement',
};

export default function Documents() {
  const [tab, setTab] = useState<TabKey>('invoice');

  const handleChange = (_e: SyntheticEvent, value: TabKey) => setTab(value);

  return (
    <AppShell>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Documents
        </Typography>
        <Tabs value={tab} onChange={handleChange} sx={{ mb: 3 }}>
          {TABS.map((key) => (
            <Tab key={key} value={key} label={TAB_LABELS[key]} />
          ))}
        </Tabs>
        {/* Kept mounted (just hidden) so switching tabs doesn't lose in-progress input. */}
        <Box hidden={tab !== 'invoice'}>
          <InvoiceForm />
        </Box>
        <Box hidden={tab !== 'packing-list'}>
          <PackingListForm />
        </Box>
        <Box hidden={tab !== 'statement'}>
          <StatementForm />
        </Box>
      </Container>
    </AppShell>
  );
}
