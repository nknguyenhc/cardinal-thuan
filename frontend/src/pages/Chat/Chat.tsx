import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ReactMarkdown from 'react-markdown';
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router';
import { useConversationsContext } from '../../hooks/ConversationsContext';
import './Chat.css';
import { ChatInput } from '../../components/ChatInput/ChatInput';
import { query } from '../../api/query';

export const Chat = () => {
  const {
    conversations,
    getNewMessage,
    setConversation,
    addMessage,
    deleteChat,
    setIsLoading,
  } = useConversationsContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const conversation = useMemo(
    () => conversations.find((c) => c.id === id),
    [conversations, id]
  );
  const newMessage = useMemo(() => getNewMessage(), []);
  const [tempMessage, setTempMessage] = useState<string>('');
  const chatMessagesRef = useRef<HTMLUListElement>(null);

  const checkAndScrollToBottom = useCallback(() => {
    if (!chatMessagesRef.current) {
      return;
    }
    const el = chatMessagesRef.current;
    if (el) {
      const threshold = 150;
      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
      if (isNearBottom) {
        el.scrollTo({
          top: el.scrollHeight,
        });
      }
    }
  }, []);

  const handleFirstQuery = useCallback(async () => {
    if (!newMessage || !conversation) return;
    setIsLoading(true);
    const interval = setInterval(() => checkAndScrollToBottom(), 100);
    let fullMessage = '';
    for await (const chunk of query(newMessage)) {
      setTempMessage((prev) => prev + chunk);
      fullMessage += chunk;
    }
    const messages = [
      {
        role: 'user' as const,
        content: newMessage,
      },
      {
        role: 'assistant' as const,
        content: fullMessage,
      },
    ];
    setConversation(conversation.id, messages);
    setTempMessage('');
    clearInterval(interval);
    setIsLoading(false);
  }, [newMessage, conversation, setConversation, checkAndScrollToBottom]);

  const handleQuery = useCallback(
    async (input: string) => {
      if (!input.trim() || !conversation) return;
      const interval = setInterval(() => checkAndScrollToBottom(), 100);
      const newMessage = {
        role: 'user' as const,
        content: input,
      };
      addMessage(conversation.id, newMessage);
      let fullMessage = '';
      for await (const chunk of query(input)) {
        setTempMessage((prev) => prev + chunk);
        fullMessage += chunk;
      }
      const assistantMessage = {
        role: 'assistant' as const,
        content: fullMessage,
      };
      addMessage(conversation.id, assistantMessage);
      setTempMessage('');
      clearInterval(interval);
    },
    [conversation, addMessage, checkAndScrollToBottom]
  );

  useEffect(() => {
    const timeout = setTimeout(() => handleFirstQuery());
    return () => clearTimeout(timeout);
  }, []);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteChat = useCallback(() => {
    if (!conversation) return;
    deleteChat(conversation.id);
    navigate('/');
  }, [conversation, deleteChat, navigate]);

  if (!conversation) {
    return (
      <div className="chat-not-found">
        <Typography variant="h6">Conversation not found</Typography>
      </div>
    );
  }

  return (
    <div className="chat">
      <div className="chat-menu">
        <div onClick={handleClick}>
          <LinearScaleIcon className="chat-menu-button" />
        </div>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleDeleteChat}>Delete Chat</MenuItem>
        </Menu>
      </div>
      <List className="chat-messages" ref={chatMessagesRef}>
        {conversation.messages.map((message, index) => (
          <Fragment key={index}>
            <ListItem className="chat-message-item">
              {message.role === 'user' ? (
                <UserMessage content={message.content} />
              ) : (
                <AssistantMessage content={message.content} />
              )}
            </ListItem>
            <Divider className="chat-message-item" />
          </Fragment>
        ))}
        {tempMessage && (
          <ListItem className="chat-message-item">
            <AssistantMessage content={tempMessage} />
          </ListItem>
        )}
      </List>
      <div className="chat-bottom">
        <ChatInput sendButtonPosition="bottom-right" onSend={handleQuery} />
      </div>
    </div>
  );
};

const AssistantMessage = ({ content }: { content: string }) => (
  <div>
    <ReactMarkdown>{content}</ReactMarkdown>
  </div>
);

const UserMessage = ({ content }: { content: string }) => (
  <div className="chat-user-message-container">
    <div className="chat-user-message">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  </div>
);
