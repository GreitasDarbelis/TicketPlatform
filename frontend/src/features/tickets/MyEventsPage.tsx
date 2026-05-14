import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import ConfirmationNumberOutlined from '@mui/icons-material/ConfirmationNumberOutlined';
import { Link as RouterLink } from 'react-router-dom';
import type { AppPage } from '../../app/page-registry';
import { PageTemplate } from '../../components/PageTemplate';
import { formatEventDate, getEventImage } from '../events/display';
import { formatTicketPrice } from './mockTicketing';
import { getPurchasedTickets } from './storage';
import type { PurchasedTicket } from './types';

const myEventsPage: AppPage = {
  id: 'customer-tickets',
  role: 'customer',
  path: '/customer/tickets',
  title: 'My Events',
  navLabel: 'My Events',
};

export function MyEventsPage() {
  const [tickets, setTickets] = useState<PurchasedTicket[]>(() => getPurchasedTickets());

  useEffect(() => {
    setTickets(getPurchasedTickets());
  }, []);

  return (
    <PageTemplate
      page={myEventsPage}
      actions={
        <Button component={RouterLink} to="/customer/events" variant="contained" color="secondary">
          Browse Events
        </Button>
      }
    >
      {tickets.length === 0 ? (
        <Card elevation={0} sx={{ borderRadius: '24px' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6">No tickets yet</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Tickets you purchase in the mocked checkout flow will appear here.
            </Typography>
            <Button component={RouterLink} to="/customer/events" variant="contained" color="secondary">
              Browse Events
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {tickets.map((ticket) => (
            <Grid key={ticket.id} size={{ xs: 12, md: 6, xl: 4 }}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  overflow: 'hidden',
                  borderRadius: '18px',
                  boxShadow: '0 8px 24px rgba(6, 30, 35, 0.12)',
                }}
              >
                <Box
                  sx={{
                    height: 180,
                    backgroundImage: `url(${getEventImage(ticket.eventImageData)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: 'primary.light',
                  }}
                />

                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="h5" sx={{ fontSize: '1.35rem', mb: 1 }}>
                        {ticket.eventTitle}
                      </Typography>
                      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', mb: 1 }}>
                        <CalendarMonthOutlined sx={{ fontSize: 18, color: 'primary.dark' }} />
                        <Typography color="text.secondary">
                          {formatEventDate(ticket.eventDate, 'medium')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                        <LocationOnOutlined sx={{ fontSize: 18, color: 'primary.dark' }} />
                        <Typography color="text.secondary">{ticket.eventLocation}</Typography>
                      </Stack>
                    </Box>

                    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                      <ConfirmationNumberOutlined sx={{ fontSize: 18, color: 'primary.dark' }} />
                      <Typography color="text.secondary">{ticket.ticketCode}</Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                      <Chip
                        label={`${ticket.quantity} ticket${ticket.quantity === 1 ? '' : 's'}`}
                        sx={{ bgcolor: 'background.default', color: 'primary.dark' }}
                      />
                      <Chip
                        label={formatTicketPrice(ticket.totalPrice)}
                        sx={{ bgcolor: 'background.default', color: 'primary.dark' }}
                      />
                    </Stack>

                    <Button
                      component={RouterLink}
                      to={`/customer/tickets/${ticket.id}`}
                      variant="contained"
                      color="primary"
                      sx={{ alignSelf: 'flex-start', borderRadius: '10px' }}
                    >
                      View Ticket
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </PageTemplate>
  );
}
