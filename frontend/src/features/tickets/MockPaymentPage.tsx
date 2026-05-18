import { useEffect, useRef, useState } from 'react';
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
import CreditCardRounded from '@mui/icons-material/CreditCardRounded';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEventDetails } from '../events/useEventDetails';
import { purchaseTickets } from './api';
import { getAvailableTicketCount } from './mockTicketing';

function getRequestedQuantity(value: string | null): number {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return 1;
  }

  return parsedValue;
}

export function MockPaymentPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { event, isLoading, errorMessage } = useEventDetails(eventId);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const processingTimeoutRef = useRef<number | null>(null);

  const requestedQuantity = getRequestedQuantity(searchParams.get('quantity'));
  const effectiveQuantity = event
    ? Math.min(requestedQuantity, getAvailableTicketCount(event.totalTickets))
    : requestedQuantity;

  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current !== null) {
        window.clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);

  async function completePurchase() {
    if (!event || effectiveQuantity < 1) {
      return;
    }

    try {
      await purchaseTickets(event.id, effectiveQuantity);
      navigate(`/customer/tickets/${event.id}`, {
        replace: true,
        state: { justPurchased: true },
      });
    } catch (error) {
      setPurchaseError(
        error instanceof Error ? error.message : 'Could not complete ticket purchase.',
      );
      setIsProcessing(false);
    }
  }

  function handleProceed() {
    if (!event || isProcessing || effectiveQuantity < 1) {
      return;
    }

    setIsProcessing(true);
    setPurchaseError(null);

    processingTimeoutRef.current = window.setTimeout(() => {
      void completePurchase();
    }, 1600);
  }

  return (
    <Stack sx={{ minHeight: 'calc(100vh - 200px)', justifyContent: 'center' }}>
      {isLoading ? (
        <Stack sx={{ minHeight: 320, alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Stack>
      ) : null}

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {purchaseError ? <Alert severity="error">{purchaseError}</Alert> : null}

      {!isLoading && !errorMessage && event ? (
        <Card
          elevation={0}
          sx={{
            maxWidth: 570,
            width: '100%',
            mx: 'auto',
            borderRadius: '24px',
            boxShadow: '0 18px 38px rgba(6, 30, 35, 0.12)',
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 5 }, textAlign: 'center' }}>
            <Stack spacing={3} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  width: 82,
                  height: 82,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.main',
                  color: 'common.white',
                }}
              >
                <CreditCardRounded sx={{ fontSize: 44 }} />
              </Box>

              <Box>
                <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mb: 1.5 }}>
                  Simulating Payment
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                  This is a payment simulation for demo purposes.
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                  No actual payment will be processed.
                </Typography>
              </Box>

              {isProcessing ? (
                <Stack spacing={2} sx={{ alignItems: 'center', pt: 2 }}>
                  <CircularProgress size={64} thickness={3.5} />
                  <Typography color="text.secondary" sx={{ fontSize: '1.2rem' }}>
                    Processing...
                  </Typography>
                </Stack>
              ) : (
                <Button
                  onClick={handleProceed}
                  variant="contained"
                  color="secondary"
                  size="large"
                  disabled={effectiveQuantity < 1}
                  sx={{ borderRadius: '10px', px: 5.5, py: 1.2, fontSize: '1.15rem' }}
                >
                  Proceed
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
}
