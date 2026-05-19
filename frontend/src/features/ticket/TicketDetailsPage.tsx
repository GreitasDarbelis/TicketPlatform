import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  CircularProgress
} from '@mui/material';
import CheckRounded from '@mui/icons-material/CheckRounded';
import {Link as RouterLink, useParams} from 'react-router-dom';
import { formatEventDate } from '../event/display';
import { useAuthSession } from '../auth/AuthSessionContext';
import type { UserTicketDto } from './ticketTypes';
import { fetchTicketsByEvent } from './ticketApi';
import { TicketQRCode } from './TicketQRCode';

export function TicketDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user, status } = useAuthSession();
  const [tickets, setTickets] = useState<UserTicketDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadTickets() {
            if (status === 'loading') {
                return;
            }

            if (!eventId || !user) {
                setErrorMessage('Event ID or user information missing.');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setErrorMessage(null);
                const loadedTickets = await fetchTicketsByEvent(eventId, user.id, controller.signal);
                setTickets(loadedTickets);
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                setErrorMessage('Unable to load tickets right now.');
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void loadTickets();

        return () => {
            controller.abort();
        };
    }, [eventId, user, status]);

    if (isLoading) {
        return (
            <Stack sx={{ minHeight: 400, alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Stack>
        );
    }

    if (errorMessage) {
        return (
            <Stack spacing={3} sx={{ maxWidth: 720, mx: 'auto' }}>
                <Alert severity="error">{errorMessage}</Alert>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <Button component={RouterLink} to="/customer/tickets" variant="contained">
                        View My Events
                    </Button>
                    <Button component={RouterLink} to="/customer/events" variant="outlined">
                        Browse More Events
                    </Button>
                </Stack>
            </Stack>
        );
    }

    if (tickets.length === 0) {
        return (
            <Stack spacing={3} sx={{ maxWidth: 720, mx: 'auto' }}>
                <Alert severity="warning">No tickets found for this event.</Alert>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <Button component={RouterLink} to="/customer/tickets" variant="contained">
                        View My Events
                    </Button>
                    <Button component={RouterLink} to="/customer/events" variant="outlined">
                        Browse More Events
                    </Button>
                </Stack>
            </Stack>
        );
    }

  return (
    <Stack spacing={3} sx={{ maxWidth: 860, mx: 'auto', pb: 4 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: '24px',
          boxShadow: '0 18px 38px rgba(6, 30, 35, 0.12)',
        }}
      >
        <CardContent sx={{ p: { xs: 4, md: 5 }, textAlign: 'center' }}>
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'success.main',
                color: 'success.contrastText',
              }}
            >
              <CheckRounded sx={{ fontSize: 34 }} />
            </Box>

            <Box>
              <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '2.35rem' }, mb: 1 }}>
                Purchase Successful!
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: '1.05rem' }}>
                Your tickets have been generated
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2.5}>
          {tickets.map((ticket) => (
              <Card
                  key={ticket.ticketId}
                  elevation={0}
                  sx={{
                      overflow: 'hidden',
                      borderRadius: '24px',
                      boxShadow: '0 18px 38px rgba(6, 30, 35, 0.12)',
                  }}
              >
                  <Box sx={{ bgcolor: 'primary.main', color: 'common.white', p: { xs: 3, md: 4 } }}>
                      <Typography variant="h4" sx={{ fontSize: { xs: '1.9rem', md: '2.25rem' }, mb: 1.5 }}>
                          {ticket.eventTitle}
                      </Typography>
                      <Typography sx={{ fontSize: '1.05rem', opacity: 0.95 }}>
                          {formatEventDate(ticket.eventDate, 'medium')}
                      </Typography>
                      <Typography sx={{ fontSize: '1.05rem', opacity: 0.95 }}>{ticket.eventLocation}</Typography>
                  </Box>

                  <CardContent sx={{ p: { xs: 3, md: 4.5 }, textAlign: 'center' }}>
                      <Stack spacing={2.5} sx={{ alignItems: 'center' }}>
                          <TicketQRCode ticketCode={ticket.ticketCode} size={256} />

                          <Typography color="text.secondary" sx={{ fontSize: '1.35rem', letterSpacing: '0.04em' }}>
                              {ticket.ticketCode}
                          </Typography>
                      </Stack>
                  </CardContent>
              </Card>
          ))}
      </Stack>



      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
        <Button
          component={RouterLink}
          to="/customer/tickets"
          variant="contained"
          color="primary"
          size="large"
          sx={{ flex: 1, borderRadius: '10px', py: 1.25 }}
        >
          View My Events
        </Button>
        <Button
          component={RouterLink}
          to="/customer/events"
          variant="outlined"
          size="large"
          sx={{ flex: 1, borderRadius: '10px', py: 1.25, bgcolor: 'background.paper' }}
        >
          Browse More Events
        </Button>
      </Stack>
    </Stack>
  );
}
