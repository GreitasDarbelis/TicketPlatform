import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import AddRounded from '@mui/icons-material/AddRounded';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import RemoveRounded from '@mui/icons-material/RemoveRounded';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useEventDetails } from '../events/useEventDetails';
import {
  formatTicketPrice,
  getAvailableTicketCount,
  MOCK_TICKET_PRICE,
} from './mockTicketing';

export function PurchaseTicketsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { event, isLoading, errorMessage } = useEventDetails(eventId);
  const [ticketCount, setTicketCount] = useState(1);

  const maxTickets = getAvailableTicketCount(event?.totalTickets ?? null);
  const isSoldOut = event?.totalTickets === 0;
  const totalPrice = ticketCount * MOCK_TICKET_PRICE;

  useEffect(() => {
    if (isSoldOut) {
      setTicketCount(0);
      return;
    }

    setTicketCount((currentTicketCount) => {
      if (currentTicketCount === 0) {
        return 1;
      }

      return Math.min(currentTicketCount, maxTickets);
    });
  }, [isSoldOut, maxTickets]);

  function handleDecreaseTicketCount() {
    setTicketCount((currentTicketCount) => Math.max(1, currentTicketCount - 1));
  }

  function handleIncreaseTicketCount() {
    setTicketCount((currentTicketCount) => Math.min(maxTickets, currentTicketCount + 1));
  }

  function handleProceedToPayment() {
    if (!event || ticketCount < 1) {
      return;
    }

    navigate(`/customer/events/${event.id}/payment?quantity=${ticketCount}`);
  }

  return (
    <Stack sx={{ alignItems: 'center' }}>
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 980 }}>
        <Button
          component={RouterLink}
          to={eventId ? `/customer/events/${eventId}` : '/customer/events'}
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

        {!isLoading && !errorMessage && event ? (
          <Card
            elevation={0}
            sx={{
              width: '100%',
              borderRadius: '22px',
              boxShadow: '0 18px 38px rgba(6, 30, 35, 0.12)',
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '2.45rem' }, mb: 2 }}>
                    Purchase Tickets
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ color: 'primary.dark', fontSize: { xs: '1.45rem', md: '1.7rem' }, mb: 1 }}
                  >
                    {event.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: '1.05rem' }}>
                    Price per ticket: {formatTicketPrice(MOCK_TICKET_PRICE)}
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <Typography variant="h6">Number of Tickets</Typography>

                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Button
                      onClick={handleDecreaseTicketCount}
                      disabled={ticketCount <= 1}
                      sx={{
                        minWidth: 42,
                        width: 42,
                        height: 42,
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: 'primary.light',
                        bgcolor: 'background.default',
                        color: 'primary.dark',
                        '&:hover': {
                          bgcolor: 'background.default',
                        },
                      }}
                    >
                      <RemoveRounded />
                    </Button>

                    <Typography sx={{ minWidth: 44, textAlign: 'center', fontSize: '1.75rem' }}>
                      {ticketCount}
                    </Typography>

                    <Button
                      onClick={handleIncreaseTicketCount}
                      disabled={isSoldOut || ticketCount >= maxTickets}
                      sx={{
                        minWidth: 42,
                        width: 42,
                        height: 42,
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: 'primary.light',
                        bgcolor: 'background.default',
                        color: 'primary.dark',
                        '&:hover': {
                          bgcolor: 'background.default',
                        },
                      }}
                    >
                      <AddRounded />
                    </Button>
                  </Stack>

                  <Typography color="text.secondary">
                    {isSoldOut ? 'This event is currently sold out.' : `Max available: ${maxTickets}`}
                  </Typography>
                </Stack>

                <Divider />

                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Typography variant="h4" sx={{ fontSize: { xs: '1.9rem', md: '2.1rem' } }}>
                    Total Price:
                  </Typography>
                  <Typography
                    variant="h4"
                    color="secondary.main"
                    sx={{ fontSize: { xs: '1.9rem', md: '2.1rem' } }}
                  >
                    {formatTicketPrice(totalPrice)}
                  </Typography>
                </Stack>

                <Button
                  onClick={handleProceedToPayment}
                  variant="contained"
                  color="secondary"
                  size="large"
                  disabled={isSoldOut}
                  sx={{ borderRadius: '10px', py: 1.35, fontSize: '1.15rem' }}
                >
                  Proceed to Payment
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ) : null}
      </Stack>
    </Stack>
  );
}
