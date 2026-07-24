import { Box, Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Link as RouterLink } from 'react-router-dom';

const FEATURES = [
  {
    icon: <InsightsIcon fontSize="large" color="primary" />,
    title: 'Track records',
    description: 'Create, update, and manage your records in one focused workspace.',
  },
  {
    icon: <CloudDoneIcon fontSize="large" color="primary" />,
    title: 'Cloud-native',
    description: 'Built on Azure Functions and Azure Cosmos DB for a fully managed backend.',
  },
  {
    icon: <FileDownloadIcon fontSize="large" color="primary" />,
    title: 'Export anywhere',
    description: 'Download your data as Excel or PDF whenever you need it.',
  },
];

export default function Home() {
  return (
    <Box>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" fontWeight={700} gutterBottom>
            R1 Solution
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, mb: 4, maxWidth: 560 }}>
            A simple, focused workspace for tracking your records and exporting them whenever you
            need to.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button component={RouterLink} to="/signin" variant="contained" color="secondary" size="large">
              Sign In
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>
          Why R1 Solution
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {FEATURES.map((feature) => (
            <Grid item xs={12} sm={4} key={feature.title}>
              <Paper sx={{ p: 3, height: '100%' }} elevation={1}>
                <Stack spacing={1.5}>
                  {feature.icon}
                  <Typography variant="h6">{feature.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
