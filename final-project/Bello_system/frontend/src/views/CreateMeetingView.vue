<template>
    <div class="create-meeting-form">
      <h2 class="mb-4">建立新聚會</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label required">聚會類型:</label>
          <select class="form-select custom-input" v-model="formData.content" required>
            <option value="">請選擇聚會類型</option>
            <option v-for="type in meetingTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>
  
        <div class="mb-3">
          <label class="form-label required">語言:</label>
          <div class="d-flex flex-wrap gap-2">
            <div v-for="lang in languages" :key="lang" class="form-check">
              <input 
                type="checkbox" 
                class="form-check-input" 
                :value="lang"
                v-model="formData.languages"
              >
              <label class="form-check-label">{{ lang }}</label>
            </div>
          </div>
        </div>
  
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label required">城市:</label>
              <input type="text" class="form-control custom-input" v-model="formData.city" required>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label required">地點:</label>
              <input type="text" class="form-control custom-input" v-model="formData.place" required>
            </div>
          </div>
        </div>
  
        <div class="row">
          <div class="col-md-4">
            <div class="mb-3">
              <label class="form-label required">日期:</label>
              <input type="date" class="form-control custom-input" v-model="formData.date" required>
            </div>
          </div>
          <div class="col-md-4">
            <div class="mb-3">
              <label class="form-label required">開始時間:</label>
              <input type="time" class="form-control custom-input" v-model="formData.start_time" required>
            </div>
          </div>
          <div class="col-md-4">
            <div class="mb-3">
              <label class="form-label required">結束時間:</label>
              <input type="time" class="form-control custom-input" v-model="formData.end_time" required>
            </div>
          </div>
        </div>
  
        <div class="mb-4">
          <label class="form-label required">人數上限:</label>
          <input 
            type="number" 
            class="form-control custom-input" 
            v-model="formData.max_participants"
            min="2"
            max="20"
            required
          >
        </div>
  
        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-primary">建立聚會</button>
          <router-link to="/lobby" class="btn btn-outline-secondary">返回</router-link>
        </div>
      </form>
    </div>
  </template>
  
  <script>
import { apiPost, getUser } from '@/utils/api'
  export default {
    name: 'CreateMeetingView',
    data() {
      return {
        meetingTypes: ['午餐', '咖啡/下午茶', '晚餐', '喝酒', '語言交換'],
        languages: ['中文', '台語', '客語', '原住民語', '英文', '日文', '韓文', 
                   '法文', '德文', '西班牙文', '俄文', '阿拉伯文', '泰文', '越南文', '印尼文'],
        formData: {
          content: '',
          languages: [],
          city: '',
          place: '',
          date: '',
          start_time: '',
          end_time: '',
          max_participants: 2,
          holder_id: null
        }
      }
    },
    created() {
      // 使用新的 getUser 函數
      const user = getUser()
      if (!user || !user.user_id) {
        this.$router.push('/login')
        return
      }
      
      this.formData.holder_id = user.user_id
    },
    methods: {
      async handleSubmit() {
        if (this.formData.languages.length === 0) {
          alert('請至少選擇一種語言')
          return
        }
  
        try {
          // 使用新的 apiPost 函數，會自動添加 token
          const data = await apiPost('create-meeting', this.formData)
          
          if (data.status === 'success') {
            alert('聚會建立成功！')
            this.$router.push('/my-meetings')
          } else {
            alert(data.message || '建立聚會失敗')
          }
        } catch (error) {
          console.error('建立聚會錯誤:', error)
          if (error.message && error.message.includes('token')) {
            alert('認證失敗，請重新登入')
            this.$router.push('/login')
          } else {
            alert('建立聚會失敗，請稍後再試')
          }
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .create-meeting-form {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .required:after {
    content: " *";
    color: red;
  }
  
  .custom-input {
    background-color: #f8f9fa;
    border: 2px solid #dee2e6;
    padding: 0.5rem;
  }
  
  .custom-input:focus {
    background-color: #fff;
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }
  </style>