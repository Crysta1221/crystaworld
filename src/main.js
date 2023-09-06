import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import '@fontsource/ibm-plex-sans-jp';
import "@/styles/index.scss"
import VueGtag from 'vue-gtag';
import router from "./router"

createApp(App).use(router).use(VueGtag, { config: { id: "G-BET1HQG37V" }}).mount('#app')
