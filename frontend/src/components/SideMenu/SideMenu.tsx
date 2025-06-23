import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { useConversationsContext } from '../../hooks/ConversationsContext';
import { useCallback, useState } from 'react';
import './SideMenu.css';
import { useNavigate } from 'react-router';
import type { Conversation } from '../../hooks/localConversations';

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

  return (
    <ListItemButton onClick={handleClick}>
      {!conversation.title && (
        <Skeleton height={40} animation="wave" width="100%" />
      )}
      {conversation.title}
    </ListItemButton>
  );
};
