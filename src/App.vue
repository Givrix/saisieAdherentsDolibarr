<template>
  
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark ">
      <div  class="container-fluid">
        <router-link to="/" class="navbar-brand">Saisie Adhérents Dolibarr</router-link>
        <div class="navbar-nav mr-auto d-flex justify-content-between">
          <!-- <li class="nav-item">
            <router-link to="/adherents" class="nav-link">Adherents</router-link>
          </li> -->
          <li class="nav-item">
            <router-link to="/add" class="nav-link">Ajout</router-link>
          </li>
        </div>
            
          
        <form class="navbar-form d-flex justify-content-between">
          <span class="navbar-text">Jour d'adhésion</span>
          <div class="form-group">
              <input
                type="date"
                class="form-control"
                id="subdate"
                required
                v-model="subdate"
                name="subdate"
                v-on:change="checkDate"
              />
              </div>

            </form>
        <form v-if="connected" class="d-flex justify-content-between" >
          <button class="btn btn-sm btn-outline-secondary" @click="disconnect" type="button">Se déconnecter</button>
        </form>
      </div>  
    </nav>

    <div class="container-fluid mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>

import storageHelper from 'storage-helper'

export default {
  name: "saisie-adherents",
  created (){
    this.connected = this.checkConnected;
  },
  computed: {
    checkConnected: function(){
      if(storageHelper.getItem('dolapikey')){
        return true
      }else{
        return false
      }
    }
    
  },
  data() {
      return {
        subdate: null,
        subDatetime: null,
        connected: false
      }
  },
  methods: {
    checkDate(){
      const subdate = new Date(this.subdate);
        if (subdate.valueOf()!=0 && subdate.toString() != 'Invalid Date'){
          this.subDatetime = subdate;
        }
    },
    disconnect(){
      storageHelper.removeItem('dolapikey')
      this.connected = false;
      this.$router.push({path : '/login'})
    }

  }
};
</script>