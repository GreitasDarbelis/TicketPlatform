import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import KeyboardRounded from '@mui/icons-material/KeyboardRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import CancelRounded from '@mui/icons-material/CancelRounded';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useEventDetails } from '../events/useEventDetails';
import { validateTicket, type TicketValidationResult } from './api';

function ValidationResultPanel({ result }: { result: TicketValidationResult }) {
  const isAccepted = result.accepted;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '22px',
        border: '1px solid',
        borderColor: isAccepted ? 'success.light' : 'error.light',
        bgcolor: isAccepted ? 'rgba(83, 186, 104, 0.08)' : 'rgba(211, 47, 47, 0.08)',
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: isAccepted ? 'success.main' : 'error.main',
              color: 'common.white',
              flexShrink: 0,
            }}
          >
            {isAccepted ? <CheckCircleRounded /> : <CancelRounded />}
          </Box>

          <Stack spacing={0.75}>
            <Typography variant="h5">{isAccepted ? 'Ticket Accepted' : 'Ticket Rejected'}</Typography>
            <Typography color="text.secondary">{result.message}</Typography>
            {result.ticketCode ? (
              <Typography sx={{ fontWeight: 600, color: 'primary.dark' }}>
                Ticket code: {result.ticketCode}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function StaffTicketValidationPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { event, isLoading, errorMessage } = useEventDetails(eventId);
  const [ticketCode, setTicketCode] = useState('');
  const [result, setResult] = useState<TicketValidationResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(eventForm: FormEvent<HTMLFormElement>) {
    eventForm.preventDefault();

    if (!eventId) {
      setSubmitError('Event was not found.');
      setResult(null);
      return;
    }

    const normalizedCode = ticketCode.trim();
    if (!normalizedCode) {
      setSubmitError('Enter or scan a ticket code first.');
      setResult(null);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const validationResult = await validateTicket(eventId, { ticketCode: normalizedCode });
      setResult(validationResult);
    } catch (submissionError) {
      const message = submissionError instanceof Error
        ? submissionError.message
        : 'Ticket validation failed.';

      setSubmitError(message);
      setResult(null);
    } finally {
      setIsSubmitting(false);
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }

  return (
    <Stack spacing={3.5} sx={{ maxWidth: 1180, mx: 'auto', pb: 4 }}>
      <Button
        component={RouterLink}
        to="/staff"
        startIcon={<ArrowBackRounded />}
        variant="outlined"
        sx={{ alignSelf: 'flex-start', borderRadius: '12px', bgcolor: 'background.paper' }}
      >
        Back to Events
      </Button>

      <Card
        elevation={0}
        sx={{
          borderRadius: '24px',
          boxShadow: '0 14px 34px rgba(6, 30, 35, 0.12)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          {isLoading ? (
            <Stack sx={{ minHeight: 120, alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </Stack>
          ) : null}

          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

          {!isLoading && !errorMessage && event ? (
            <Stack spacing={1}>
              <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '2.4rem' } }}>
                Validate Tickets
              </Typography>
              <Typography sx={{ color: 'primary.dark', fontSize: '1.55rem', fontWeight: 500 }}>
                {event.title}
              </Typography>
            </Stack>
          ) : null}
        </CardContent>
      </Card>

      <Card
        elevation={0}
        sx={{
          borderRadius: '24px',
          boxShadow: '0 14px 34px rgba(6, 30, 35, 0.12)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <KeyboardRounded sx={{ color: 'primary.dark' }} />
              <Typography variant="h5">Manual Entry</Typography>
            </Stack>

            <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
              Scan a visitor QR code into the field with your scanner, or enter the ticket code manually if scanning fails.
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  inputRef={inputRef}
                  label="Ticket Number"
                  value={ticketCode}
                  onChange={(inputEvent) => setTicketCode(inputEvent.target.value)}
                  placeholder="TKT-XXXXXXXXX"
                  fullWidth
                  autoComplete="off"
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting || isLoading || Boolean(errorMessage)}
                  sx={{ borderRadius: '10px', py: 1.4, fontSize: '1.1rem' }}
                >
                  {isSubmitting ? 'Validating...' : 'Validate Ticket'}
                </Button>
              </Stack>
            </Box>

            {submitError ? <Alert severity="error">{submitError}</Alert> : null}
            {result ? <ValidationResultPanel result={result} /> : null}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}