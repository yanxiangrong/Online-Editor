import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import App from './App.vue'
import router from "./router";
import VueClipboard from 'vue3-clipboard'


const app = createApp(App)
app.use(ElementPlus, { locale })
app.use(VueClipboard, {autoSetContainer: true,})
app.use(router)
app.mount('#app')
