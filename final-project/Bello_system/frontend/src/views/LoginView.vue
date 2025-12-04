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
  </div>
</template>

<script>
import { apiUrl } from '@/config/api'
import { setAuth, getUser } from '@/utils/api'

export default {
  name: 'LoginView',
  data() {
    return {
      account: '',
      password: ''
    }
  },
  created() {
    // 如果用戶已登入，直接導向到 lobby
    const user = getUser()
    if (user) {
      this.$router.push(user.role === 'Admin' ? '/admin-lobby' : '/lobby')
    }
  },
  methods: {
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
</style>
