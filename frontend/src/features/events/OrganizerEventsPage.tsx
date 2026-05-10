import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import Grid from '@mui/material/Grid';
import type { AppPage } from '../../app/page-registry';
import { PageTemplate } from '../../components/PageTemplate';
import { fetchEvents } from './api';
import type { EventSummary } from './types';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

function formatEventDate(value: string): string { // formats into "20 Mar 2024, 7:30 PM"
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getEventImage(imageData: string | null): string {
  return imageData ?? '';
}

const organizerEventsPage: AppPage = {
  id: 'organizer-events',
  role: 'organizer',
  path: '/organizer/events',
  title: 'Events',
  navLabel: 'Events',
};

export function OrganizerEventsPage() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const actions = (
    <Button component={RouterLink} to="/organizer/events/new" variant="contained" disableElevation>
      Create Event
    </Button>
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadEvents() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const loadedEvents = await fetchEvents(controller.signal);
        setEvents(loadedEvents);
      } catch (error) {
        if (controller.signal.aborted) return;
        setErrorMessage('Unable to load events right now.');
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadEvents();
    return () => controller.abort();
  }, []);

  return (
    <PageTemplate page={organizerEventsPage} actions={actions}>
      <Stack spacing={3}>
        {isLoading ? (
          <Stack sx={{ minHeight: 240, alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Stack>
        ) : null}

        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        {!isLoading && !errorMessage && events.length === 0 ? (
          <Card elevation={0} sx={{ borderRadius: '24px' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6">No events yet</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                You haven't published any events yet.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                component={RouterLink}
                to="/organizer/events/new"
              >
                Create Event
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !errorMessage ? (
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid key={event.id} size={{ xs: 12, md: 6, xl: 4 }}>
                <Card
                  elevation={0}
                  onClick={() => navigate(`/organizer/events/edit/${event.id}`)}
                  sx={{
                    height: '100%',
                    overflow: 'hidden',
                    borderRadius: '14px',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                    backgroundColor: 'background.paper',
                    transition: 'box-shadow 0.3s',
                    '&:hover': {
                      boxShadow: '0 8px 32px rgba(36, 148, 142, 0.25), 0 4px 14px rgba(0,0,0,0.18)',
                      cursor: 'pointer',
                    },
                    '&:hover .event-card-image': {
                      transform: 'scale(1.07)',
                    },
                  }}
                >
                  <Box
                    className="event-card-image"
                    sx={{
                      height: 192,
                      backgroundImage: `url(${getEventImage(event.imageData)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  />
                  <CardContent sx={{ p: 2.25 }}>
                    <Stack spacing={1.75}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontSize: '1.15rem',
                          lineHeight: 1.3,
                        }}
                      >
                        {event.title}
                      </Typography>

                      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                        <CalendarMonthOutlined sx={{ fontSize: 18, color: 'primary.dark' }} />
                        <Typography variant="body1" color="text.secondary">
                          {formatEventDate(event.date)}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                        <LocationOnOutlined sx={{ fontSize: 18, color: 'primary.dark' }} />
                        <Typography variant="body1" color="text.secondary">
                          {event.location}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : null}
      </Stack>
    </PageTemplate>
  );
}

