import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router';
import './NotFound.css';

export const NotFound = () => {
  return (
    <Typography variant="h4" className="not-found">
      <div>Not Found</div>
      <RouterLink to="/">
        <Link>Back to home</Link>
      </RouterLink>
    </Typography>
  );
};
