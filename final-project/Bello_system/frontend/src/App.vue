<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <router-link class="navbar-brand bello-logo" :to="homeRoute">Bello</router-link>
        <div class="d-flex">
          <template v-if="!isLoggedIn">
            <router-link v-if="$route.path !== '/register'" to="/register" class="btn btn-outline-primary me-2">註冊新帳號</router-link>
            <router-link v-if="$route.path !== '/login'" to="/login" class="btn btn-outline-secondary">登入</router-link>
          </template>
          <template v-else>
            <router-link :to="homeRoute" class="btn btn-secondary me-2">回到主頁</router-link>
            <button @click="handleLogout" class="btn btn-danger">登出</button>
          </template>
        </div>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import { getUser, clearAuth, apiPost } from '@/utils/api'

export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false,
      userRole: null,
      onlineStatusInterval: null
    }
  },
  computed: {
    homeRoute() {
      return this.userRole === 'Admin' ? '/admin-lobby' : '/lobby'
    },
    isAuthPage() {
      return ['/login', '/register'].includes(this.$route.path)
    }
  },
  created() {
    this.checkLoginStatus()
  },
  methods: {
    checkLoginStatus() {
      const user = getUser()
      if (user) {
        this.isLoggedIn = true
        this.userRole = user.role
        // 登入後開始追蹤在線狀態
        this.startOnlineStatusTracking()
      } else {
        this.isLoggedIn = false
        this.userRole = null
        this.stopOnlineStatusTracking()
      }
    },
    async updateOnlineStatus(isOnline) {
      try {
        await apiPost('online-status', { is_online: isOnline })
      } catch (error) {
        // 靜默處理錯誤
      }
    },
    startOnlineStatusTracking() {
      // 立即設置為在線
      this.updateOnlineStatus(true)
      
      // 每 30 秒更新一次在線狀態
      if (this.onlineStatusInterval) {
        clearInterval(this.onlineStatusInterval)
      }
      this.onlineStatusInterval = setInterval(() => {
        this.updateOnlineStatus(true)
      }, 30000)
    },
    stopOnlineStatusTracking() {
      if (this.onlineStatusInterval) {
        clearInterval(this.onlineStatusInterval)
        this.onlineStatusInterval = null
      }
    },
    handleLogout() {
      // 登出時設置為離線
      this.updateOnlineStatus(false)
      this.stopOnlineStatusTracking()
      clearAuth()
      this.isLoggedIn = false
      this.userRole = null
      this.$router.push('/login')
    }
  },
  watch: {
    $route() {
      this.checkLoginStatus()
    }
  },
  beforeUnmount() {
    // 關閉頁面時設置為離線
    this.updateOnlineStatus(false)
    this.stopOnlineStatusTracking()
  }
}
</script>

<style>
#app {
  font-family: 'Microsoft JhengHei', Arial, sans-serif;
}

.navbar {
  margin-bottom: 2rem;
}

.bello-logo {
  font-weight: 800 !important;
  font-size: 1.8rem !important;
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none !important;
  transition: all 0.3s ease;
  position: relative;
}

.bello-logo:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

.bello-logo::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.bello-logo:hover::after {
  width: 100%;
}
</style>