import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Box, 
  Grid, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import { 
  LocalFireDepartment, 
  AttachMoney, 
  Restaurant, 
  Favorite, 
  Grain, 
  Park 
} from '@mui/icons-material';
import type { SelectedIngredient, NutritionStats } from '../types';
import { calculateNutritionStats } from '../utils/nutritionCalculator';
import NutritionChart from './NutritionChart';

interface SummaryViewProps {
  selectedIngredients: SelectedIngredient[];
  onBackToMenu: () => void;
  onStartOver: () => void;
}

export default function SummaryView({ 
  selectedIngredients, 
  onBackToMenu, 
  onStartOver 
}: SummaryViewProps) {
  const nutritionStats = calculateNutritionStats(selectedIngredients);

  const exportToCSV = () => {
    const csvContent = [
      ['食材名稱', '份量(g)', '卡路里', '蛋白質(g)', '脂肪(g)', '碳水化合物(g)', '成本(USD)'],
      ...selectedIngredients.map(({ ingredient, servingSize }) => [
        ingredient.name,
        servingSize.toString(),
        Math.round(ingredient.calories_per_100g * servingSize / 100).toString(),
        (ingredient.protein_g * servingSize / 100).toFixed(1),
        (ingredient.fat_g * servingSize / 100).toFixed(1),
        (ingredient.carbs_g * servingSize / 100).toFixed(1),
        (ingredient.cost_per_100g_usd * servingSize / 100).toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', '健康餐點規劃.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // 簡單的 PDF 匯出功能（實際應用中可以使用 jsPDF 等庫）
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = `
        <html>
          <head>
            <title>健康餐點規劃</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #2c3e50; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .summary { background-color: #f8f9fa; padding: 15px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <h1>🥗 健康餐點規劃摘要</h1>
            
            <div class="summary">
              <h2>營養統計</h2>
              <p><strong>總卡路里：</strong>${nutritionStats.totalCalories} kcal</p>
              <p><strong>總花費：</strong>$${nutritionStats.totalCost}</p>
              <p><strong>蛋白質：</strong>${nutritionStats.totalProtein}g (${nutritionStats.proteinPercentage}%)</p>
              <p><strong>脂肪：</strong>${nutritionStats.totalFat}g (${nutritionStats.fatPercentage}%)</p>
              <p><strong>碳水化合物：</strong>${nutritionStats.totalCarbs}g (${nutritionStats.carbsPercentage}%)</p>
            </div>
            
            <h2>食材清單</h2>
            <table>
              <thead>
                <tr>
                  <th>食材名稱</th>
                  <th>份量(g)</th>
                  <th>卡路里</th>
                  <th>蛋白質(g)</th>
                  <th>脂肪(g)</th>
                  <th>碳水化合物(g)</th>
                  <th>成本(USD)</th>
                </tr>
              </thead>
              <tbody>
                ${selectedIngredients.map(({ ingredient, servingSize }) => `
                  <tr>
                    <td>${ingredient.name}</td>
                    <td>${servingSize}</td>
                    <td>${Math.round(ingredient.calories_per_100g * servingSize / 100)}</td>
                    <td>${(ingredient.protein_g * servingSize / 100).toFixed(1)}</td>
                    <td>${(ingredient.fat_g * servingSize / 100).toFixed(1)}</td>
                    <td>${(ingredient.carbs_g * servingSize / 100).toFixed(1)}</td>
                    <td>$${(ingredient.cost_per_100g_usd * servingSize / 100).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              由健康餐飲配方規劃師生成於 ${new Date().toLocaleDateString('zh-TW')}
            </p>
          </body>
        </html>
      `;
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4, p: 3, backgroundColor: 'background.paper', borderRadius: 3 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 800 }}>
          📊 營養摘要
        </Typography>
        <Typography variant="h6" color="text.secondary">
          您的健康餐點規劃已完成！
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' },
        gap: 3,
        alignItems: 'flex-start',
        mb: 4
      }}>
        {/* 左側：營養統計 */}
        <Box sx={{ 
          flex: { xs: '1', lg: '1' },
          width: { xs: '100%', lg: 'auto' },
          minWidth: 0
        }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            營養統計
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                width: 200,
                minWidth: 200,
                maxWidth: 200,
                height: 100,
                boxSizing: 'border-box'
              }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                  borderRadius: 2,
                }}>
                  <LocalFireDepartment sx={{ fontSize: 24, color: '#ef4444' }} />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '1.5rem'
                    }}
                  >
                    {(() => {
                      const calories = nutritionStats.totalCalories.toString();
                      return calories.length > 5 ? calories.slice(0, 5) + '...' : calories;
                    })()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    總卡路里
                  </Typography>
                </Box>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                width: 200,
                minWidth: 200,
                maxWidth: 200,
                height: 100,
                boxSizing: 'border-box'
              }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                  borderRadius: 2,
                }}>
                  <AttachMoney sx={{ fontSize: 24, color: '#10b981' }} />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '1.5rem'
                    }}
                  >
                    ${(() => {
                      const cost = nutritionStats.totalCost.toFixed(2);
                      return cost.length > 5 ? cost.slice(0, 5) + '...' : cost;
                    })()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    總花費
                  </Typography>
                </Box>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                width: 200,
                minWidth: 200,
                maxWidth: 200,
                height: 100,
                boxSizing: 'border-box'
              }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                  borderRadius: 2,
                }}>
                  <Restaurant sx={{ fontSize: 24, color: '#ef4444' }} />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '1.5rem'
                    }}
                  >
                    {(() => {
                      const protein = nutritionStats.totalProtein.toFixed(1);
                      return protein.length > 5 ? protein.slice(0, 5) + '...' : protein;
                    })()}g
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    蛋白質
                  </Typography>
                </Box>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                width: 200,
                minWidth: 200,
                maxWidth: 200,
                height: 100,
                boxSizing: 'border-box'
              }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                  borderRadius: 2,
                }}>
                  <Favorite sx={{ fontSize: 24, color: '#10b981' }} />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '1.5rem'
                    }}
                  >
                    {(() => {
                      const fat = nutritionStats.totalFat.toFixed(1);
                      return fat.length > 5 ? fat.slice(0, 5) + '...' : fat;
                    })()}g
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    脂肪
                  </Typography>
                </Box>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                width: 200,
                minWidth: 200,
                maxWidth: 200,
                height: 100,
                boxSizing: 'border-box'
              }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                  borderRadius: 2,
                }}>
                  <Grain sx={{ fontSize: 24, color: '#f59e0b' }} />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '1.5rem'
                    }}
                  >
                    {(() => {
                      const carbs = nutritionStats.totalCarbs.toFixed(1);
                      return carbs.length > 5 ? carbs.slice(0, 5) + '...' : carbs;
                    })()}g
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    碳水化合物
                  </Typography>
                </Box>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                width: 200,
                minWidth: 200,
                maxWidth: 200,
                height: 100,
                boxSizing: 'border-box'
              }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                  borderRadius: 2,
                }}>
                  <Park sx={{ fontSize: 24, color: '#10b981' }} />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '1.5rem'
                    }}
                  >
                    {(() => {
                      const fiber = nutritionStats.totalFiber.toFixed(1);
                      return fiber.length > 5 ? fiber.slice(0, 5) + '...' : fiber;
                    })()}g
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    纖維
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* 右側：巨量營養素分佈 */}
        <Box sx={{ 
          flex: { xs: '1', lg: '1' },
          width: { xs: '100%', lg: 'auto' },
          minWidth: 0
        }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
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
          </Card>
        </Box>
      </Box>

      {/* 食材清單 */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          食材清單
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>食材名稱</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>份量</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>卡路里</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>成本</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedIngredients.map(({ ingredient, servingSize }) => (
                <TableRow key={ingredient.ingredient_id} hover>
                  <TableCell>{ingredient.name}</TableCell>
                  <TableCell>{servingSize}g</TableCell>
                  <TableCell>{(() => {
                    const calories = Math.round(ingredient.calories_per_100g * servingSize / 100).toString();
                    return calories.length > 5 ? calories.slice(0, 5) + '...' : calories;
                  })()} kcal</TableCell>
                  <TableCell>${(() => {
                    const cost = (ingredient.cost_per_100g_usd * servingSize / 100).toFixed(2);
                    return cost.length > 5 ? cost.slice(0, 5) + '...' : cost;
                  })()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* 匯出功能 */}
      <Card sx={{ p: 3, textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          匯出功能
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={exportToCSV}
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
            📄 匯出 CSV
          </Button>
          <Button
            variant="contained"
            onClick={exportToPDF}
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
            📋 列印 PDF
          </Button>
        </Box>
      </Card>

      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        justifyContent: 'center', 
        flexWrap: 'wrap',
        p: 3,
        backgroundColor: 'background.paper',
        borderRadius: 3,
      }}>
        <Button
          variant="outlined"
          onClick={onBackToMenu}
          sx={{
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            color: '#64748b',
            borderColor: '#e2e8f0',
            '&:hover': {
              background: 'linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%)',
              borderColor: '#cbd5e1',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          ← 返回菜單
        </Button>
        <Button
          variant="contained"
          onClick={onStartOver}
          sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px -5px rgba(16, 185, 129, 0.4)',
            },
          }}
        >
          🆕 重新規劃
        </Button>
      </Box>
    </Box>
  );
}
