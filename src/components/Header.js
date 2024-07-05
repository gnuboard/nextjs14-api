"use client";

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Tooltip, Box, Popper, Paper, ClickAwayListener, Collapse, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

const Header = ({ backgroundColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [openDrawerSubMenu, setOpenDrawerSubMenu] = useState(false);
  const { accessToken, username, logout } = useAuth();

  const toggleSideMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    // TODO: 로그아웃 후 추가 작업 (예: 홈페이지로 리다이렉트)
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenSubMenu(true);
  };

  const handleMenuClose = () => {
    setOpenSubMenu(false);
  };

  const handleDrawerSubMenuToggle = () => {
    setOpenDrawerSubMenu(!openDrawerSubMenu);
  };

  const menuItems = [
    { text: 'About', href: '/about' },
    { text: 'Products', href: '/products' },
    { text: 'Shop', href: '/shop' },
    { text: 'FAQ', href: '/faq' },
    { text: 'Contact', href: '/contact' },
  ];

  const productSubmenuItems = [
    { text: 'Item1', href: '/products/item/1' },
    { text: 'Item2', href: '/products/item/2' },
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor, maxWidth: '100%', width: '100%', margin: '0 auto' }}>
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ maxWidth: 1200, margin: '0 auto' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" passHref legacyBehavior>
              <Typography variant="h6" component="a" sx={{ color: 'white', textDecoration: 'none' }}>
                Logo
              </Typography>
            </Link>
          </Typography>

          <List sx={{ display: { xs: 'none', sm: 'flex' }, position: 'relative' }}>
            {menuItems.map((item, index) => (
              item.text === 'Products' ? (
                <Box key={index} onMouseEnter={handleMenuOpen} onMouseLeave={handleMenuClose} sx={{ position: 'relative' }}>
                  <ListItem button>
                    <ListItemText primary={item.text} />
                  </ListItem>
                  <Popper
                    open={openSubMenu}
                    anchorEl={anchorEl}
                    placement="bottom-start"
                    disablePortal={false}
                    modifiers={[
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 0],
                        },
                      },
                    ]}
                  >
                    <ClickAwayListener onClickAway={handleMenuClose}>
                      <Paper sx={{ width: 120 }}>
                        <List>
                          {productSubmenuItems.map((subItem) => (
                            <ListItem button component={Link} href={subItem.href} key={subItem.text}>
                              <ListItemText primary={subItem.text} />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </ClickAwayListener>
                  </Popper>
                </Box>
              ) : (
                <ListItem key={item.text} button component={Link} href={item.href}>
                  <ListItemText primary={item.text} />
                </ListItem>
              )
            ))}
          </List>

          {accessToken ? (
            <>
              <Tooltip title="로그아웃">
                <IconButton color="inherit" onClick={handleLogout}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="로그인">
              <IconButton color="inherit" component={Link} href="/login">
                <PersonIcon />
              </IconButton>
            </Tooltip>
          )}

          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleSideMenu}
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Grid>
      </Toolbar>

      <Drawer anchor="right" open={isOpen} onClose={toggleSideMenu}>
        <List sx={{ width: 250 }}>
          {menuItems.map((item) => (
            item.text === 'Products' ? (
              <div key={item.text}>
                <ListItem button onClick={handleDrawerSubMenuToggle}>
                  <ListItemText primary={item.text} />
                  {openDrawerSubMenu ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openDrawerSubMenu} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {productSubmenuItems.map((subItem) => (
                      <ListItem button component={Link} href={subItem.href} key={subItem.text} sx={{ pl: 4 }}>
                        <ListItemText primary={subItem.text} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </div>
            ) : (
              <ListItem key={item.text} button component={Link} href={item.href} onClick={toggleSideMenu}>
                <ListItemText primary={item.text} />
              </ListItem>
            )
          ))}
          {!accessToken && (
            <ListItem button component={Link} href="/login" onClick={toggleSideMenu}>
              <ListItemText primary="Login" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Header;
