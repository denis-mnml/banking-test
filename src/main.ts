import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueTablerIcons from 'vue-tabler-icons'
import '@/assets/scss/main.scss'

const app = createApp(App)

app.use(router)
app.use(VueTablerIcons)

app.mount('#app')
