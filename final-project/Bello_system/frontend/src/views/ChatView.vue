<template>
  <div class="chat-container">
    <div class="content-wrapper">
      <div class="row g-4">
        <!-- 左側用戶列表 -->
        <div class="col-md-4">
          <div class="chat-sidebar">
            <div class="sidebar-header">
              <h4>聊天列表</h4>
            </div>
            <div class="chat-list">
              <div v-if="chatList.length === 0" class="no-chats">
                <p>目前沒有進行中的聊天</p>
              </div>
              <div v-else class="chat-items">
                <div v-for="chat in chatList" 
                     :key="chat.other_user_id"
                     @click="selectChat(chat.other_user_id)"
                     class="chat-item"
                     :class="{ active: selectedUserId === chat.other_user_id }">
                  <div class="chat-item-content">
                    <h5>{{ chat.other_user_name }}</h5>
                    <small>{{ chat.last_message_time || '尚未開始對話' }}</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="sidebar-footer">
              <button class="btn btn-primary w-100" @click="showUserSearch = true">
                開始新對話
              </button>
            </div>
          </div>
        </div>

        <!-- 右側聊天內容 -->
        <div class="col-md-8">
          <div class="chat-main">
            <div v-if="selectedUserId" class="chat-window">
              <div class="chat-header">
                <h4>{{ getSelectedUserName() }}</h4>
              </div>
              <div class="chat-messages" ref="messageContainer">
                <div v-if="chatHistory.length === 0" class="no-messages">
                  <p>還沒有任何對話，開始聊天吧！</p>
                </div>
                <div v-else>
                  <div v-for="message in chatHistory" 
                       :key="message.timestamp"
                       class="message"
                       :class="{ 'message-mine': message.sender_id === currentUserId }">
                    <div class="message-content">
                      <div class="message-text">{{ message.content }}</div>
                      <small class="message-time">{{ formatTime(message.timestamp) }}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="chat-input">
                <div class="input-group">
                  <input type="text" 
                         class="form-control" 
                         v-model="newMessage"
                         @keyup.enter="sendMessage" 
                         placeholder="輸入訊息...">
                  <button class="btn btn-primary" @click="sendMessage">發送</button>
                </div>
              </div>
            </div>
            <div v-else class="no-chat-selected">
              <h4>選擇一個聊天對象開始對話</h4>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜尋用戶對話框 -->
    <div class="modal fade" :class="{ 'show d-block': showUserSearch }" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">選擇聊天對象</h5>
            <button type="button" class="btn-close" @click="closeUserSearch"></button>
          </div>
          <div class="modal-body">
            <div class="search-box mb-3">
              <input 
                type="text" 
                class="form-control" 
                v-model="searchQuery"
                placeholder="輸入用戶暱稱或ID搜尋..."
                @input="handleSearch"
              >
            </div>
            <div v-if="searchQuery && !filteredUsers.length" class="text-center text-muted my-3">
              請輸入搜尋關鍵字
            </div>
            <div class="user-list">
              <div v-for="user in filteredUsers" 
                   :key="user.user_id"
                   @click="startNewChat(user)"
                   class="user-item">
                <div class="user-info">
                  <div class="user-name">{{ user.user_name }}</div>
                  <div class="user-nickname text-muted">{{ user.user_nickname }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, apiGet, apiPost } from '@/utils/api'

function debounce(fn, delay) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), delay)
  }
}

