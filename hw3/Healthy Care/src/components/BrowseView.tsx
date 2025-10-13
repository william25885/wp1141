import { useState } from 'react';
import { 
  Typography, 
  TextField, 
  Grid, 
  Box, 
  Paper,
  Container
} from '@mui/material';
import type { Ingredient, FilterOptions } from '../types';
import IngredientCard from './IngredientCard';
import FilterPanel from './FilterPanel';

interface BrowseViewProps {
  ingredients: Ingredient[];
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  onAddToMenu: (ingredient: Ingredient) => void;
}

export default function BrowseView({ 
  ingredients, 
  filters, 
  onFiltersChange, 
  onAddToMenu 
}: BrowseViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // 篩選食材
  const filteredIngredients = ingredients.filter(ingredient => {
    // 搜尋關鍵字
    if (searchTerm && !ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // 類別篩選
    if (filters.categories.length > 0 && !filters.categories.includes(ingredient.category)) {
      return false;
    }

    // 飲食標籤篩選
    if (filters.dietTags.length > 0) {
      const hasMatchingTag = filters.dietTags.some(tag => 
        ingredient.diet_tags.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    // 過敏原篩選（排除包含過敏原的食材）
    if (filters.allergens.length > 0) {
      const hasAllergen = filters.allergens.some(allergen => 
        ingredient.allergens.includes(allergen)
      );
      if (hasAllergen) return false;
    }

    // 卡路里範圍篩選
    if (ingredient.calories_per_100g < filters.calorieRange[0] || 
        ingredient.calories_per_100g > filters.calorieRange[1]) {
      return false;
    }

    // 價格範圍篩選
    if (ingredient.cost_per_100g_usd < filters.priceRange[0] || 
        ingredient.cost_per_100g_usd > filters.priceRange[1]) {
      return false;
    }

    return true;
  });

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h2" 
          component="h2" 
          sx={{ 
            mb: 3, 
            color: 'text.primary',
            fontWeight: 700,
          }}
        >
          探索健康食材
        </Typography>
        <Box sx={{ maxWidth: 400, mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder="搜尋食材名稱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2, // 原本的 0.5rem
                backgroundColor: 'background.paper',
                fontSize: '1rem', // 原本的 1rem
                padding: '0.75rem 1rem', // 原本的 padding
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                },
              },
            }}
          />
        </Box>
      </Box>

               <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                 <Box sx={{ 
                   flex: '0 0 300px',
                   position: 'sticky',
                   top: 24,
                 }}>
                   <FilterPanel
                     filters={filters}
                     onFiltersChange={onFiltersChange}
                     ingredients={ingredients}
                   />
                 </Box>

                 <Box sx={{ flex: 1, minWidth: 0 }}>
                   <Grid container spacing={3}>
                     {filteredIngredients.length === 0 ? (
                       <Grid item xs={12}>
                         <Paper
                           elevation={0}
                           sx={{
                             p: 6,
                             textAlign: 'center',
                             backgroundColor: 'grey.50',
                             borderRadius: 3,
                           }}
                         >
                           <Typography variant="h6" color="text.secondary" gutterBottom>
                             沒有找到符合條件的食材
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                             請嘗試調整篩選條件
                           </Typography>
                         </Paper>
                       </Grid>
                     ) : (
                       filteredIngredients.map(ingredient => (
                         <Grid item xs={12} sm={6} md={4} key={ingredient.ingredient_id}>
                           <IngredientCard
                             ingredient={ingredient}
                             onAddToMenu={onAddToMenu}
                           />
                         </Grid>
                       ))
                     )}
                   </Grid>
                 </Box>
               </Box>
    </Box>
  );
}
