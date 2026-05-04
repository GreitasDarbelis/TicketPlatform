import { useEffect, useState } from 'react';
import { fetchEventById } from './api';
import type { EventSummary } from './types';

type UseEventDetailsResult = {
  event: EventSummary | null;
  isLoading: boolean;
  errorMessage: string | null;
};

export function useEventDetails(eventId: string | undefined): UseEventDetailsResult {
  const [event, setEvent] = useState<EventSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadEventDetails() {
      if (!eventId) {
        setEvent(null);
        setErrorMessage('Event was not found.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);
        const loadedEvent = await fetchEventById(eventId, controller.signal);
        setEvent(loadedEvent);
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        setEvent(null);
        setErrorMessage('Unable to load this event right now.');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadEventDetails();

    return () => {
      controller.abort();
    };
  }, [eventId]);

  return {
    event,
    isLoading,
    errorMessage,
  };
}
