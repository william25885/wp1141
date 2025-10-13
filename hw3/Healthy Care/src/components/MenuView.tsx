import { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Box, 
  Grid, 
  TextField, 
  IconButton, 
  Chip,
  Alert,
  AlertTitle,
  Paper,
  Divider
} from '@mui/material';
import { Delete, ShoppingCart } from '@mui/icons-material';
import type { SelectedIngredient, NutritionStats } from '../types';
import { calculateNutritionStats, getNutritionAdvice } from '../utils/nutritionCalculator';
import NutritionChart from './NutritionChart';

// 份量輸入組件
function ServingSizeInput({ 
  servingSize, 
  onUpdateServingSize, 
  ingredientId 
}: { 
  servingSize: number; 
  onUpdateServingSize: (id: number, size: number) => void; 
  ingredientId: number;
}) {
  const [inputValue, setInputValue] = useState(servingSize.toString());
  const [isFocused, setIsFocused] = useState(false);

  // 當外部 servingSize 改變時，更新本地狀態
  useEffect(() => {
    if (!isFocused) {
      setInputValue(servingSize.toString());
    }
  }, [servingSize, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // 如果輸入有效數字，立即更新
    if (value !== '' && !isNaN(Number(value)) && Number(value) >= 0) {
      onUpdateServingSize(ingredientId, Number(value));
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // 如果值為0，清空輸入框
    if (servingSize === 0) {
      setInputValue('');
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // 失去焦點時，如果為空則設為0
    if (inputValue === '') {
      setInputValue('0');
      onUpdateServingSize(ingredientId, 0);
    }
  };

  return (
    <TextField
      type="number"
      value={inputValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      size="small"
      sx={{ 
        width: 80,
        '& .MuiInputBase-input': {
          textAlign: 'center',
          fontSize: '0.875rem',
        }
      }}
      inputProps={{ min: 0, step: 1 }}
    />
  );
}

interface MenuViewProps {
  selectedIngredients: SelectedIngredient[];
  onUpdateServingSize: (ingredientId: number, newSize: number) => void;
  onRemoveFromMenu: (ingredientId: number) => void;
  onClearMenu: () => void;
  onProceedToSummary: () => void;
}

export default function MenuView({ 
  selectedIngredients, 
  onUpdateServingSize, 
  onRemoveFromMenu, 
  onClearMenu,
  onProceedToSummary 
}: MenuViewProps) {
  const nutritionStats = calculateNutritionStats(selectedIngredients);
  const nutritionAdvice = getNutritionAdvice(nutritionStats);

  if (selectedIngredients.length === 0) {
    return (
      <Box>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            🛒 我的菜單
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            您的菜單還是空的
          </Typography>
          <Typography variant="body1" color="text.secondary">
            請前往「瀏覽食材」頁面選擇您喜歡的食材
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          🛒 我的菜單
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={onClearMenu}
            sx={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              '&:hover': {
                backgroundColor: '#dc2626',
                border: 'none',
              },
            }}
          >
            🗑️ 清空菜單
          </Button>
          <Button
            variant="contained"
            onClick={onProceedToSummary}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px -5px rgba(59, 130, 246, 0.4)',
              },
            }}
          >
            📊 查看營養摘要
          </Button>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' },
        gap: 3,
        alignItems: 'flex-start'
      }}>
        <Box sx={{ 
          flex: { xs: '1', lg: '1' },
          width: { xs: '100%', lg: 'auto' },
          minWidth: 0
        }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            已選食材 ({selectedIngredients.length} 項)
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {selectedIngredients.map(({ ingredient, servingSize }) => (
              <Card key={ingredient.ingredient_id} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {ingredient.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Chip 
                        label={ingredient.category} 
                        size="small" 
                        sx={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {(() => {
                          const calories = Math.round(ingredient.calories_per_100g * servingSize / 100);
                          const formatted = calories.toString();
                          return formatted.length > 5 ? formatted.slice(0, 5) + '...' : formatted;
                        })()} kcal
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        份量 (g):
                      </Typography>
                      <ServingSizeInput
                        servingSize={servingSize}
                        onUpdateServingSize={onUpdateServingSize}
                        ingredientId={ingredient.ingredient_id}
                      />
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      color="success.main" 
                      sx={{ 
                        minWidth: 80, 
                        maxWidth: 120,
                        textAlign: 'right',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '0.875rem'
                      }}
                    >
                      ${(() => {
                        const cost = (ingredient.cost_per_100g_usd * servingSize / 100).toFixed(2);
                        return cost.length > 5 ? cost.slice(0, 5) + '...' : cost;
                      })()}
                    </Typography>
                    
                    <IconButton 
                      color="error"
                      onClick={() => onRemoveFromMenu(ingredient.ingredient_id)}
                      sx={{ flexShrink: 0 }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
          
          {nutritionAdvice.length > 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <AlertTitle>營養建議</AlertTitle>
              {nutritionAdvice.map((advice, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                  💡 {advice}
                </Typography>
              ))}
            </Alert>
          )}
        </Box>

        <Box sx={{ 
          flex: { xs: '1', lg: '1' },
          width: { xs: '100%', lg: 'auto' },
          minWidth: 0
        }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              營養統計
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  backgroundColor: '#f9fafb', 
                  height: 100,
                  width: 140,
                  minWidth: 140,
                  maxWidth: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxSizing: 'border-box'
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.75rem' }}>
                    總卡路里
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem',
                      height: '1.5em',
                      lineHeight: '1.5em'
                    }}
                  >
                    {(() => {
                      const calories = nutritionStats.totalCalories.toString();
                      return calories.length > 5 ? calories.slice(0, 5) + '...' : calories;
                    })()} kcal
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  backgroundColor: '#f9fafb', 
                  height: 100,
                  width: 140,
                  minWidth: 140,
                  maxWidth: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxSizing: 'border-box'
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.75rem' }}>
                    總花費
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem',
                      height: '1.5em',
                      lineHeight: '1.5em'
                    }}
                  >
                    ${(() => {
                      const cost = nutritionStats.totalCost.toFixed(2);
                      return cost.length > 5 ? cost.slice(0, 5) + '...' : cost;
                    })()}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  backgroundColor: '#f9fafb', 
                  height: 100,
                  width: 140,
                  minWidth: 140,
                  maxWidth: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxSizing: 'border-box'
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.75rem' }}>
                    蛋白質
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem',
                      height: '1.5em',
                      lineHeight: '1.5em'
                    }}
                  >
                    {(() => {
                      const protein = nutritionStats.totalProtein.toFixed(1);
                      return protein.length > 5 ? protein.slice(0, 5) + '...' : protein;
                    })()}g
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  backgroundColor: '#f9fafb', 
                  height: 100,
                  width: 140,
                  minWidth: 140,
                  maxWidth: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxSizing: 'border-box'
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.75rem' }}>
                    脂肪
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem',
                      height: '1.5em',
                      lineHeight: '1.5em'
                    }}
                  >
                    {(() => {
                      const fat = nutritionStats.totalFat.toFixed(1);
                      return fat.length > 5 ? fat.slice(0, 5) + '...' : fat;
                    })()}g
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  backgroundColor: '#f9fafb', 
                  height: 100,
                  width: 140,
                  minWidth: 140,
                  maxWidth: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxSizing: 'border-box'
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.75rem' }}>
                    碳水化合物
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem',
                      height: '1.5em',
                      lineHeight: '1.5em'
                    }}
                  >
                    {(() => {
                      const carbs = nutritionStats.totalCarbs.toFixed(1);
                      return carbs.length > 5 ? carbs.slice(0, 5) + '...' : carbs;
                    })()}g
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  backgroundColor: '#f9fafb', 
                  height: 100,
                  width: 140,
                  minWidth: 140,
                  maxWidth: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxSizing: 'border-box'
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.75rem' }}>
                    纖維
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem',
                      height: '1.5em',
                      lineHeight: '1.5em'
                    }}
                  >
                    {(() => {
                      const fiber = nutritionStats.totalFiber.toFixed(1);
                      return fiber.length > 5 ? fiber.slice(0, 5) + '...' : fiber;
                    })()}g
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                巨量營養素分佈
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <NutritionChart 
                  proteinPercentage={nutritionStats.proteinPercentage}
                  fatPercentage={nutritionStats.fatPercentage}
                  carbsPercentage={nutritionStats.carbsPercentage}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#4CAF50' }} />
                    <Typography variant="body2">
                      蛋白質 {nutritionStats.proteinPercentage.toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FF9800' }} />
                    <Typography variant="body2">
                      脂肪 {nutritionStats.fatPercentage.toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#2196F3' }} />
                    <Typography variant="body2">
                      碳水化合物 {nutritionStats.carbsPercentage.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
