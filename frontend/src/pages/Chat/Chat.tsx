import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Fragment, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { useConversationsContext } from '../../hooks/ConversationsContext';
import './Chat.css';
import { ChatInput } from '../../components/ChatInput/ChatInput';
import { query } from '../../api/query';

export const Chat = () => {
  const { conversations, getNewMessage, setConversation } =
    useConversationsContext();
  const { id } = useParams<{ id: string }>();

  const conversation = useMemo(
    () => conversations.find((c) => c.id === id),
    [conversations, id]
  );
  const newMessage = useMemo(() => getNewMessage(), []);

  const handleQuery = useCallback(
    async (input: string) => {
      if (!conversation) return;
      const answer = await query(input);
      if (answer !== null) {
        const messages = [
          {
            role: 'user' as const,
            content: input,
          },
          {
            role: 'assistant' as const,
            content: answer,
          },
        ];
        setConversation(conversation.id, messages);
      }
    },
    [conversation, setConversation]
  );

  useEffect(() => {
    if (!newMessage || !conversation) return;
    handleQuery(newMessage);
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
      <List>
        {conversation.messages.map((message, index) => (
          <Fragment key={index}>
            <ListItem>
              {message.role === 'user' ? (
                <UserMessage content={message.content} />
              ) : (
                message.content
              )}
            </ListItem>
            <Divider />
          </Fragment>
        ))}
      </List>
      <ChatInput sendButtonPosition="bottom-right" onSend={() => {}} />
    </div>
  );
};

const UserMessage = ({ content }: { content: string }) => (
  <div className="chat-user-message-container">
    <div className="chat-user-message">
      <Typography variant="body1">{content}</Typography>
    </div>
  </div>
);
