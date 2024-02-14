import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function NavBar() {
  const [anchorEl, setAnchorEl] = useState({ home: null, about: null, contact: null });

  const handleMenuOpen = (menu) => (event) => {
    
    setAnchorEl({ ...anchorEl, [menu]: event.currentTarget });
  };

  const handleClose = (menu) => () => {
    setAnchorEl({ ...anchorEl, [menu]: null });
  };

  const menuItems = {
    home: ["Home Option 1", "Home Option 2"],
    about: ["About Option 1", "About Option 2"],
    contact: ["Contact Option 1", "Contact Option 2"],
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="open drawer" sx={{ mr: 2 }}>
          <MenuIcon /> {/* Logo */}
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Logo
        </Typography>
        <Box sx={{ display: 'flex', gap: '20px' }}>
          {Object.keys(menuItems).map((menu) => (
            <div key={menu}>
              <Button color="inherit" onMouseOver={handleMenuOpen(menu)}>
                {menu.charAt(0).toUpperCase() + menu.slice(1)}
              </Button>
              <Menu
                id={`${menu}-menu`}
                anchorEl={anchorEl[menu]}
                open={Boolean(anchorEl[menu])}
                onClose={handleClose(menu)}
                MenuListProps={{ onMouseLeave: handleClose(menu) }} 
                onMouseLeave = {handleClose(menu)}
                >
                {menuItems[menu].map((option, index) => (
                  <MenuItem key={index} onClick={handleClose(menu)}>{option}</MenuItem>
                ))}
              </Menu>
            </div>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
