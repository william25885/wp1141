import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Home as HomeIcon,
  Favorite as FavoriteIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%'
    }}>
      {/* 頂部導航欄 */}
      <AppBar position="static" sx={{ 
        backgroundColor: 'primary.main',
        width: '100%',
        maxWidth: '100%'
      }}>
        <Toolbar sx={{ width: '100%', maxWidth: '100%' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            ☕ 咖啡廳搜尋
          </Typography>

          {/* 導航按鈕 */}
          <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={() => handleNavigation('/')}
              sx={{
                backgroundColor: isActive('/') ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              首頁
            </Button>
            <Button
              color="inherit"
              startIcon={<FavoriteIcon />}
              onClick={() => handleNavigation('/favorites')}
              sx={{
                backgroundColor: isActive('/favorites') ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              我的收藏
            </Button>
          </Box>

          {/* 使用者選單 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.name}
            </Typography>
            <IconButton
              size="large"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                登出
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 主要內容區域 */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          py: 3,
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '100%' }}>
          <Outlet />
        </Box>
      </Box>

      {/* 底部 */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto',
          backgroundColor: 'grey.100',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2024 咖啡廳搜尋應用 - 找到你最愛的咖啡廳
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
