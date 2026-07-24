import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { RecordItem } from '../api/client';

interface Props {
  records: RecordItem[];
  onDelete: (id: string) => void;
  loading: boolean;
}

export default function RecordTable({ records, onDelete, loading }: Props) {
  return (
    <TableContainer component={Paper} elevation={1}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Created</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  {loading ? 'Loading...' : 'No records yet. Add one above.'}
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {records.map((r) => (
            <TableRow key={r.id} hover>
              <TableCell>{r.name}</TableCell>
              <TableCell align="right">{r.amount}</TableCell>
              <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onDelete(r.id)} aria-label="delete">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
