import { useState } from 'react';
import {
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload = {
      title,
      date: date || null,
      time: time || null,
      location,
      description: description || null,
      ticketPrice: price === '' ? null : price,
      totalTickets: tickets === '' ? null : tickets,
      imageUrl: imageUrl || null,
    };

    // For now we just log the payload. The user said they will wire up backend later.
    // Replace this with an API call when ready.
    // eslint-disable-next-line no-console
    console.log('Create event (not yet implemented):', payload);
    // quick visual feedback
    // eslint-disable-next-line no-alert
    alert('Create event is not yet implemented. Payload logged to console.');
  }

  return (
    <PageTemplate page={createEventPage}>
      <Card elevation={0} sx={{ borderRadius: '14px' }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Event Title"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <TextField
                  label="Time"
                  type="time"
                  fullWidth
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Location"
                  fullWidth
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
                    sx={{ flex: 1, py: 1.75, borderRadius: '8px' }}
                  >
                    Create Event
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
