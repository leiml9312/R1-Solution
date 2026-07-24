import { useEffect, useState } from 'react';
import {
  CircularProgress,
  Container,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { listCustomers } from '../api/customers';
import { Customer } from '../types/customers';

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    listCustomers().then(setCustomers);
  }, []);

  return (
    <AppShell>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Customers
        </Typography>
        {customers === null ? (
          <CircularProgress />
        ) : (
          <Paper elevation={1}>
            <List disablePadding>
              {customers.map((customer) => (
                <ListItemButton
                  key={customer.id}
                  divider
                  onClick={() => navigate(`/customers/${customer.id}`)}
                >
                  <ListItemText primary={customer.name} secondary={customer.email} />
                  <ChevronRightIcon color="action" />
                </ListItemButton>
              ))}
              {customers.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                  No customers yet.
                </Typography>
              )}
            </List>
          </Paper>
        )}
      </Container>
    </AppShell>
  );
}
