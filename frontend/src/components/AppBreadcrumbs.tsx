import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { getBreadcrumbPages } from '../app/page-registry';

export function AppBreadcrumbs() {
  const location = useLocation();
  const breadcrumbPages = getBreadcrumbPages(location.pathname);

  if (breadcrumbPages.length === 0) {
    return null;
  }

  return (
    <Breadcrumbs
      separator={<ChevronRightRoundedIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 3 }}
    >
      {breadcrumbPages.map((page, index) => {
        const isLastPage = index === breadcrumbPages.length - 1;

        if (isLastPage) {
          return (
            <Typography key={page.path} color="text.primary" sx={{ fontWeight: 500 }}>
              {page.title}
            </Typography>
          );
        }

        return (
          <Link
            key={page.path}
            component={RouterLink}
            underline="hover"
            color="inherit"
            to={page.path}
          >
            {page.title}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
