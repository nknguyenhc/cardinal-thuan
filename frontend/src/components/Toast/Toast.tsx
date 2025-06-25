import Snackbar from '@mui/material/Snackbar';
import Alert, { type AlertColor } from '@mui/material/Alert';
import { useCallback } from 'react';

export const Toast = ({
  isOpen,
  setIsOpen,
  message,
  level,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  message: string;
  level: AlertColor;
}) => {
  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={level}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
