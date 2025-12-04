# 更新前端 API URL 指南

由於有 12 個 Vue 文件需要更新，請按照以下步驟操作：

## 需要更新的文件列表

1. AdminMeetingChatRecordsView.vue
2. AdminMeetingsView.vue
3. AdminUserChatRecordsView.vue
4. AdminUsersView.vue
5. ChatView.vue
6. CreateMeetingView.vue ✅ (已更新)
7. MeetingChatView.vue
8. MeetingListView.vue
9. MyMeetingsView.vue
10. ProfileView.vue
11. RegisterView.vue ✅ (已更新)
12. LoginView.vue ✅ (已更新)

## 更新步驟

對於每個文件，需要：

1. **在 `<script>` 標籤開頭添加 import：**
   ```javascript
   import { apiUrl } from '@/config/api'
   ```

2. **替換所有 `http://localhost:8800/api/...` 為 `apiUrl('...')`**

   例如：
   - `http://localhost:8800/api/login` → `apiUrl('login')`
   - `http://localhost:8800/api/user-profile/${user.user_id}` → `apiUrl(\`user-profile/${user.user_id}\`)`
   - `http://localhost:8800/api/list-meeting?user_id=${user.user_id}` → `apiUrl(\`list-meeting?user_id=${user.user_id}\`)`

## 快速查找和替換

可以使用編輯器的查找替換功能：
- 查找：`http://localhost:8800/api/`
- 替換為：`apiUrl('`
- 然後手動調整每個調用的結尾（將 `'` 改為 `')`）

## 注意事項

- 如果 URL 包含查詢參數，保持參數不變
- 如果 URL 包含變數（如 `${user_id}`），使用模板字符串
- 確保每個文件都添加了 import 語句
