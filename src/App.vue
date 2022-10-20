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
          <p class="navbar-text">Jour </p>
        
      <form class="navbar-form navbar-left">
        <div class="form-group">
            <input
              type="text"
              class="form-control"
              id="subday"
              required
              v-model="subday"
              name="subday"
            />
            </div>

          </form>

            <p class="navbar-text">Mois </p>
      <form class="navbar-form navbar-left">
        <div class="form-group">
            <input
              type="text"
              class="form-control"
              id="submonth"
              required
              v-model="submonth"
              name="submonth"
            />
            </div>
          </form>

            <p class="navbar-text">Année </p>
      <form class="navbar-form navbar-left">
        <div class="form-group">
            <input
              type="text"
              class="form-control"
              id="subyear"
              required
              v-model="subyear"
              name="subyear"
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
        subday: '',
        submonth: '',
        subyear: ''
      }
  }
};
</script>