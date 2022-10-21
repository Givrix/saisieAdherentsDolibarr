<template>
  
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">Saisie Adhérents Dolibarr</router-link>
      <div class="navbar-nav mr-auto">
        <!-- <li class="nav-item">
          <router-link to="/adherents" class="nav-link">Adherents</router-link>
        </li> -->
        <li class="nav-item">
          <router-link to="/add" class="nav-link">Add</router-link>
        </li>
      </div>
          
        
      <form class="navbar-form d-flex justify-content-end">
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

            

            
    </nav>

    <div class="container-fluid mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "saisie-adherents",
  data() {
      return {
        subdate: null,
        subDatetime: null
      }
  },
  methods: {
    checkDate(){
      const subdate = new Date(this.subdate);
        if (subdate.valueOf()!=0 && subdate.toString() != 'Invalid Date'){
          this.subDatetime = subdate;
        }
    }
  }
};
</script>