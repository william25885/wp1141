import { 
  Paper, 
  Typography, 
  Button, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Box,
  TextField,
  Divider
} from '@mui/material';
import type { Ingredient, FilterOptions } from '../types';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  ingredients: Ingredient[];
}

export default function FilterPanel({ filters, onFiltersChange, ingredients }: FilterPanelProps) {
  // 取得所有可用的選項
  const allCategories = [...new Set(ingredients.map(i => i.category))];
  const allDietTags = [...new Set(ingredients.flatMap(i => i.diet_tags))];
  const allAllergens = [...new Set(ingredients.flatMap(i => i.allergens))];

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      categories: toggleArrayItem(filters.categories, category)
    });
  };

  const handleDietTagChange = (tag: string) => {
    onFiltersChange({
      dietTags: toggleArrayItem(filters.dietTags, tag)
    });
  };

  const handleAllergenChange = (allergen: string) => {
    onFiltersChange({
      allergens: toggleArrayItem(filters.allergens, allergen)
    });
  };

  const handleCalorieRangeChange = (index: number, value: number) => {
    const newRange = [...filters.calorieRange] as [number, number];
    newRange[index] = value;
    onFiltersChange({ calorieRange: newRange });
  };

  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange = [...filters.priceRange] as [number, number];
    newRange[index] = value;
    onFiltersChange({ priceRange: newRange });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      dietTags: [],
      allergens: [],
      calorieRange: [0, 1000],
      priceRange: [0, 5]
    });
  };

  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: 3, 
        borderRadius: 5, // 原本的 1.25rem
        backgroundColor: 'background.paper',
        position: 'sticky',
        top: 24,
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)', // 原本的漸層背景
        border: '1px solid rgba(226, 232, 240, 0.8)', // 原本的邊框
        backdropFilter: 'blur(10px)', // 原本的 backdrop-filter
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
          篩選條件
        </Typography>
        <Button 
          onClick={clearAllFilters} 
          variant="outlined"
          color="error"
          size="small"
          sx={{ 
            textTransform: 'none', 
            fontWeight: 600,
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            '&:hover': {
              backgroundColor: '#dc2626',
              border: 'none',
            },
          }}
        >
          清除全部
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          食材類別
        </Typography>
        <FormGroup>
          {allCategories.map(category => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  color="primary"
                />
              }
              label={category === 'protein' ? '蛋白質' : 
                     category === 'grain' ? '穀物' :
                     category === 'carb' ? '碳水化合物' :
                     category === 'vegetable' ? '蔬菜' :
                     category === 'fat' ? '脂肪' : category}
              sx={{ 
                '& .MuiFormControlLabel-label': { 
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }
              }}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          飲食標籤
        </Typography>
        <FormGroup>
          {allDietTags.map(tag => (
            <FormControlLabel
              key={tag}
              control={
                <Checkbox
                  checked={filters.dietTags.includes(tag)}
                  onChange={() => handleDietTagChange(tag)}
                  color="primary"
                />
              }
              label={tag.replace(/"/g, '').replace('_', ' ')}
              sx={{ 
                '& .MuiFormControlLabel-label': { 
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }
              }}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          排除過敏原
        </Typography>
        <FormGroup>
          {allAllergens.map(allergen => (
            <FormControlLabel
              key={allergen}
              control={
                <Checkbox
                  checked={filters.allergens.includes(allergen)}
                  onChange={() => handleAllergenChange(allergen)}
                  color="primary"
                />
              }
              label={allergen.replace(/"/g, '').replace('_', ' ')}
              sx={{ 
                '& .MuiFormControlLabel-label': { 
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }
              }}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          卡路里範圍 (每100g)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            type="number"
            value={filters.calorieRange[0]}
            onChange={(e) => handleCalorieRangeChange(0, Number(e.target.value))}
            placeholder="最小值"
            size="small"
            sx={{ 
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5, // 原本的 0.375rem
                fontSize: '0.875rem', // 原本的 0.875rem
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>到</Typography>
          <TextField
            type="number"
            value={filters.calorieRange[1]}
            onChange={(e) => handleCalorieRangeChange(1, Number(e.target.value))}
            placeholder="最大值"
            size="small"
            sx={{ 
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                fontSize: '0.875rem',
              },
            }}
          />
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          價格範圍 (每100g USD)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            type="number"
            step="0.01"
            value={filters.priceRange[0]}
            onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
            placeholder="最小值"
            size="small"
            sx={{ 
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                fontSize: '0.875rem',
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>到</Typography>
          <TextField
            type="number"
            step="0.01"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
            placeholder="最大值"
            size="small"
            sx={{ 
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                fontSize: '0.875rem',
              },
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
}
