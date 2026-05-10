import { useState } from 'react';
import {
  Alert,
  Box,
  Stack,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { PageTemplate } from '../../components/PageTemplate';
import type { AppPage } from '../../app/page-registry';
import { createEvent } from './api';

const createEventPage: AppPage = {
  id: 'organizer-events-new',
  role: 'organizer',
  path: '/organizer/events/new',
  title: 'Create New Event',
  navLabel: 'Create Event',
};

export default function CreateEventPage() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('12:00');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [tickets, setTickets] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      setIsSubmitting(true);

      await createEvent({
        title: title.trim(),
        date,
        time,
        location: location.trim(),
        description: description.trim() || null,
        totalTickets: tickets === '' ? null : tickets,
        imageUrl: imageUrl.trim() || null,
        organizerEmail: null,
      });

      setSubmitSuccess('Event created successfully.');
      setTitle('');
      setDate('');
      setTime('12:00');
      setLocation('');
      setDescription('');
      setPrice('');
      setTickets('');
      setImageUrl('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create event.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageTemplate page={createEventPage}>
      <Card elevation={0} sx={{ borderRadius: '14px' }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {submitError ? (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="error">{submitError}</Alert>
                </Grid>
              ) : null}

              {submitSuccess ? (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="success">{submitSuccess}</Alert>
                </Grid>
              ) : null}

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Event Title"
                  fullWidth
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  required
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <TextField
                  label="Time"
                  type="time"
                  fullWidth
                  required
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Location"
                  fullWidth
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  minRows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <TextField
                  label="Ticket Price ($)"
                  type="number"
                  fullWidth
                  value={price}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPrice(val === '' ? '' : Number(val));
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <TextField
                  label="Number of Tickets"
                  type="number"
                  fullWidth
                  value={tickets}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTickets(val === '' ? '' : Number(val));
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Image URL (optional)"
                  fullWidth
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Leave blank for default image
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Stack direction="row" sx={{ justifyContent: 'stretch' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    sx={{ flex: 1, py: 1.75, borderRadius: '8px' }}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Event'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </PageTemplate>
  );
}
