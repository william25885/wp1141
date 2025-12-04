# JWT 身份驗證實作說明

## ✅ 已完成的工作

### 後端
1. ✅ 安裝 PyJWT 套件
2. ✅ 創建 JWT 工具類 (`backend/jwt_utils.py`)
3. ✅ 修改登入功能，返回 JWT token
4. ✅ 創建 JWT 驗證裝飾器 (`@require_auth`, `@require_admin`)
5. ✅ 為部分 API 端點添加 JWT 驗證

### 前端
1. ✅ 更新 API 工具 (`frontend/src/utils/api.js`)
   - 自動在請求頭中添加 token
   - 提供 `getToken()`, `getUser()`, `setAuth()`, `clearAuth()` 函數
2. ✅ 更新登入視圖 (`LoginView.vue`)
3. ✅ 更新 App.vue 和 router

## 📝 需要手動更新的文件

以下文件仍在使用 `localStorage.getItem('user')`，建議統一使用 `getUser()` 函數：

### 需要更新的視圖文件：
1. `frontend/src/views/ChatView.vue`
2. `frontend/src/views/MyMeetingsView.vue`
3. `frontend/src/views/MeetingListView.vue`
4. `frontend/src/views/MeetingChatView.vue`
5. `frontend/src/views/ProfileView.vue`
6. `frontend/src/views/CreateMeetingView.vue`
7. `frontend/src/views/AdminLobbyView.vue`
8. `frontend/src/components/UserMeetingCard.vue`

### 更新方式：

**舊代碼：**
```javascript
const user = JSON.parse(localStorage.getItem('user'))
```

**新代碼：**
```javascript
import { getUser } from '@/utils/api'
const user = getUser()
```

## 🔧 環境變數設置

在 `.env` 文件中添加：

```env
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_EXPIRATION_HOURS=24
```

⚠️ **重要**：生產環境請使用強隨機字符串作為 `JWT_SECRET_KEY`。

生成隨機密鑰：
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## 🚀 使用方式

### 後端：保護 API 端點

```python
from jwt_utils import require_auth, require_admin

# 需要登入
@my_route.route('/my-endpoint', methods=['POST'])
@require_auth
def my_endpoint():
    user_id = request.current_user['user_id']
    role = request.current_user['role']
    # ... 你的代碼

# 需要管理員權限
@admin_route.route('/admin/endpoint', methods=['GET'])
@require_admin
def admin_endpoint():
    # ... 你的代碼
```

### 前端：使用 API

```javascript
import { apiRequest, apiGet, apiPost, getUser } from '@/utils/api'

// GET 請求（自動帶上 token）
const data = await apiGet('user-profile/1')

// POST 請求（自動帶上 token）
const result = await apiPost('create-meeting', meetingData)

// 獲取當前用戶
const user = getUser()
```

## 📋 需要添加 JWT 驗證的 API 端點

以下端點建議添加 `@require_auth` 或 `@require_admin` 裝飾器：

### 需要 `@require_auth` 的端點：
- `actions/meeting/join_meeting.py`
- `actions/meeting/leave_meeting.py`
- `actions/meeting/cancel_meeting.py`
- `actions/meeting/finish_meeting.py`
- `actions/meeting/my_meetings.py`
- `actions/profile/update_profile.py`
- `actions/profile/sns_management.py`
- `actions/chat/meeting_chat.py`
- `actions/chat/private_chat.py`
- `actions/chat/search_user.py`

### 需要 `@require_admin` 的端點：
- `actions/admin/meetings.py`
- `actions/admin/cancel_meeting.py`
- `actions/admin/finish_meeting.py`
- `actions/admin/remove_user.py`
- `actions/admin/chat_partners.py`
- `actions/admin/chat_history.py`
- `actions/admin/meeting_chat.py`

## 🔒 安全性改進

1. ✅ Token 過期機制（24 小時）
2. ✅ 自動清除過期 token
3. ✅ 管理員權限驗證
4. ⚠️ 建議：添加 token 刷新機制
5. ⚠️ 建議：添加登出時將 token 加入黑名單

## 🧪 測試

1. 測試登入並獲取 token
2. 測試使用 token 訪問受保護的 API
3. 測試 token 過期後的處理
4. 測試管理員權限驗證

## 📚 相關文件

- `backend/jwt_utils.py` - JWT 工具類
- `backend/actions/auth/login.py` - 登入端點
- `frontend/src/utils/api.js` - API 工具函數

