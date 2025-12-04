<template>
  <div class="modal fade" :class="{ 'show d-block': show }" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">用戶資訊</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body text-center">
          <div v-if="loading" class="py-4">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">載入中...</span>
            </div>
          </div>
          <div v-else>
            <div class="user-avatar mx-auto mb-3">
              <div class="avatar-circle large">
                {{ userNickname?.charAt(0) || userName?.charAt(0) }}
              </div>
              <span 
                v-if="onlineStatus !== null"
                class="online-indicator" 
                :class="{ 'online': onlineStatus }"
              ></span>
            </div>
            <h5 class="user-name mb-1">{{ userName }}</h5>
            <p class="user-nickname text-muted mb-3">{{ userNickname }}</p>
            
            <div class="action-buttons">
              <!-- 好友操作按鈕 -->
              <button 
                v-if="friendshipStatus === 'none'"
                class="btn btn-primary w-100 mb-2"
                @click="addFriend"
                :disabled="actionLoading"
              >
                {{ actionLoading ? '發送中...' : '加為好友' }}
              </button>
              
              <button 
                v-else-if="friendshipStatus === 'pending_received'"
                class="btn btn-success w-100 mb-2"
                @click="acceptFriend"
                :disabled="actionLoading"
              >
                接受好友請求
              </button>
              
              <span 
                v-else-if="friendshipStatus === 'pending_sent'"
                class="badge bg-warning d-block mb-2 py-2"
              >
                已發送好友請求
              </span>
              
              <span 
                v-else-if="friendshipStatus === 'accepted'"
                class="badge bg-success d-block mb-2 py-2"
              >
                ✓ 已是好友
              </span>
              
              <!-- 聊天按鈕 -->
              <button 
                class="btn btn-outline-primary w-100"
                @click="startChat"
              >
                開始聊天
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="show" class="modal-backdrop fade show"></div>
</template>

<script>
import { apiGet, apiPost } from '@/utils/api'

export default {
  name: 'UserProfilePopup',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    userId: {
      type: [Number, String],
      required: true
    },
    userName: {
      type: String,
      default: ''
    },
    userNickname: {
      type: String,
      default: ''
    }
  },
  emits: ['close', 'start-chat', 'friend-updated'],
  data() {
    return {
      loading: false,
      actionLoading: false,
      friendshipStatus: 'none',
      onlineStatus: null
    }
  },
  watch: {
    show(newVal) {
      if (newVal && this.userId) {
        this.loadUserInfo()
      }
    }
  },
  methods: {
    async loadUserInfo() {
      this.loading = true
      try {
        // 獲取好友狀態
        const statusData = await apiGet(`friends/status/${this.userId}`)
        if (statusData.status === 'success') {
          this.friendshipStatus = statusData.is_friend ? 'accepted' : statusData.status
        }
        
        // 獲取在線狀態
        const onlineData = await apiGet(`user-status/${this.userId}`)
        if (onlineData.status === 'success') {
          this.onlineStatus = onlineData.is_online
        }
      } catch (error) {
        console.error('Error loading user info:', error)
      } finally {
        this.loading = false
      }
    },
    
    async addFriend() {
      this.actionLoading = true
      try {
        const data = await apiPost('friends/add', { friend_id: this.userId })
        if (data.status === 'success') {
          this.friendshipStatus = 'pending_sent'
          this.$emit('friend-updated')
          alert('好友請求已發送！')
        } else {
          alert(data.message || '發送好友請求失敗')
        }
      } catch (error) {
        console.error('Error adding friend:', error)
        alert('發送好友請求失敗')
      } finally {
        this.actionLoading = false
      }
    },
    
    async acceptFriend() {
      this.actionLoading = true
      try {
        const data = await apiPost('friends/accept', { friend_id: this.userId })
        if (data.status === 'success') {
          this.friendshipStatus = 'accepted'
          this.$emit('friend-updated')
          alert('已成為好友！')
        } else {
          alert(data.message || '接受好友請求失敗')
        }
      } catch (error) {
        console.error('Error accepting friend:', error)
        alert('接受好友請求失敗')
      } finally {
        this.actionLoading = false
      }
    },
    
    startChat() {
      this.$emit('start-chat', {
        user_id: this.userId,
        user_name: this.userName,
        user_nickname: this.userNickname
      })
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal {
  background: rgba(0,0,0,0.5);
}

.user-avatar {
  position: relative;
  display: inline-block;
}

.avatar-circle {
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.avatar-circle.large {
  width: 80px;
  height: 80px;
  font-size: 32px;
}

.online-indicator {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ccc;
  border: 3px solid #fff;
}

.online-indicator.online {
  background: #28a745;
}

.user-name {
  font-weight: 600;
}

.action-buttons {
  margin-top: 20px;
}

.badge {
  font-size: 14px;
}
</style>

