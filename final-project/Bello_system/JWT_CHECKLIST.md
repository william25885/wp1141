# JWT 功能實作檢查清單

## ✅ 已完成

### 後端 JWT 驗證
- ✅ `create_meeting` - 已添加 `@require_auth`
- ✅ `get_profile` - 已添加 `@require_auth`
- ✅ `join_meeting` - 已添加 `@require_auth`，從 token 獲取 user_id
- ✅ `leave_meeting` - 已添加 `@require_auth`，從 token 獲取 user_id
- ✅ `cancel_meeting` - 已添加 `@require_auth`
- ✅ `finish_meeting` - 已添加 `@require_auth`
- ✅ `my_meetings` - 已添加 `@require_auth`，驗證 user_id
- ✅ `update_profile` - 已添加 `@require_auth`，從 token 獲取 user_id
- ✅ `sns_management` - 已添加 `@require_auth`，從 token 獲取 user_id
- ✅ `meeting_chat` - 已添加 `@require_auth`，從 token 獲取 sender_id
- ✅ `private_chat` - 已添加 `@require_auth`，從 token 獲取 sender_id，驗證權限
- ✅ `search_user` - 已添加 `@require_auth`，從 token 獲取 current_user
- ✅ `list_meeting` - 已添加 `@require_auth`，從 token 獲取 user_id
- ✅ `admin/users` - 已添加 `@require_admin`
- ✅ `admin/meetings` - 已添加 `@require_admin`
- ✅ `admin/cancel_meeting` - 已添加 `@require_admin`
- ✅ `admin/finish_meeting` - 已添加 `@require_admin`
- ✅ `admin/remove_user` - 已添加 `@require_admin`
- ✅ `admin/chat_partners` - 已添加 `@require_admin`
- ✅ `admin/chat_history` - 已添加 `@require_admin`
- ✅ `admin/meeting_chat` - 已添加 `@require_admin`

### 前端
- ✅ `LoginView.vue` - 已更新，使用 `setAuth()` 存儲 token
- ✅ `RegisterView.vue` - 已更新錯誤處理
- ✅ `App.vue` - 已更新，使用 `getUser()` 和 `clearAuth()`
- ✅ `CreateMeetingView.vue` - 已更新，使用 `apiPost()` 和 `getUser()`
- ✅ `router/index.js` - 已更新，使用 `getUser()`

## ⚠️ 需要更新（仍使用原生 fetch 或 localStorage）

以下視圖仍在使用 `localStorage.getItem('user')` 或原生 `fetch`，建議更新為使用新的 API 工具函數：

### 高優先級（會影響功能）
1. **MyMeetingsView.vue**
   - 使用 `localStorage.getItem('user')` 和原生 `fetch`
   - 需要更新為 `getUser()` 和 `apiGet()` / `apiPost()`

2. **MeetingListView.vue**
   - 使用 `localStorage.getItem('user')` 和原生 `fetch`
   - 需要更新為 `getUser()` 和 `apiGet()` / `apiPost()`

3. **ChatView.vue**
   - 使用 `localStorage.getItem('user')` 和原生 `fetch`
   - 需要更新為 `getUser()` 和 `apiGet()` / `apiPost()`

4. **MeetingChatView.vue**
   - 使用 `localStorage.getItem('user')` 和原生 `fetch`
   - 需要更新為 `getUser()` 和 `apiGet()` / `apiPost()`

5. **ProfileView.vue**
   - 使用 `localStorage.getItem('user')` 和原生 `fetch`
   - 需要更新為 `getUser()` 和 `apiGet()` / `apiPost()`

### 中優先級（管理員功能）
6. **AdminMeetingsView.vue**
   - 使用原生 `fetch`
   - 需要更新為 `apiGet()` / `apiPost()`

7. **AdminUsersView.vue**
   - 使用原生 `fetch`
   - 需要更新為 `apiGet()` / `apiPost()`

8. **AdminUserChatRecordsView.vue**
   - 使用原生 `fetch`
   - 需要更新為 `apiGet()` / `apiPost()`

9. **AdminMeetingChatRecordsView.vue**
   - 使用原生 `fetch`
   - 需要更新為 `apiGet()` / `apiPost()`

10. **AdminLobbyView.vue**
    - 使用 `localStorage.getItem('user')`
    - 需要更新為 `getUser()`

### 低優先級（組件）
11. **UserMeetingCard.vue**
    - 使用 `localStorage.getItem('user')`
    - 需要更新為 `getUser()`

## 📝 更新模式

### 舊代碼模式：
```javascript
// 獲取用戶
const user = JSON.parse(localStorage.getItem('user'))

// API 請求
const response = await fetch(apiUrl('endpoint'), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
})
const data = await response.json()
```

### 新代碼模式：
```javascript
import { getUser, apiGet, apiPost } from '@/utils/api'

// 獲取用戶
const user = getUser()

// API 請求（自動帶上 token）
const data = await apiPost('endpoint', requestData)
// 或
const data = await apiGet('endpoint')
```

## 🔍 不需要 JWT 驗證的端點（正確）

以下端點不需要 JWT 驗證，這是正確的：
- ✅ `signup` - 註冊（公開端點）
- ✅ `login` - 登入（公開端點）
- ✅ `exit` - 登出（前端已處理，後端可選）

## ✅ 登出功能
- ✅ `App.vue` 中的 `handleLogout()` 已使用 `clearAuth()`
- ✅ `exit.py` 後端端點（可選，前端已處理）

## 🎯 總結

**後端**：✅ 所有需要驗證的端點都已添加 JWT 驗證

**前端**：⚠️ 約 11 個視圖/組件需要更新為使用新的 API 工具函數

建議優先更新高優先級的視圖，以確保核心功能正常工作。

