// API 工具函數
// 統一管理所有 API 請求

import { apiUrl } from '@/config/api'

/**
 * 發送 API 請求的通用函數
 * @param {string} endpoint - API 端點（例如：'login', 'user-profile/1'）
 * @param {object} options - fetch 選項
 * @returns {Promise} fetch 響應
 */
export async function apiRequest(endpoint, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  const response = await fetch(apiUrl(endpoint), {
    ...defaultOptions,
    ...options,
  })

  return response
}

/**
 * GET 請求
 */
export async function apiGet(endpoint) {
  const response = await apiRequest(endpoint, { method: 'GET' })
  return response.json()
}

/**
 * POST 請求
 */
export async function apiPost(endpoint, data, contentType = 'application/json') {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
    },
  }

  if (contentType === 'application/json') {
    options.body = JSON.stringify(data)
  } else if (contentType === 'application/x-www-form-urlencoded') {
    options.body = new URLSearchParams(data)
  } else {
    options.body = data
  }

  const response = await apiRequest(endpoint, options)
  return response.json()
}

/**
 * PUT 請求
 */
export async function apiPut(endpoint, data) {
  const response = await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

/**
 * DELETE 請求
 */
export async function apiDelete(endpoint) {
  const response = await apiRequest(endpoint, { method: 'DELETE' })
  return response.json()
}

