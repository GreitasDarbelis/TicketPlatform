import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import type { AppPage } from '../app/page-registry';

type PageTemplateProps = {
  page: AppPage;
  children: ReactNode;
  actions?: ReactNode;
};

export function PageTemplate({ page, children, actions }: PageTemplateProps) {
  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', lg: 'center' },
        }}
      >
        <Box>
          <Typography variant="h4">{page.title}</Typography>
        </Box>
        {actions ? <Stack direction="row" spacing={1}>{actions}</Stack> : null}
      </Stack>

      {children}
    </Stack>
  );
}
