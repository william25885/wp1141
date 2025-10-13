import { Button, Paper, Badge, Box } from '@mui/material';
import type { AppState } from '../types';

interface NavigationProps {
  currentView: AppState['currentView'];
  onViewChange: (view: AppState['currentView']) => void;
  selectedCount: number;
}

export default function Navigation({ currentView, onViewChange, selectedCount }: NavigationProps) {
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        borderRadius: 0, 
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: 'background.paper',
        maxWidth: 1200,
        mx: 'auto',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        p: 2, // 原本的 1rem
        gap: 2, // 原本的 1rem
      }}>
        <Button
          variant={currentView === 'browse' ? 'contained' : 'outlined'}
          onClick={() => onViewChange('browse')}
          sx={{
            px: 3, // 原本的 1.5rem
            py: 1.5, // 原本的 0.75rem
            borderRadius: 3, // 原本的 0.75rem
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.95rem', // 原本的 0.95rem
            display: 'flex',
            alignItems: 'center',
            gap: 0.5, // 原本的 0.5rem
            border: '2px solid transparent',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: currentView === 'browse' ? '0 8px 25px -5px rgba(59, 130, 246, 0.4), 0 4px 6px -1px rgba(59, 130, 246, 0.1)' : 0,
            transform: currentView === 'browse' ? 'translateY(-1px)' : 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: currentView === 'browse' 
                ? '0 8px 25px -5px rgba(59, 130, 246, 0.4), 0 4px 6px -1px rgba(59, 130, 246, 0.1)'
                : '0 4px 12px -2px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          🔍 瀏覽食材
        </Button>
        
        <Badge 
          badgeContent={selectedCount} 
          color="error" 
          invisible={selectedCount === 0}
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#ef4444',
              color: 'white',
              fontSize: '0.75rem',
              height: '20px',
              minWidth: '20px',
              borderRadius: '9999px',
            },
          }}
        >
          <Button
            variant={currentView === 'menu' ? 'contained' : 'outlined'}
            onClick={() => onViewChange('menu')}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              border: '2px solid transparent',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: currentView === 'menu' ? '0 8px 25px -5px rgba(59, 130, 246, 0.4), 0 4px 6px -1px rgba(59, 130, 246, 0.1)' : 0,
              transform: currentView === 'menu' ? 'translateY(-1px)' : 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: currentView === 'menu' 
                  ? '0 8px 25px -5px rgba(59, 130, 246, 0.4), 0 4px 6px -1px rgba(59, 130, 246, 0.1)'
                  : '0 4px 12px -2px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            🛒 我的菜單
          </Button>
        </Badge>
        
        <Button
          variant={currentView === 'summary' ? 'contained' : 'outlined'}
          onClick={() => onViewChange('summary')}
          disabled={selectedCount === 0}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            border: '2px solid transparent',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: currentView === 'summary' ? '0 8px 25px -5px rgba(59, 130, 246, 0.4), 0 4px 6px -1px rgba(59, 130, 246, 0.1)' : 0,
            transform: currentView === 'summary' ? 'translateY(-1px)' : 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: selectedCount === 0 ? 0.5 : 1,
            cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
            '&:hover': {
              transform: selectedCount > 0 ? 'translateY(-1px)' : 'none',
              boxShadow: selectedCount > 0 
                ? (currentView === 'summary' 
                  ? '0 8px 25px -5px rgba(59, 130, 246, 0.4), 0 4px 6px -1px rgba(59, 130, 246, 0.1)'
                  : '0 4px 12px -2px rgba(0, 0, 0, 0.1)')
                : 0,
            },
          }}
        >
          📊 營養摘要
        </Button>
      </Box>
    </Paper>
  );
}
