import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import { useConversationsContext } from '../../hooks/ConversationsContext';
import { useState } from 'react';
import './SideMenu.css';
import { useNavigate } from 'react-router';

export const SideMenu = () => {
  const { conversations } = useConversationsContext();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (title: string) => {
    setIsOpen(false);
    navigate(`/chat/${title}`);
  };

  return (
    <div className="side-menu">
      <Button>
        <MenuIcon onClick={() => setIsOpen(true)} />
      </Button>
      <Drawer anchor="left" open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <Typography variant="h6" padding={1}>
            Chats
          </Typography>
          <List>
            {conversations.map((conversation) => (
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleClick(conversation.title)}>
                  {conversation.title}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
};
