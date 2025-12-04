<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <router-link class="navbar-brand" :to="homeRoute">Bello</router-link>
        <div class="d-flex" v-if="!isAuthPage">
          <template v-if="!isLoggedIn">
            <router-link to="/register" class="btn btn-outline-primary">註冊新帳號</router-link>
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
</style>