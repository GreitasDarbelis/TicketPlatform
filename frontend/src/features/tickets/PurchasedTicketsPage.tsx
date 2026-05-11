import { useMemo } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import { Link as RouterLink, useParams } from 'react-router-dom';
import type { AppPage } from '../../app/page-registry';
import { MockQrCode } from './MockQrCode';
import { getPurchasedTicketsForEvent } from './mockTicketDatabase';

const purchasedTicketsPage: AppPage = {
  id: 'customer-tickets',
  role: 'customer',
  path: '/customer/tickets/:eventId',
  title: 'Your Tickets',
  navLabel: 'Your Tickets',
};

function formatEventDate(value: string): string {
  const date = new Date(value);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
  const formattedTime = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date);

  return `${formattedDate} • ${formattedTime}`;
}

export function PurchasedTicketsPage() {
  const { eventId } = useParams();
  const purchasedTicketGroup = useMemo(() => getPurchasedTicketsForEvent(eventId), [eventId]);

  return (
    <Stack spacing={4}>
      <Button
        component={RouterLink}
        to="/customer/my-events"
        startIcon={<ArrowBackRounded />}
        variant="outlined"
        sx={{
          alignSelf: 'flex-start',
          borderRadius: '8px',
          bgcolor: 'background.paper',
          color: 'text.secondary',
          px: 3,
          py: 1.3,
        }}
      >
        Go Back
      </Button>

      <Typography
        variant="h3"
        sx={{ fontSize: { xs: '2.5rem', md: '3.45rem' }, lineHeight: 1.15, color: 'text.secondary' }}
      >
        {purchasedTicketsPage.title}
      </Typography>

      {!purchasedTicketGroup ? (
        <Alert severity="info" sx={{ maxWidth: 720 }}>
          No purchased tickets were found for this event.
        </Alert>
      ) : null}

      <Stack spacing={4}>
        {purchasedTicketGroup?.tickets.map((ticket) => (
          <Card
            key={ticket.id}
            elevation={0}
            sx={{
              overflow: 'hidden',
              borderRadius: '14px',
              boxShadow: '0 18px 38px rgba(6, 30, 35, 0.12)',
            }}
          >
            <Box sx={{ bgcolor: 'primary.main', color: 'common.white', p: { xs: 3, md: 4.5 } }}>
              <Typography
                variant="h4"
                sx={{ fontSize: { xs: '2rem', md: '2.65rem' }, mb: 2, color: 'common.white' }}
              >
                {purchasedTicketGroup.event.title}
              </Typography>
              <Typography sx={{ fontSize: { xs: '1.25rem', md: '1.7rem' }, color: 'common.white' }}>
                {formatEventDate(purchasedTicketGroup.event.date)}
              </Typography>
              <Typography sx={{ fontSize: { xs: '1.25rem', md: '1.7rem' }, color: 'common.white' }}>
                {purchasedTicketGroup.event.location}
              </Typography>
            </Box>

            <CardContent sx={{ p: { xs: 4, md: 7 }, textAlign: 'center' }}>
              <Stack spacing={4} sx={{ alignItems: 'center' }}>
                <MockQrCode value={ticket.ticketNumber} />
                <Typography
                  sx={{
                    color: 'primary.dark',
                    fontSize: { xs: '1.45rem', md: '2rem' },
                    letterSpacing: '0.08em',
                  }}
                >
                  {ticket.ticketNumber}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
