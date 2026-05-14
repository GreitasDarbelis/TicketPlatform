import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import CheckRounded from '@mui/icons-material/CheckRounded';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { formatEventDate } from '../events/display';
import { MockQrCode } from './MockQrCode';
import { formatTicketPrice } from './mockTicketing';
import { getPurchasedTicketById } from './storage';
import type { PurchasedTicket } from './types';

export function TicketDetailsPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<PurchasedTicket | null>(() =>
    ticketId ? getPurchasedTicketById(ticketId) : null,
  );

  useEffect(() => {
    if (!ticketId) {
      setTicket(null);
      return;
    }

    setTicket(getPurchasedTicketById(ticketId));
  }, [ticketId]);

  if (!ticket) {
    return (
      <Stack spacing={3} sx={{ maxWidth: 720, mx: 'auto' }}>
        <Alert severity="warning">This mocked ticket could not be found.</Alert>
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
            {ticket.eventTitle}
          </Typography>
          <Typography sx={{ fontSize: '1.05rem', opacity: 0.95 }}>
            {formatEventDate(ticket.eventDate, 'medium')}
          </Typography>
          <Typography sx={{ fontSize: '1.05rem', opacity: 0.95 }}>{ticket.eventLocation}</Typography>
        </Box>

        <CardContent sx={{ p: { xs: 3, md: 4.5 }, textAlign: 'center' }}>
          <Stack spacing={2.5} sx={{ alignItems: 'center' }}>
            <MockQrCode value={`${ticket.id}:${ticket.ticketCode}`} />

            <Typography color="text.secondary" sx={{ fontSize: '1.35rem', letterSpacing: '0.04em' }}>
              {ticket.ticketCode}
            </Typography>

            <Stack direction="row" spacing={1.25} useFlexGap sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip
                label={`${ticket.quantity} ticket${ticket.quantity === 1 ? '' : 's'}`}
                sx={{ bgcolor: 'background.default', color: 'primary.dark' }}
              />
              <Chip
                label={`Paid ${formatTicketPrice(ticket.totalPrice)}`}
                sx={{ bgcolor: 'background.default', color: 'primary.dark' }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

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
