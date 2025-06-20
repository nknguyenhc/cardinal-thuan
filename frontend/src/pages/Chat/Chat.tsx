import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Fragment } from 'react';
import { useParams } from 'react-router';
import { useConversationsContext } from '../../hooks/ConversationsContext';
import './Chat.css';

export const Chat = () => {
  const { conversations } = useConversationsContext();
  const { title } = useParams<{ title: string }>();

  const conversation = conversations.find((c) => c.title === title);

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
      <TextField
        label="Ask a question"
        placeholder="Ask me a question"
        multiline
        maxRows={4}
        variant="standard"
      />
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
