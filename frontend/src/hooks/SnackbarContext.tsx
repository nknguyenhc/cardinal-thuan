import type { AlertColor } from '@mui/material/Alert';
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';
import { Toast } from '../components/Toast/Toast';

interface SnackbarContextType {
  success: (message: string) => void;
  error: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType>({
  success: () => {},
  error: () => {},
});

export const SnackbarContextProvider = ({ children }: PropsWithChildren) => {
  const [message, setMessage] = useState<string>('');
  const [level, setLevel] = useState<AlertColor>('success');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const success = useCallback((message: string) => {
    setIsOpen(true);
    setMessage(message);
    setLevel('success');
  }, []);

  const error = useCallback((message: string) => {
    setIsOpen(true);
    setMessage(message);
    setLevel('error');
  }, []);

  return (
    <SnackbarContext.Provider value={{ success, error }}>
      {children}
      <Toast
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        message={message}
        level={level}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbarContext = () => useContext(SnackbarContext);
