import type { SelectedIngredient, NutritionStats } from '../types';

// 計算營養統計
export function calculateNutritionStats(selectedIngredients: SelectedIngredient[]): NutritionStats {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;
  let totalFiber = 0;
  let totalSugar = 0;
  let totalSodium = 0;
  let totalCost = 0;

  selectedIngredients.forEach(({ ingredient, servingSize }) => {
    const multiplier = servingSize / 100; // 轉換為每100克的倍數
    
    totalCalories += ingredient.calories_per_100g * multiplier;
    totalProtein += ingredient.protein_g * multiplier;
    totalFat += ingredient.fat_g * multiplier;
    totalCarbs += ingredient.carbs_g * multiplier;
    totalFiber += ingredient.fiber_g * multiplier;
    totalSugar += ingredient.sugar_g * multiplier;
    totalSodium += ingredient.sodium_mg * multiplier;
    totalCost += ingredient.cost_per_100g_usd * multiplier;
  });

  // 計算巨量營養素百分比
  const totalMacros = totalProtein * 4 + totalCarbs * 4 + totalFat * 9; // 卡路里轉換
  const proteinPercentage = totalMacros > 0 ? (totalProtein * 4 / totalMacros) * 100 : 0;
  const fatPercentage = totalMacros > 0 ? (totalFat * 9 / totalMacros) * 100 : 0;
  const carbsPercentage = totalMacros > 0 ? (totalCarbs * 4 / totalMacros) * 100 : 0;

  return {
    totalCalories: isNaN(totalCalories) ? 0 : Math.round(totalCalories),
    totalProtein: isNaN(totalProtein) ? 0 : Math.round(totalProtein * 10) / 10,
    totalFat: isNaN(totalFat) ? 0 : Math.round(totalFat * 10) / 10,
    totalCarbs: isNaN(totalCarbs) ? 0 : Math.round(totalCarbs * 10) / 10,
    totalFiber: isNaN(totalFiber) ? 0 : Math.round(totalFiber * 10) / 10,
    totalSugar: isNaN(totalSugar) ? 0 : Math.round(totalSugar * 10) / 10,
    totalSodium: isNaN(totalSodium) ? 0 : Math.round(totalSodium),
    totalCost: isNaN(totalCost) ? 0 : Math.round(totalCost * 100) / 100,
    proteinPercentage: isNaN(proteinPercentage) ? 0 : Math.round(proteinPercentage * 10) / 10,
    fatPercentage: isNaN(fatPercentage) ? 0 : Math.round(fatPercentage * 10) / 10,
    carbsPercentage: isNaN(carbsPercentage) ? 0 : Math.round(carbsPercentage * 10) / 10
  };
}

// 檢查營養建議
export function getNutritionAdvice(stats: NutritionStats): string[] {
  const advice: string[] = [];
  
  if (stats.proteinPercentage < 15) {
    advice.push('建議增加高蛋白食材，蛋白質比例偏低');
  }
  
  if (stats.fatPercentage < 20) {
    advice.push('建議增加健康脂肪來源，脂肪比例偏低');
  }
  
  if (stats.fatPercentage > 35) {
    advice.push('脂肪比例偏高，建議減少高脂肪食材');
  }
  
  if (stats.totalSodium > 2300) {
    advice.push('鈉含量偏高，建議選擇低鈉食材');
  }
  
  if (stats.totalFiber < 25) {
    advice.push('纖維攝取不足，建議增加蔬菜和全穀物');
  }
  
  return advice;
}
