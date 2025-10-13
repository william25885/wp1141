import { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Container, AppBar, Toolbar, Typography, Box } from '@mui/material'
import type { Ingredient, SelectedIngredient, AppState } from './types'
import { loadIngredientsFromCSV } from './utils/csvParser'
import { calculateNutritionStats } from './utils/nutritionCalculator'
import BrowseView from './components/BrowseView'
import MenuView from './components/MenuView'
import SummaryView from './components/SummaryView'
import Navigation from './components/Navigation'

// 創建 Material UI 主題 - 參考原本 CSS 樣式
const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6', // 原本的藍色
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: '#10b981', // 原本的綠色
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#ef4444', // 原本的紅色
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: '#f9fafb', // 原本的背景色
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.25rem', // 原本的 2.25rem
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.875rem', // 原本的 1.875rem
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 400,
      fontSize: '1.125rem', // 原本的 1.125rem
    },
  },
  shape: {
    borderRadius: 12, // 原本的 12px
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12, // 原本的 0.75rem
          padding: '0.75rem 1.5rem', // 原本的 padding
          fontSize: '0.95rem', // 原本的 0.95rem
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: '0 8px 25px -5px rgba(59, 130, 246, 0.4), 0 4px 6px -1px rgba(59, 130, 246, 0.1)',
          '&:hover': {
            boxShadow: '0 8px 25px -5px rgba(59, 130, 246, 0.4), 0 4px 6px -1px rgba(59, 130, 246, 0.1)',
          },
        },
        outlined: {
          backgroundColor: '#f8fafc',
          color: '#64748b',
          borderColor: '#e2e8f0',
          '&:hover': {
            backgroundColor: '#f1f5f9',
            borderColor: '#cbd5e1',
            boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // 原本的 0.75rem
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #f3f4f6',
          transition: 'all 0.2s',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-0.25rem)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        },
        elevation3: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#ffffff',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3b82f6',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3b82f6',
              boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#3b82f6',
          '&.Mui-checked': {
            color: '#3b82f6',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: '#ef4444',
          color: 'white',
          fontSize: '0.75rem',
          height: '20px',
          minWidth: '20px',
          borderRadius: '9999px',
        },
      },
    },
  },
});

function App() {
  const [appState, setAppState] = useState<AppState>({
    ingredients: [],
    selectedIngredients: [],
    filters: {
      categories: [],
      dietTags: [],
      allergens: [],
      calorieRange: [0, 1000],
      priceRange: [0, 5]
    },
    currentView: 'browse'
  });

  // 載入食材資料
  useEffect(() => {
    const loadData = async () => {
      const ingredients = await loadIngredientsFromCSV();
      console.log('載入的食材資料:', ingredients);
      setAppState(prev => ({ ...prev, ingredients }));
    };
    loadData();
  }, []);

  // 更新篩選條件
  const updateFilters = (newFilters: Partial<AppState['filters']>) => {
    setAppState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters }
    }));
  };

  // 切換視圖
  const switchView = (view: AppState['currentView']) => {
    setAppState(prev => ({ ...prev, currentView: view }));
  };

  // 添加食材到菜單
  const addToMenu = (ingredient: Ingredient) => {
    setAppState(prev => {
      const existingIndex = prev.selectedIngredients.findIndex(
        item => item.ingredient.ingredient_id === ingredient.ingredient_id
      );
      
      if (existingIndex >= 0) {
        // 如果已存在，增加份量
        const updated = [...prev.selectedIngredients];
        updated[existingIndex].servingSize += ingredient.serving_size_g;
        return { ...prev, selectedIngredients: updated };
      } else {
        // 如果不存在，添加新項目
        return {
          ...prev,
          selectedIngredients: [
            ...prev.selectedIngredients,
            { ingredient, servingSize: ingredient.serving_size_g }
          ]
        };
      }
    });
  };

  // 更新食材份量
  const updateServingSize = (ingredientId: number, newSize: number) => {
    setAppState(prev => ({
      ...prev,
      selectedIngredients: prev.selectedIngredients.map(item =>
        item.ingredient.ingredient_id === ingredientId
          ? { ...item, servingSize: newSize }
          : item
      )
    }));
  };

  // 移除食材
  const removeFromMenu = (ingredientId: number) => {
    setAppState(prev => ({
      ...prev,
      selectedIngredients: prev.selectedIngredients.filter(
        item => item.ingredient.ingredient_id !== ingredientId
      )
    }));
  };

  // 清空菜單
  const clearMenu = () => {
    setAppState(prev => ({ ...prev, selectedIngredients: [] }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <AppBar 
          position="static" 
          sx={{ 
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
            borderRadius: '0 0 16px 16px',
            boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.3), 0 10px 10px -5px rgba(139, 92, 246, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
              pointerEvents: 'none',
            },
          }}
        >
          <Toolbar sx={{ 
            flexDirection: 'column', 
            py: 4, // 原本的 2rem
            px: 3, // 原本的 1.5rem
            position: 'relative',
            zIndex: 1,
          }}>
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                textAlign: 'center', 
                mb: 1.5, // 原本的 0.75rem
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                letterSpacing: '-0.025em',
                color: 'white',
              }}
            >
              🥗 健康餐飲配方規劃師
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: 'center', 
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 400,
              }}
            >
              根據您的需求規劃完美的健康餐點
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Navigation 
          currentView={appState.currentView}
          onViewChange={switchView}
          selectedCount={appState.selectedIngredients.length}
        />

        <Container maxWidth="xl" sx={{ py: 3 }}>
          {appState.currentView === 'browse' && (
            <BrowseView
              ingredients={appState.ingredients}
              filters={appState.filters}
              onFiltersChange={updateFilters}
              onAddToMenu={addToMenu}
            />
          )}
          
          {appState.currentView === 'menu' && (
            <MenuView
              selectedIngredients={appState.selectedIngredients}
              onUpdateServingSize={updateServingSize}
              onRemoveFromMenu={removeFromMenu}
              onClearMenu={clearMenu}
              onProceedToSummary={() => switchView('summary')}
            />
          )}
          
          {appState.currentView === 'summary' && (
            <SummaryView
              selectedIngredients={appState.selectedIngredients}
              onBackToMenu={() => switchView('menu')}
              onStartOver={() => {
                clearMenu();
                switchView('browse');
              }}
            />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
