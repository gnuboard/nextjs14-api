// src/components/Header.js

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
  const { isLogin, memberInfo, logout } = useAuth();

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
    { text: '리스트', href: '/list' },
    { text: '회사소개', href: '/about' },
    { text: '제품소개', href: '/products' },
    // { text: '쇼핑몰', href: '/shop' },
    { text: '구입하기', href: '/buy' },
    { text: 'FAQ', href: '/faq' },
    { text: '연락처', href: '/contact' },
  ];

  const productSubmenuItems = [
    { text: '제품1', href: '/products/item/1' },
    { text: '제품2', href: '/products/item/2' },
    { text: '제품3', href: '/products/item/3' },
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
              item.text === '제품소개' ? (
                <Box key={index} onMouseEnter={handleMenuOpen} onMouseLeave={handleMenuClose} sx={{ position: 'relative' }}>
                  <ListItem button component={Link} href={item.href}>
                    <ListItemText primary={item.text} sx={{ whiteSpace: 'nowrap' }} />
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
                  <ListItemText primary={item.text} sx={{ whiteSpace: 'nowrap' }} />
                </ListItem>
              )
            ))}
          </List>

          {isLogin ? (
            <>
              <Tooltip title={`${memberInfo?.mb_nick || '사용자'}님 로그인중`}>
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
            item.text === '제품소개' ? (
              <div key={item.text}>
                <ListItem button onClick={handleDrawerSubMenuToggle}>
                  <ListItemText primary={item.text} />
                  {openDrawerSubMenu ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openDrawerSubMenu} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {productSubmenuItems.map((subItem) => (
                      <ListItem button component={Link} href={subItem.href} key={subItem.text} sx={{ pl: 4 }} onClick={toggleSideMenu}>
                        <ListItemText primary={subItem.text} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </div>
            ) : (
              <ListItem key={item.text} button component={Link} href={item.href} onClick={toggleSideMenu}>
                <ListItemText primary={item.text} sx={{ whiteSpace: 'nowrap' }} />
              </ListItem>
            )
          ))}
          {!isLogin ? (
            <ListItem button component={Link} href="/login" onClick={toggleSideMenu}>
              <ListItemText primary="Login" />
            </ListItem>
          ) : (
            <ListItem button onClick={handleLogout}>
              <ListItemText primary={`${memberInfo?.mb_nick || '사용자'}님 (로그아웃)`} />
            </ListItem>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Header;
