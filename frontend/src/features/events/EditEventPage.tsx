import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Stack,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { PageTemplate } from '../../components/PageTemplate';
import type { AppPage } from '../../app/page-registry';
import { fetchEventById, updateEvent } from './api';
import type { CreateEventRequest } from './types';

const editEventPage: AppPage = {
  id: 'organizer-events-edit',
  role: 'organizer',
  path: '/organizer/events/edit',
  title: 'Edit Event',
  navLabel: 'Edit Event',
  showInNav: false,
};

export default function EditEventPage() {
  const params = useParams();
  const location = useLocation();
  const { id: paramId } = params as { id?: string };
  const stateId = (location.state as { id?: string } | null)?.id;
  const id = paramId ?? stateId;

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('12:00');
  const [locationText, setLocationText] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [tickets, setTickets] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoadError('Missing event id.');
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    async function load() {
      try {
        setIsLoading(true);
        const ev = await fetchEventById(id as string, controller.signal);
        setTitle(ev.title);
        setDate(ev.date.split('T')[0]);
        // try to extract time from ISO string
        try {
          const dt = new Date(ev.date);
          const hh = String(dt.getHours()).padStart(2, '0');
          const mm = String(dt.getMinutes()).padStart(2, '0');
          setTime(`${hh}:${mm}`);
        } catch (e) {
          setTime('12:00');
        }

        setLocationText(ev.location);
        setDescription(ev.description ?? '');
        setTickets(ev.totalTickets ?? '');
        setImageUrl(ev.imageData ?? '');
      } catch (error) {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : 'Unable to load event.';
        setLoadError(message);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void load();

    return () => controller.abort();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!id) {
      setSubmitError('Missing event id.');
      return;
    }

    const payload: CreateEventRequest = {
      title: title.trim(),
      date,
      time,
      location: locationText.trim(),
      description: description.trim() || null,
      totalTickets: tickets === '' ? null : tickets,
      imageUrl: imageUrl.trim() || null,
      organizerEmail: null,
    };

    // Client-side validation mirroring server rules to avoid 400 errors
    if (!payload.title) {
      setSubmitError('Title is required.');
      return;
    }

    if (!payload.location) {
      setSubmitError('Location is required.');
      return;
    }

    if (!payload.date || !payload.time) {
      setSubmitError('Date and time are required.');
      return;
    }

    // Basic format checks — the server will still validate precisely
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!dateRegex.test(payload.date) || !timeRegex.test(payload.time)) {
      setSubmitError('Date or time has invalid format. Use the pickers provided.');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateEvent(id as string, payload);
      setSubmitSuccess('Event updated successfully.');
      // after short delay navigate back to organizer events list
      setTimeout(() => navigate('/organizer/events'), 800);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update event.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageTemplate page={editEventPage}>
      <Card elevation={0} sx={{ borderRadius: '14px' }}>
        <CardContent>
          {isLoading ? (
            <Stack sx={{ minHeight: 200, alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </Stack>
          ) : null}

          {loadError ? <Alert severity="error">{loadError}</Alert> : null}

          {!isLoading && !loadError ? (
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
                    value={locationText}
                    onChange={(e) => setLocationText(e.target.value)}
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
                      {isSubmitting ? 'Updating...' : 'Update Event'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          ) : null}
        </CardContent>
      </Card>
    </PageTemplate>
  );
}
