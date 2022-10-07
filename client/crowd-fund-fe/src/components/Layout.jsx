import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import SavingsIcon from '@mui/icons-material/Savings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Header from './Header';
import UserTab from './UserTab';
import Deployer from './Deployer';
import { useState } from 'react';

const drawerWidth = 240;

export default function Layout() {
    const[selectedTab, setSelectedTab] = useState("Funder");

const handleSelect = (event) => {
    setSelectedTab(event.currentTarget.id)
} 

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
        <Header/>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['Funder', 'Deployer'].map((text, index) => (
              <ListItem id={text} key={text} disablePadding onClick={handleSelect}>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <SavingsIcon /> : <AccountCircleIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {selectedTab === 'Funder' ? <UserTab/> : <Deployer/>}
        
      </Box>
    </Box>
  );
}
