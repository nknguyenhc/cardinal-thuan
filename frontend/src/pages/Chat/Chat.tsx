import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ReactMarkdown from 'react-markdown';
import { Fragment, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { useConversationsContext } from '../../hooks/ConversationsContext';
import './Chat.css';
import { ChatInput } from '../../components/ChatInput/ChatInput';
import { query } from '../../api/query';

export const Chat = () => {
  const { conversations, getNewMessage, setConversation, addMessage } =
    useConversationsContext();
  const { id } = useParams<{ id: string }>();

  const conversation = useMemo(
    () => conversations.find((c) => c.id === id),
    [conversations, id]
  );
  const newMessage = useMemo(() => getNewMessage(), []);

  const handleFirstQuery = useCallback(async () => {
    if (!newMessage || !conversation) return;
    const answer = await query(newMessage);
    if (answer !== null) {
      const messages = [
        {
          role: 'user' as const,
          content: newMessage,
        },
        {
          role: 'assistant' as const,
          content: answer,
        },
      ];
      setConversation(conversation.id, messages);
    }
  }, [newMessage, conversation, setConversation]);

  const handleQuery = useCallback(
    async (input: string) => {
      if (!input.trim() || !conversation) return;
      const newMessage = {
        role: 'user' as const,
        content: input,
      };
      addMessage(conversation.id, newMessage);
      const answer = await query(input);
      if (answer !== null) {
        const assistantMessage = {
          role: 'assistant' as const,
          content: answer,
        };
        addMessage(conversation.id, assistantMessage);
      }
    },
    [conversation, addMessage]
  );

  useEffect(() => {
    const timeout = setTimeout(() => handleFirstQuery());
    return () => clearTimeout(timeout);
  }, []);

  if (!conversation) {
    return (
      <div className="chat-not-found">
        <Typography variant="h6">Conversation not found</Typography>
      </div>
    );
  }

  return (
    <div className="chat">
      <List className="chat-messages">
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
