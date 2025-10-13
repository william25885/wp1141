import type { Ingredient } from '../types';

// 智能解析 CSV 行，處理引號內的逗號
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

// 解析 CSV 資料
export function parseIngredientsFromCSV(csvData: string): Ingredient[] {
  const lines = csvData.trim().split('\n');
  
  return lines.slice(1).map(line => {
    // 使用更智能的 CSV 解析，處理引號內的逗號
    const values = parseCSVLine(line);
    
    return {
      ingredient_id: parseInt(values[0]),
      name: values[1],
      category: values[2] as Ingredient['category'],
      calories_per_100g: parseFloat(values[3]),
      protein_g: parseFloat(values[4]),
      fat_g: parseFloat(values[5]),
      carbs_g: parseFloat(values[6]),
      fiber_g: parseFloat(values[7]),
      sugar_g: parseFloat(values[8]),
      sodium_mg: parseFloat(values[9]),
      glycemic_index: parseFloat(values[10]),
      cost_per_100g_usd: parseFloat(values[11]),
      diet_tags: values[12] ? values[12].replace(/"/g, '').split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
      allergens: values[13] ? values[13].replace(/"/g, '').split(',').map(allergen => allergen.trim()).filter(allergen => allergen.length > 0) : [],
      default_unit: values[14],
      serving_size_g: parseFloat(values[15])
    };
  });
}

// 載入 CSV 檔案
export async function loadIngredientsFromCSV(): Promise<Ingredient[]> {
  try {
    const response = await fetch('/src/public/Healthy_Meal_Plannerfoods.csv');
    const csvData = await response.text();
    return parseIngredientsFromCSV(csvData);
  } catch (error) {
    console.error('載入食材資料失敗:', error);
    return [];
  }
}
