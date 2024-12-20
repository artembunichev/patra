import { createApp } from 'vue'
import App from './App.vue'
import {state} from "./state.js"
createApp(App).provide( 'state', state ).mount('#app')
