import { Button, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getImmediateChildPages, type AppPage } from '../app/page-registry';
import { PageTemplate } from './PageTemplate';

type PagePlaceholderProps = {
  page: AppPage;
};

export function PagePlaceholder({ page }: PagePlaceholderProps) {
  const childPages = getImmediateChildPages(page.path);

  return (
    <PageTemplate page={page}>
      <Paper
        sx={{
          p: 3,
          borderRadius: '24px',
          backgroundColor: 'background.paper',
        }}
      >
        <Typography color="text.secondary">Page not implemented yet.</Typography>

        {childPages.length > 0 ? (
          <Stack direction="row" spacing={1.5} useFlexGap sx={{ mt: 3, flexWrap: 'wrap' }}>
            {childPages.map((childPage) => (
              <Button
                key={childPage.path}
                component={RouterLink}
                to={childPage.path}
                variant="outlined"
              >
                {childPage.title}
              </Button>
            ))}
          </Stack>
        ) : null}
      </Paper>
    </PageTemplate>
  );
}
