import { createApp } from 'vue'
import App from './App.vue'

import storageHelper from 'storage-helper'


import http from "./http-common.js";
// Add a request interceptor
http.interceptors.request.use(request =>{
    console.log('Starting Request', JSON.stringify(request, null, 2))
  
    if (storageHelper.getItem('dolapikey')){
      const token = storageHelper.getItem('dolapikey')
      request.headers.DOLAPIKEY =  token;
    }
  
    return request;
  });

  http.interceptors.response.use(response => {
    console.log('Response:', JSON.stringify(response, null, 2))
    return response
  });

// Import our custom CSS
import './scss/styles.scss'

import "bootstrap-icons/font/bootstrap-icons.css"



import config from "./config";


//import './assets/main.css'
import router from './router'

//const app = createApp(App).use(router).mount('#app')
 
const app = createApp(App);

app.config.globalProperties.$base_domain = `${config.protocol}://${config.domain}`;
app.config.globalProperties.$bank_account = config.cash_account;
app.config.globalProperties.$adherent_type = config.adherent_type;
app.config.globalProperties.debug = config.debug;

app.config.globalProperties.$http = { ...http }


app.use(router).mount('#app');

