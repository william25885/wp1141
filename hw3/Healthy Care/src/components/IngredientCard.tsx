import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Box, 
  Chip
} from '@mui/material';
import type { Ingredient } from '../types';

interface IngredientCardProps {
  ingredient: Ingredient;
  onAddToMenu: (ingredient: Ingredient) => void;
}

export default function IngredientCard({ ingredient, onAddToMenu }: IngredientCardProps) {

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'protein': return '🥩';
      case 'grain': return '🌾';
      case 'carb': return '🍠';
      case 'vegetable': return '🥬';
      case 'fat': return '🥑';
      default: return '🍽️';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'protein': return '蛋白質';
      case 'grain': return '穀物';
      case 'carb': return '碳水化合物';
      case 'vegetable': return '蔬菜';
      case 'fat': return '脂肪';
      default: return category;
    }
  };

  return (
    <Card 
      sx={{ 
        position: 'relative',
        overflow: 'hidden',
        width: 280,
        minWidth: 280,
        maxWidth: 280,
        height: 200,
        minHeight: 200,
        maxHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          borderColor: 'rgba(59, 130, 246, 0.3)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
          opacity: 0,
          transition: 'opacity 0.3s',
        },
        '&:hover::before': {
          opacity: 1,
        },
      }}
    >
      <CardContent 
        sx={{ 
          pb: 1,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
              letterSpacing: '-0.025em',
              lineHeight: 1.3,
            }}
          >
            {getCategoryIcon(ingredient.category)} {ingredient.name}
          </Typography>
          <Chip 
            label={getCategoryName(ingredient.category)}
            size="small"
            sx={{
              fontSize: '0.875rem',
              fontWeight: 500,
              background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
              color: '#64748b',
            }}
          />
        </Box>
      </CardContent>

      <CardContent sx={{ pt: 0, flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                卡路里
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {ingredient.calories_per_100g} kcal
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                蛋白質
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {ingredient.protein_g}g
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                價格
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                ${ingredient.cost_per_100g_usd}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            onAddToMenu(ingredient);
          }}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px -5px rgba(59, 130, 246, 0.4)',
            },
          }}
        >
          ➕ 加入菜單
        </Button>
      </CardActions>

    </Card>
  );
}
