export function formatEventDate(value: string, variant: 'long' | 'medium' = 'long'): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: variant,
    timeStyle: 'short',
  }).format(new Date(value));
}

export function getEventImage(imageData: string | null): string {
  return imageData ?? '';
}
