import { ChatInput } from '../../components/ChatInput/ChatInput';
import './Home.css';
import Typography from '@mui/material/Typography';
import { useConversationsContext } from '../../hooks/ConversationsContext';
import { useNavigate } from 'react-router';

export const Home = () => {
  const { addConversation } = useConversationsContext();
  const navigate = useNavigate();

  const handleSend = (message: string) => {
    const title = addConversation(message);
    navigate(`/chat/${title}`);
  };

  return (
    <div className="home">
      <Typography variant="h4" className="home-title">
        I am cardinal Francis Xavier Nguyen Van Thuan. Ask me any question!
      </Typography>
      <ChatInput sendButtonPosition="top-right" onSend={handleSend} />
    </div>
  );
};
