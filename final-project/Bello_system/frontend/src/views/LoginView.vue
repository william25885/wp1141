<template>
  <div class="login-form">
    <h2 class="mb-4">登入</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label class="form-label">帳號:</label>
        <input type="text" class="form-control custom-input" v-model="account">
      </div>
      
      <div class="mb-3">
        <label class="form-label">密碼:</label>
        <input type="password" class="form-control custom-input" v-model="password">
      </div>
      
      <div class="text-center">
        <button type="submit" class="btn btn-primary">登入</button>
      </div>
    </form>
    
    <!-- 分隔線 -->
    <div class="divider my-4">
      <span>或</span>
    </div>
    
    <!-- Google 登入按鈕 -->
    <div class="text-center">
      <!-- LINE 內嵌瀏覽器提示 -->
      <div v-if="isLineBrowser" class="line-browser-warning alert alert-warning">
        <p class="mb-2"><strong>⚠️ 檢測到 LINE 內嵌瀏覽器</strong></p>
        <p class="mb-2 small">Google 登入在 LINE 內嵌瀏覽器中無法使用。請使用以下方式：</p>
        <button 
          class="btn btn-sm btn-primary" 
          @click="openInExternalBrowser"
        >
          在外部瀏覽器開啟
        </button>
      </div>
      
      <!-- 正常 Google 登入按鈕 -->
      <div v-else>
        <div id="google-signin-btn" class="google-btn-container"></div>
        <p v-if="googleLoading" class="text-muted mt-2">正在載入 Google 登入...</p>
        <p v-if="googleError" class="text-danger mt-2">{{ googleError }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { apiUrl } from '@/config/api'
import { setAuth, apiGet, apiPost } from '@/utils/api'

export default {
  name: 'LoginView',
  data() {
    return {
      account: '',
      password: '',
      googleClientId: null,
      googleLoading: true,
      googleError: null,
      isLineBrowser: false
    }
  },
  mounted() {
    this.detectLineBrowser()
    if (!this.isLineBrowser) {
      this.initGoogleSignIn()
    } else {
      this.googleLoading = false
    }
  },
  methods: {
    detectLineBrowser() {
      // 檢測是否為 LINE 內嵌瀏覽器
      const userAgent = navigator.userAgent || navigator.vendor || window.opera
      // LINE 內嵌瀏覽器的 User-Agent 通常包含 "Line" 或 "LINE"
      this.isLineBrowser = /Line|LINE/i.test(userAgent) && !/Chrome|Safari|Firefox|Edge/i.test(userAgent.split('Line')[0])
      
      // 也檢測其他可能被封鎖的內嵌瀏覽器
      if (!this.isLineBrowser) {
        // 檢測 Facebook、Instagram 等內嵌瀏覽器
        this.isLineBrowser = /FBAN|FBAV|Instagram|FB_IAB|FB4A/i.test(userAgent)
      }
    },
    
    openInExternalBrowser() {
      // 獲取當前 URL
      const currentUrl = window.location.href
      
      // 嘗試使用不同的方式打開外部瀏覽器
      // 方法1: 使用 window.open (某些瀏覽器可能不支援)
      const newWindow = window.open(currentUrl, '_blank')
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // 方法2: 顯示提示讓用戶手動複製連結
        alert(
          '請複製以下網址，並在外部瀏覽器（如 Chrome、Safari）中開啟：\n\n' + 
          currentUrl + 
          '\n\n或者點擊右上角的選單，選擇「在瀏覽器中開啟」'
        )
      }
    },
    
    async initGoogleSignIn() {
      try {
        // 從後端獲取 Google Client ID
        const response = await apiGet('auth/google/client-id')
        
        if (response.status === 'success' && response.client_id) {
          this.googleClientId = response.client_id
          this.googleLoading = false
          
          // 等待 Google SDK 載入完成
          this.waitForGoogleSDK()
        } else {
          this.googleLoading = false
          this.googleError = 'Google 登入未配置'
        }
      } catch (error) {
        console.error('Failed to get Google Client ID:', error)
        this.googleLoading = false
        this.googleError = 'Google 登入暫時不可用'
      }
    },
    
    waitForGoogleSDK() {
      // 檢查 Google SDK 是否已載入
      if (window.google && window.google.accounts) {
        this.renderGoogleButton()
      } else {
        // 等待 SDK 載入
        setTimeout(() => this.waitForGoogleSDK(), 100)
      }
    },
    
    renderGoogleButton() {
      if (!this.googleClientId) return
      
      window.google.accounts.id.initialize({
        client_id: this.googleClientId,
        callback: this.handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: true
      })
      
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        {
          theme: 'outline',
          size: 'large',
          width: 300,
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        }
      )
    },
    
    async handleGoogleCallback(response) {
      try {
        // 發送 Google credential 到後端驗證
        const result = await apiPost('auth/google', {
          credential: response.credential
        })
        
        if (result.status === 'success' && result.token) {
          // 存儲 token 和用戶信息
          setAuth(result.token, result.user)
          this.$router.push(result.user.role === 'Admin' ? '/admin-lobby' : '/lobby')
        } else {
          alert(result.message || 'Google 登入失敗')
        }
      } catch (error) {
        console.error('Google login error:', error)
        alert('Google 登入失敗，請稍後再試')
      }
    },
    
    async handleLogin() {
      try {
        const response = await fetch(apiUrl('login'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ 
            account: this.account, 
            password: this.password 
          }),
        })
        
        const data = await response.json()
        if (data.status === 'success' && data.token) {
          // 存儲 token 和用戶信息
          setAuth(data.token, data.user)
          this.$router.push(data.user.role === 'Admin' ? '/admin-lobby' : '/lobby')
        } else {
          alert('帳號或密碼錯誤')
        }
      } catch (error) {
        alert('帳號或密碼錯誤')
      }
    }
  }
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #6c757d;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #dee2e6;
}

.divider span {
  padding: 0 15px;
}

.google-btn-container {
  display: flex;
  justify-content: center;
  min-height: 44px;
}

.line-browser-warning {
  text-align: left;
  border-left: 4px solid #ffc107;
  background-color: #fff3cd;
  border-color: #ffc107;
}

.line-browser-warning p {
  margin-bottom: 0.5rem;
}

.line-browser-warning .small {
  font-size: 0.875rem;
  color: #856404;
}
</style>
