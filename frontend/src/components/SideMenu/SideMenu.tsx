import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import { useConversationsContext } from '../../hooks/ConversationsContext';
import { useState } from 'react';
import './SideMenu.css';
import { Box, List, ListItem, ListItemButton, Typography } from '@mui/material';

export const SideMenu = () => {
  const { conversations } = useConversationsContext();
  const [isOpen, setIsOpen] = useState(false);

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
                <ListItemButton>{conversation.title}</ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
};
