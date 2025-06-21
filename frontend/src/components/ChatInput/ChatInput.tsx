import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './ChatInput.css';
import { useCallback, useState } from 'react';

export const ChatInput = ({
  sendButtonPosition,
  onSend,
}: {
  sendButtonPosition: 'top-right' | 'bottom-right';
  onSend: (message: string) => void | Promise<void>;
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (isLoading || !message.trim()) return;
    setIsLoading(true);
    try {
      await onSend(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [message, onSend, isLoading]);

  return (
    <div className="chat-input">
      <TextField
        label="Ask a question"
        placeholder="Ask me a question"
        multiline
        maxRows={4}
        variant="standard"
        className="home-text-field"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div
        style={{
          alignSelf:
            sendButtonPosition === 'top-right' ? 'flex-start' : 'flex-end',
        }}
      >
        <Button variant="outlined" onClick={handleClick}>
          SEND
        </Button>
      </div>
    </div>
  );
};
