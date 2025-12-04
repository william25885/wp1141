// API 配置
// 根據環境變數決定 API 基礎 URL
const getApiBaseUrl = () => {
  // 開發環境
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://localhost:8800'
  }
  // 生產環境（Vercel）
  // 如果設置了環境變數，使用環境變數；否則使用相對路徑（同域）
  return import.meta.env.VITE_API_URL || '/api'
}

export const API_BASE_URL = getApiBaseUrl()

// 完整的 API URL 輔助函數
export const apiUrl = (endpoint) => {
  // 如果 endpoint 已經包含 http，直接返回
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint
  }
  
  // 移除開頭的斜線（如果有的話）
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  
  // 如果 API_BASE_URL 是相對路徑，直接拼接
  if (API_BASE_URL.startsWith('/')) {
    return `/${cleanEndpoint}`
  }
  
  // 否則拼接完整 URL
  return `${API_BASE_URL}/${cleanEndpoint}`
}

