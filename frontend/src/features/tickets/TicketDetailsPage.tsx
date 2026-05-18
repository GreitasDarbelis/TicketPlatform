import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';
import { formatEventDate } from '../events/display';
import { MockQrCode } from './MockQrCode';
import { fetchMyTickets } from './api';
import { formatTicketPrice } from './mockTicketing';
import { groupPurchasedTicketsByEvent, type PurchasedTicketGroup } from './types';

export function TicketDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const location = useLocation();
  const [ticketGroup, setTicketGroup] = useState<PurchasedTicketGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const justPurchased = Boolean((location.state as { justPurchased?: boolean } | null)?.justPurchased);

  useEffect(() => {
    if (!eventId) {
      setTicketGroup(null);
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();

    async function loadTicketGroup() {
      try {
        const tickets = await fetchMyTickets(abortController.signal);

        if (abortController.signal.aborted) {
          return;
        }

        const matchingGroup = groupPurchasedTicketsByEvent(tickets).find(
          (candidateGroup) => candidateGroup.eventId === eventId,
        );

        setTicketGroup(matchingGroup ?? null);
        setErrorMessage(null);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : 'Could not load tickets.');
        setTicketGroup(null);
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadTicketGroup();

    return () => {
      abortController.abort();
    };
  }, [eventId]);

  return (
    <Stack spacing={3} sx={{ maxWidth: 860, mx: 'auto', pb: 4 }}>
      <Button
        component={RouterLink}
        to="/customer/tickets"
        startIcon={<ArrowBackRounded />}
        variant="outlined"
        sx={{ alignSelf: 'flex-start', borderRadius: '12px', bgcolor: 'background.paper' }}
      >
        Go Back
      </Button>

      {isLoading ? (
        <Stack sx={{ minHeight: 320, alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Stack>
      ) : null}

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      {!isLoading && !errorMessage && !ticketGroup ? (
        <Stack spacing={3}>
          <Alert severity="warning">No purchased tickets were found for this event.</Alert>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button component={RouterLink} to="/customer/tickets" variant="contained">
              View My Events
            </Button>
            <Button component={RouterLink} to="/customer" variant="outlined">
              Browse More Events
            </Button>
          </Stack>
        </Stack>
      ) : null}

      {!isLoading && !errorMessage && ticketGroup ? (
        <>
          {justPurchased ? (
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
                      Your tickets have been added to your account.
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ) : null}

          <Card
            elevation={0}
            sx={{
              overflow: 'hidden',
              borderRadius: '24px',
              boxShadow: '0 18px 38px rgba(6, 30, 35, 0.12)',
            }}
          >
            <Box sx={{ bgcolor: 'primary.main', color: 'common.white', p: { xs: 3, md: 4 } }}>
              <Typography variant="h4" sx={{ fontSize: { xs: '1.9rem', md: '2.25rem' }, mb: 1.5 }}>
                {ticketGroup.eventTitle}
              </Typography>
              <Typography sx={{ fontSize: '1.05rem', opacity: 0.95 }}>
                {formatEventDate(ticketGroup.eventDate, 'medium')}
              </Typography>
              <Typography sx={{ fontSize: '1.05rem', opacity: 0.95 }}>
                {ticketGroup.eventLocation}
              </Typography>
            </Box>

            <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
              <Stack direction="row" spacing={1.25} useFlexGap sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                <Chip
                  label={`${ticketGroup.quantity} ticket${ticketGroup.quantity === 1 ? '' : 's'}`}
                  sx={{ bgcolor: 'background.default', color: 'primary.dark' }}
                />
                <Chip
                  label={`Paid ${formatTicketPrice(ticketGroup.totalPrice)}`}
                  sx={{ bgcolor: 'background.default', color: 'primary.dark' }}
                />
              </Stack>
            </CardContent>
          </Card>

          <Stack spacing={3}>
            {ticketGroup.tickets.map((ticket) => (
              <Card
                key={ticket.id}
                elevation={0}
                sx={{
                  borderRadius: '24px',
                  boxShadow: '0 18px 38px rgba(6, 30, 35, 0.12)',
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4.5 }, textAlign: 'center' }}>
                  <Stack spacing={2.5} sx={{ alignItems: 'center' }}>
                    <MockQrCode value={`${ticket.id}:${ticket.ticketCode}`} />

                    <Typography color="text.secondary" sx={{ fontSize: '1.35rem', letterSpacing: '0.04em' }}>
                      {ticket.ticketCode}
                    </Typography>

                    <Chip
                      label={ticket.status}
                      sx={{ bgcolor: 'background.default', color: 'primary.dark' }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </>
      ) : null}
    </Stack>
  );
}
