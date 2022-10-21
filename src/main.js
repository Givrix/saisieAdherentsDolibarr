import { createApp } from 'vue'
import App from './App.vue'
// Import our custom CSS
import './scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'


import config from "./config";


//import './assets/main.css'
import router from './router'

//const app = createApp(App).use(router).mount('#app')
 
const app = createApp(App);

app.config.globalProperties.base_domain = `http://${config.domain}`;
app.config.globalProperties.bank_account = config.cash_account;


app.use(router).mount('#app');

