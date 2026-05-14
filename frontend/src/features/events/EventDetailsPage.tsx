import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import PersonOutlineOutlined from '@mui/icons-material/PersonOutlineOutlined';
import AttachMoneyRounded from '@mui/icons-material/AttachMoneyRounded';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { formatEventDate, getEventImage } from './display';
import { useEventDetails } from './useEventDetails';
import { formatTicketPrice, MOCK_TICKET_PRICE } from '../tickets/mockTicketing';

type DetailRowProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
  accent?: boolean;
};

function DetailRow({ icon, children, accent = false }: DetailRowProps) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: accent ? 'secondary.main' : 'primary.dark',
        }}
      >
        {icon}
      </Box>
      <Typography color={accent ? 'secondary.main' : 'text.secondary'} sx={{ fontSize: '1.05rem' }}>
        {children}
      </Typography>
    </Stack>
  );
}

export function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { event, isLoading, errorMessage } = useEventDetails(eventId);

  return (
    <Stack spacing={3}>
      <Button
        component={RouterLink}
        to="/customer/events"
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
        <Card elevation={0} sx={{ overflow: 'hidden', borderRadius: '28px' }}>
          <Box
            sx={{
              height: { xs: 240, md: 420 },
              backgroundImage: `url(${getEventImage(event.imageData)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: 'grey.200',
            }}
          />

          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '2.45rem' } }}>
                  {event.title}
                </Typography>
              </Box>

              <Stack spacing={2}>
                <DetailRow icon={<CalendarMonthOutlined sx={{ fontSize: 22 }} />}>
                  {formatEventDate(event.date)}
                </DetailRow>
                <DetailRow icon={<LocationOnOutlined sx={{ fontSize: 22 }} />}>
                  {event.location}
                </DetailRow>
                <DetailRow icon={<PersonOutlineOutlined sx={{ fontSize: 22 }} />}>
                  Organized by {event.organizerEmail}
                </DetailRow>
                <DetailRow icon={<AttachMoneyRounded sx={{ fontSize: 22 }} />} accent>
                  {formatTicketPrice(MOCK_TICKET_PRICE)}
                </DetailRow>
              </Stack>

              <Box>
                <Typography variant="h6" sx={{ mb: 1.5 }}>
                  Description
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 960, lineHeight: 1.7 }}>
                  {event.description?.trim() || 'Description will be added soon.'}
                </Typography>
              </Box>

              <Button
                component={RouterLink}
                to={`/customer/events/${event.id}/purchase`}
                variant="contained"
                color="secondary"
                size="large"
                sx={{ borderRadius: '12px', py: 1.4, fontSize: '1.1rem' }}
              >
                Buy Ticket
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
}
