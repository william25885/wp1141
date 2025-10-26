import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Coffee as CoffeeIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import type { LoginRequest } from '../types';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const from = (location.state as any)?.from?.pathname || '/';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // 清除錯誤訊息
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('請填寫所有欄位');
      return;
    }

    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (error: any) {
      setError(error.response?.data?.message || '登入失敗，請檢查您的帳號密碼');
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth="sm"
      sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 4 }
      }}
    >
      <Box
        sx={{
          marginTop: { xs: 4, sm: 6, md: 8 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: { xs: 'calc(100vh - 120px)', sm: 'calc(100vh - 160px)' }
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: { xs: 2, sm: 3 },
          }}
        >
          {/* Logo 和標題 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: { xs: 2, sm: 3 },
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            <CoffeeIcon sx={{ 
              fontSize: { xs: 35, sm: 40 }, 
              color: 'primary.main', 
              mr: { xs: 0, sm: 1 },
              mb: { xs: 1, sm: 0 }
            }} />
            <Typography 
              component="h1" 
              variant="h4" 
              color="primary"
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem' },
                fontWeight: 600
              }}
            >
              咖啡廳搜尋
            </Typography>
          </Box>
          
          <Typography 
            component="h2" 
            variant="h5" 
            sx={{ 
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
            }}
          >
            登入您的帳號
          </Typography>

          {/* 錯誤訊息 */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* 登入表單 */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="電子郵件"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密碼"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                '登入'
              )}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
                sx={{ textDecoration: 'none' }}
              >
                還沒有帳號？立即註冊
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
