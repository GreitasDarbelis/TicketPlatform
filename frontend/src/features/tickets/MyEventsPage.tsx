import { useMemo } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';
import type { AppPage } from '../../app/page-registry';
import { getPurchasedEventsWithTickets, type MockPurchasedEvent } from './mockTicketDatabase';

const myEventsPage: AppPage = {
  id: 'customer-my-events',
  role: 'customer',
  path: '/customer/my-events',
  title: 'My Events',
  navLabel: 'My Events',
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

function MyEventCard({ event }: { event: MockPurchasedEvent }) {
  return (
    <Card
      elevation={0}
      sx={{
        overflow: 'hidden',
        borderRadius: '14px',
        boxShadow: '0 12px 28px rgba(6, 30, 35, 0.14)',
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/customer/tickets/${event.id}`}
        sx={{
          display: 'block',
          color: 'inherit',
          '&:hover .my-event-card-image': {
            transform: 'scale(1.05)',
          },
        }}
      >
        <Box
          className="my-event-card-image"
          sx={{
            height: { xs: 230, md: 360 },
            backgroundImage: `url(${event.imageUrl})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack spacing={1.8}>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.45rem', md: '1.9rem' },
                lineHeight: 1.2,
                color: 'text.secondary',
              }}
            >
              {event.title}
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <CalendarMonthOutlined sx={{ fontSize: 28, color: 'primary.dark' }} />
              <Typography sx={{ fontSize: { xs: '1.05rem', md: '1.45rem' }, color: 'primary.dark' }}>
                {formatEventDate(event.date)}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <LocationOnOutlined sx={{ fontSize: 28, color: 'primary.dark' }} />
              <Typography sx={{ fontSize: { xs: '1.05rem', md: '1.45rem' }, color: 'primary.dark' }}>
                {event.location}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export function MyEventsPage() {
  const purchasedEvents = useMemo(() => getPurchasedEventsWithTickets(), []);
  const now = useMemo(() => new Date(), []);
  const upcomingEvents = purchasedEvents.filter((event) => new Date(event.date) >= now);
  const pastEvents = purchasedEvents.filter((event) => new Date(event.date) < now);

  return (
    <Stack spacing={{ xs: 5, md: 7 }}>
      <Typography
        variant="h3"
        sx={{ fontSize: { xs: '2.6rem', md: '3.5rem' }, lineHeight: 1.15, color: 'text.secondary' }}
      >
        {myEventsPage.title}
      </Typography>

      <Stack spacing={3}>
        <Typography
          variant="h4"
          sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, color: 'primary.dark' }}
        >
          Upcoming Events
        </Typography>

        {upcomingEvents.length > 0 ? (
          <Grid container spacing={3}>
            {upcomingEvents.map((event) => (
              <Grid key={event.id} size={{ xs: 12, md: 6, lg: 4 }}>
                <MyEventCard event={event} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.45rem' }, color: 'primary.dark' }}>
            No upcoming events
          </Typography>
        )}
      </Stack>

      <Stack spacing={3}>
        <Typography
          variant="h4"
          sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, color: 'primary.dark' }}
        >
          Past Events
        </Typography>

        {pastEvents.length > 0 ? (
          <Grid container spacing={3}>
            {pastEvents.map((event) => (
              <Grid key={event.id} size={{ xs: 12, md: 6, lg: 4 }}>
                <MyEventCard event={event} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.45rem' }, color: 'primary.dark' }}>
            No past events
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}
