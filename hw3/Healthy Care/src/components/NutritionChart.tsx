import { Box, Typography } from '@mui/material';

interface NutritionChartProps {
  proteinPercentage: number;
  fatPercentage: number;
  carbsPercentage: number;
}

export default function NutritionChart({ 
  proteinPercentage, 
  fatPercentage, 
  carbsPercentage 
}: NutritionChartProps) {
  // 計算總百分比
  const totalPercentage = proteinPercentage + fatPercentage + carbsPercentage;
  
  // 如果總百分比為 0，顯示空圓圈
  if (totalPercentage === 0) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-block', width: 120, height: 120 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="42"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="8"
          />
        </svg>
        
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          <Typography variant="body2" sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'text.primary' }}>
            0%
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            營養素
          </Typography>
        </Box>
      </Box>
    );
  }

  // 計算圓餅圖的圓周和角度
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  
  // 計算各營養素的圓弧長度
  const proteinLength = (proteinPercentage / 100) * circumference;
  const fatLength = (fatPercentage / 100) * circumference;
  const carbsLength = (carbsPercentage / 100) * circumference;
  
  // 計算起始角度
  let currentAngle = 0;
  const proteinStartAngle = currentAngle;
  currentAngle += (proteinPercentage / 100) * 360;
  const fatStartAngle = currentAngle;
  currentAngle += (fatPercentage / 100) * 360;
  const carbsStartAngle = currentAngle;

  return (
    <Box sx={{ position: 'relative', display: 'inline-block', width: 120, height: 120 }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="8"
        />
        
        {/* 蛋白質 */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#4CAF50"
          strokeWidth="8"
          strokeDasharray={`${proteinLength} ${circumference}`}
          strokeDashoffset={-proteinStartAngle * circumference / 360}
          transform="rotate(-90 60 60)"
        />
        
        {/* 脂肪 */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#FF9800"
          strokeWidth="8"
          strokeDasharray={`${fatLength} ${circumference}`}
          strokeDashoffset={-fatStartAngle * circumference / 360}
          transform="rotate(-90 60 60)"
        />
        
        {/* 碳水化合物 */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#2196F3"
          strokeWidth="8"
          strokeDasharray={`${carbsLength} ${circumference}`}
          strokeDashoffset={-carbsStartAngle * circumference / 360}
          transform="rotate(-90 60 60)"
        />
      </svg>
      
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        <Typography variant="body2" sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'text.primary' }}>
          {Math.round(proteinPercentage + fatPercentage + carbsPercentage)}%
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          營養素
        </Typography>
      </Box>
    </Box>
  );
}
