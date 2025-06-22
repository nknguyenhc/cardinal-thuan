import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import { useConversationsContext } from '../../hooks/ConversationsContext';
import { useCallback, useEffect, useState } from 'react';
import './SideMenu.css';
import { useNavigate } from 'react-router';
import type { Conversation } from '../../hooks/localConversations';
import { getTitle } from '../../api/query';

export const SideMenu = () => {
  const { conversations } = useConversationsContext();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = useCallback(
    (id: string) => {
      setIsOpen(false);
      navigate(`/chat/${id}`);
    },
    [navigate]
  );

  const handleHomeClick = useCallback(() => {
    setIsOpen(false);
    navigate('/');
  }, [navigate]);

  return (
    <div className="side-menu">
      <Button>
        <MenuIcon onClick={() => setIsOpen(true)} />
      </Button>
      <Drawer anchor="left" open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <ListItemButton onClick={handleHomeClick}>Home</ListItemButton>
          <Typography variant="h6" padding={1}>
            Chats
          </Typography>
          <List>
            {conversations.map((conversation) => (
              <ListItem disablePadding key={conversation.id}>
                <SideMenuItem
                  key={conversation.id}
                  click={handleClick}
                  conversation={conversation}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
};

const SideMenuItem = ({
  conversation,
  click,
}: {
  conversation: Conversation;
  click: (id: string) => void;
}) => {
  const handleClick = useCallback(() => {
    click(conversation.id);
  }, [click, conversation.id]);

  const { setTitle } = useConversationsContext();

  const determineTitle = useCallback(async () => {
    if (conversation.messages.length === 0) {
      return;
    }
    const title = await getTitle(conversation.messages[0].content);
    setTitle(conversation.id, title);
  }, [conversation.messages]);

  useEffect(() => {
    if (typeof conversation.title === 'string') {
      return;
    }
    const timeout = setTimeout(() => determineTitle());
    return () => clearTimeout(timeout);
  }, []);

  return (
    <ListItemButton onClick={handleClick}>{conversation.title}</ListItemButton>
  );
};
