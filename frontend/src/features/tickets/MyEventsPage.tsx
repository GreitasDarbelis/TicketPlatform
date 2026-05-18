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
import Grid from '@mui/material/Grid';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import ConfirmationNumberOutlined from '@mui/icons-material/ConfirmationNumberOutlined';
import { Link as RouterLink } from 'react-router-dom';
import type { AppPage } from '../../app/page-registry';
import { PageTemplate } from '../../components/PageTemplate';
import { formatEventDate, getEventImage } from '../events/display';
import { fetchMyTickets } from './api';
import { formatTicketPrice } from './mockTicketing';
import { groupPurchasedTicketsByEvent, type PurchasedTicketGroup } from './types';

type MyEventsPageProps = {
  page: AppPage;
}

export function MyEventsPage({page}: MyEventsPageProps) {
  const [ticketGroups, setTicketGroups] = useState<PurchasedTicketGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTickets() {
      try {
        const tickets = await fetchMyTickets();

        if (!isMounted) {
          return;
        }

        setTicketGroups(groupPurchasedTicketsByEvent(tickets));
        setErrorMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : 'Could not load tickets.');
        setTicketGroups([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadTickets();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageTemplate page={page}>
      {isLoading ? (
        <Stack sx={{ minHeight: 320, alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Stack>
      ) : null}

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      {!isLoading && !errorMessage && ticketGroups.length === 0 ? (
        <Card elevation={0} sx={{ borderRadius: '24px' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6">No tickets yet</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Tickets you purchase will appear here.
            </Typography>
            <Button component={RouterLink} to="/customer" variant="contained" color="secondary">
              Browse Events
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !errorMessage && ticketGroups.length > 0 ? (
        <Grid container spacing={3}>
          {ticketGroups.map((ticketGroup) => (
            <Grid key={ticketGroup.eventId} size={{ xs: 12, md: 6, xl: 4 }}>
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
                    backgroundImage: `url(${getEventImage(ticketGroup.eventImageData)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: 'primary.light',
                  }}
                />

                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="h5" sx={{ fontSize: '1.35rem', mb: 1 }}>
                        {ticketGroup.eventTitle}
                      </Typography>
                      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', mb: 1 }}>
                        <CalendarMonthOutlined sx={{ fontSize: 18, color: 'primary.dark' }} />
                        <Typography color="text.secondary">
                          {formatEventDate(ticketGroup.eventDate, 'medium')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                        <LocationOnOutlined sx={{ fontSize: 18, color: 'primary.dark' }} />
                        <Typography color="text.secondary">{ticketGroup.eventLocation}</Typography>
                      </Stack>
                    </Box>

                    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                      <ConfirmationNumberOutlined sx={{ fontSize: 18, color: 'primary.dark' }} />
                      <Typography color="text.secondary">
                        {ticketGroup.tickets[0]?.ticketCode}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                      <Chip
                        label={`${ticketGroup.quantity} ticket${ticketGroup.quantity === 1 ? '' : 's'}`}
                        sx={{ bgcolor: 'background.default', color: 'primary.dark' }}
                      />
                      <Chip
                        label={formatTicketPrice(ticketGroup.totalPrice)}
                        sx={{ bgcolor: 'background.default', color: 'primary.dark' }}
                      />
                    </Stack>

                    <Button
                      component={RouterLink}
                      to={`/customer/tickets/${ticketGroup.eventId}`}
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
      ) : null}
    </PageTemplate>
  );
}
