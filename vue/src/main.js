import { createApp } from 'vue'
import App from './App.vue'
import ToastPlugin from './services/toast.js'
import './assets/style.css'

// O plugin expõe this.$toast em todos os componentes (serviço global).
createApp(App).use(ToastPlugin).mount('#app')
