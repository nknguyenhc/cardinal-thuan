import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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
import { getTitle, query } from '../../api/query';
import { useSnackbarContext } from '../../hooks/SnackbarContext';

export const Chat = () => {
  const {
    conversations,
    getNewMessage,
    setConversation,
    addMessage,
    deleteChat,
    setIsLoading,
    setTitle,
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
  const [isAwaitingFirstChunk, setIsAwaitingFirstChunk] = useState(false);
  const [isFetchError, setIsFetchError] = useState(false);

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
    setIsAwaitingFirstChunk(true);
    setIsFetchError(false);
    const interval = setInterval(() => checkAndScrollToBottom(), 100);
    let fullMessage = '';
    try {
      for await (const chunk of query(newMessage)) {
        setIsAwaitingFirstChunk(false);
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
    } catch (error) {
      console.error('Error during query:', error);
      setIsFetchError(true);
      setIsAwaitingFirstChunk(false);
    }
    setTempMessage('');
    clearInterval(interval);
    setIsLoading(false);
  }, [newMessage, conversation, setConversation, checkAndScrollToBottom]);

  const determineTitle = useCallback(async () => {
    if (
      !conversation ||
      conversation.messages.length === 0 ||
      conversation.title
    ) {
      return;
    }
    const title = await getTitle(conversation.messages[0].content);
    setTitle(conversation.id, title);
  }, [conversation, setTitle]);

  const handleQuery = useCallback(
    async (input: string) => {
      if (!input.trim() || !conversation) return;
      setIsLoading(true);
      setIsAwaitingFirstChunk(true);
      setIsFetchError(false);
      const interval = setInterval(() => checkAndScrollToBottom(), 100);
      const newMessage = {
        role: 'user' as const,
        content: input,
      };
      addMessage(conversation.id, newMessage);
      let fullMessage = '';
      try {
        for await (const chunk of query(input)) {
          setIsAwaitingFirstChunk(false);
          setTempMessage((prev) => prev + chunk);
          fullMessage += chunk;
        }
        const assistantMessage = {
          role: 'assistant' as const,
          content: fullMessage,
        };
        addMessage(conversation.id, assistantMessage);
      } catch (error) {
        console.error('Error during query:', error);
        setIsFetchError(true);
        setIsAwaitingFirstChunk(false);
      }
      setTempMessage('');
      clearInterval(interval);
      setIsLoading(false);
    },
    [conversation, addMessage, checkAndScrollToBottom]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleFirstQuery();
      determineTitle();
    });
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
        {isAwaitingFirstChunk && (
          <Skeleton
            className="chat-message-item"
            height={80}
            animation="wave"
          />
        )}
        {tempMessage && (
          <ListItem className="chat-message-item">
            <AssistantMessage content={tempMessage} />
          </ListItem>
        )}
        {isFetchError && (
          <ListItem className="chat-message-item">
            <Alert severity="error">Failed to generate response</Alert>
          </ListItem>
        )}
      </List>
      <div className="chat-bottom">
        <ChatInput sendButtonPosition="bottom-right" onSend={handleQuery} />
      </div>
    </div>
  );
};

const AssistantMessage = ({ content }: { content: string }) => {
  const { success } = useSnackbarContext();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content);
    success('Content copied to clipboard');
  }, [content]);

  return (
    <div className="chat-assistant-message">
      <ReactMarkdown>{content}</ReactMarkdown>
      <div className="chat-assistant-message-tools">
        <ContentCopyIcon
          className="chat-assistant-message-tool"
          onClick={handleCopy}
        />
      </div>
    </div>
  );
};

const UserMessage = ({ content }: { content: string }) => (
  <div className="chat-user-message-container">
    <div className="chat-user-message">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  </div>
);
