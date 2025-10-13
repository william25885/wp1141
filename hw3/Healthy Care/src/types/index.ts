// 食材資料型別定義
export interface Ingredient {
  ingredient_id: number;
  name: string;
  category: 'protein' | 'grain' | 'carb' | 'vegetable' | 'fat';
  calories_per_100g: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  glycemic_index: number;
  cost_per_100g_usd: number;
  diet_tags: string[];
  allergens: string[];
  default_unit: string;
  serving_size_g: number;
}

// 選中的食材項目（包含份量）
export interface SelectedIngredient {
  ingredient: Ingredient;
  servingSize: number; // 以克為單位
}

// 營養統計
export interface NutritionStats {
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
  totalCost: number;
  proteinPercentage: number;
  fatPercentage: number;
  carbsPercentage: number;
}

// 篩選條件
export interface FilterOptions {
  categories: string[];
  dietTags: string[];
  allergens: string[];
  calorieRange: [number, number];
  priceRange: [number, number];
}

// 應用狀態
export interface AppState {
  ingredients: Ingredient[];
  selectedIngredients: SelectedIngredient[];
  filters: FilterOptions;
  currentView: 'browse' | 'menu' | 'summary';
}