export default {
  name: 'PrivateChatView',
  data() {
    return {
      currentUserId: null,
      chatList: [],
      selectedUserId: null,
      selectedUserName: '',
      chatHistory: [],
      newMessage: '',
      showUserSearch: false,
      searchQuery: '',
      filteredUsers: []
    }
  },
  async created() {
    const user = getUser()
    if (!user || !user.user_id) {
      this.$router.push('/login')
      return
    }
    this.currentUserId = user.user_id
    await this.loadChatList()
  },
  methods: {
    async loadChatList() {
      try {
        // 使用 apiGet，後端會從 token 獲取 user_id
        const data = await apiGet('my-chats')
        if (data.status === 'success') {
          // 根據最後消息時間排序
          const sortedChats = data.chats.sort((a, b) => {
            const timeA = a.last_message_time ? new Date(a.last_message_time).getTime() : 0
            const timeB = b.last_message_time ? new Date(b.last_message_time).getTime() : 0
            return timeB - timeA // 降序排列，最新的在前
          })
          
          this.chatList = sortedChats
          
          // 如果當前選中的聊天有更新，更新其訊息
          if (this.selectedUserId) {
            const selectedChat = sortedChats.find(chat => chat.other_user_id === this.selectedUserId)
            if (selectedChat) {
              this.selectedUserName = selectedChat.other_user_name
            }
          }
        }
      } catch (error) {
        console.error('Error loading chat list:', error)
        if (error.message && error.message.includes('認證')) {
          this.$router.push('/login')
        }
      }
    },
    async selectChat(userId) {
      this.selectedUserId = userId
      await this.loadChatHistory()
      this.startPolling()
    },
    async loadChatHistory() {
      if (!this.selectedUserId) return
      
      try {
        // 使用 apiPost，後端會從 token 獲取 user1_id，只需要傳 user2_id
        const data = await apiPost('private-chat/history', {
          user2_id: this.selectedUserId
        })
        if (data.status === 'success') {
          this.chatHistory = data.messages
          this.$nextTick(() => {
            this.scrollToBottom()
          })
        }
      } catch (error) {
        console.error('Error loading chat history:', error)
        if (error.message && error.message.includes('認證')) {
          this.$router.push('/login')
        }
      }
    },
    startPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
      }
      // 同時輪詢聊天列表和聊天歷史
      this.pollingInterval = setInterval(async () => {
        await Promise.all([
          this.loadChatList(),
          this.loadChatHistory()
        ])
      }, 1000)
    },
    async sendMessage() {
      if (!this.newMessage.trim()) return
      
      try {
        // 使用 apiPost，後端會從 token 獲取 sender_id，只需要傳 receiver_id 和 content
        const data = await apiPost('private-chat/send', {
          receiver_id: this.selectedUserId,
          content: this.newMessage
        })
        if (data.status === 'success') {
          this.newMessage = ''
          await this.loadChatHistory()
          await this.loadChatList()
          
          const currentChat = this.chatList.find(chat => chat.other_user_id === this.selectedUserId)
          if (currentChat) {
            this.chatList = this.chatList.filter(chat => chat.other_user_id !== this.selectedUserId)
            this.chatList.unshift(currentChat)
          }
        }
      } catch (error) {
        console.error('Error sending message:', error)
        if (error.message && error.message.includes('認證')) {
          this.$router.push('/login')
        }
      }
    },
    async startNewChat(user) {
      this.selectedUserId = user.user_id
      this.selectedUserName = user.user_name
      
      const existingChat = this.chatList.find(chat => chat.other_user_id === user.user_id)
      if (!existingChat) {
        this.chatList.push({
          other_user_id: user.user_id,
          other_user_name: user.user_name,
          last_message_time: null
        })
      }
      
      this.showUserSearch = false
      await this.loadChatHistory()
      await this.loadChatList()
      this.startPolling()
    },
    getSelectedUserName() {
      if (this.selectedUserName) {
        return this.selectedUserName
      }
      const chat = this.chatList.find(chat => chat.other_user_id === this.selectedUserId)
      return chat ? chat.other_user_name : ''
    },
    scrollToBottom() {
      const container = this.$refs.messageContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleString()
    },
    handleSearch: debounce(async function() {
      if (!this.searchQuery.trim()) {
        this.filteredUsers = [];
        return;
      }
      
      try {
        // 使用 apiGet，後端會從 token 獲取 current_user
        const data = await apiGet(`search-users?query=${encodeURIComponent(this.searchQuery)}`);
        if (data.status === 'success') {
          this.filteredUsers = data.users;
        }
      } catch (error) {
        console.error('Error searching users:', error);
        if (error.message && error.message.includes('認證')) {
          this.$router.push('/login')
        }
      }
    }, 300),
    closeUserSearch() {
      this.showUserSearch = false;
      this.searchQuery = '';
      this.filteredUsers = [];
    }
  },
  beforeDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
    }
  }
}
</script>

<style scoped>
.chat-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.chat-sidebar {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.chat-item {
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.chat-item:hover, .chat-item.active {
  background: #f8f9fa;
}

.chat-item h5 {
  margin: 0;
  font-size: 1rem;
}

.chat-item small {
  color: #6c757d;
  font-size: 0.8rem;
}

.sidebar-footer {
  padding: 15px;
  border-top: 1px solid #eee;
}

.chat-main {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: calc(100vh - 120px);
}

.chat-window {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  margin-bottom: 15px;
}

.message-content {
  max-width: 70%;
  padding: 12px;
  border-radius: 12px;
  background: #f8f9fa;
  display: inline-block;
}

.message-mine {
  text-align: right;
}

.message-mine .message-content {
  background: #0d6efd;
  color: white;
}

.message-time {
  display: block;
  font-size: 0.75rem;
  margin-top: 5px;
  color: #6c757d;
}

.message-mine .message-time {
  color: rgba(255,255,255,0.8);
}

.chat-input {
  padding: 15px;
  border-top: 1px solid #eee;
}

.no-chat-selected {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.modal {
  background: rgba(0,0,0,0.5);
}

.user-list {
  max-height: 300px;
  overflow-y: auto;
}

.user-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.user-item:hover {
  background-color: #f8f9fa;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-nickname {
  font-size: 0.875rem;
}

.search-box {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}
</style>