import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import { useNavigate } from 'react-router-dom';
import type { AppPage } from '../../app/page-registry';
import { PageTemplate } from '../../components/PageTemplate';
import { formatEventDate, getEventImage } from '../event/display';
import { fetchUserPurchasedEvents } from './ticketApi';
import type { UserEventDto } from './ticketTypes';
import { useAuthSession } from '../auth/AuthSessionContext';

type MyEventsPageProps = {
  page: AppPage;
}

export function MyEventsPage({ page }: MyEventsPageProps) {
  const [events, setEvents] = useState<UserEventDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuthSession();

  useEffect(() => {
    const controller = new AbortController();

    async function loadEvents() {
      if (!user) {
        setErrorMessage('You must be logged in to view your tickets.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);
        const loadedEvents = await fetchUserPurchasedEvents(user.id, controller.signal);
        setEvents(loadedEvents);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setErrorMessage('Unable to load your events right now.');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadEvents();

    return () => {
      controller.abort();
    };
  }, [user]);

  return (
      <PageTemplate page={page}>
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
                  <Typography variant="h6">No tickets yet</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                    Tickets you purchase will appear here.
                  </Typography>
                </CardContent>
              </Card>
          ) : null}

          {!isLoading && !errorMessage ? (
              <Grid container spacing={3}>
                {events.map((event) => (
                    <Grid key={event.eventId} size={{ xs: 12, md: 6, xl: 4 }}>
                      <Card
                          elevation={0}
                          onClick={() => navigate(`/customer/tickets/event/${event.eventId}`)}
                          sx={{
                            height: '100%',
                            overflow: 'hidden',
                            borderRadius: '14px',
                            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                            backgroundColor: 'background.paper',
                            transition: 'box-shadow 0.3s',
                            cursor: 'pointer',
                            '&:hover': {
                              boxShadow: '0 8px 32px rgba(36, 148, 142, 0.25), 0 4px 14px rgba(0,0,0,0.18)',
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
                                {formatEventDate(event.date, 'medium')}
                              </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                              <LocationOnOutlined sx={{ fontSize: 18, color: 'primary.dark' }} />
                              <Typography variant="body1" color="text.secondary">
                                {event.location}
                              </Typography>
                            </Stack>

                            <Chip
                                label={`${event.ticketCount} ticket${event.ticketCount === 1 ? '' : 's'}`}
                                sx={{
                                  bgcolor: 'primary.light',
                                  color: 'primary.dark',
                                  fontWeight: 600,
                                }}
                            />

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
