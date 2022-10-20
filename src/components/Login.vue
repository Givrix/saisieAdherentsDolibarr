<template>
   <div class="container text-center">
      <h2>Entrez vos identifiants Dolibarr pour poursuivre.</h2>

      <div class="row">
        <div class="col-md-6 offset-md-3">
          <form v-on:submit.prevent="validateBeforeSubmit">
            <div class="form-group text-left">
              <label class="custom-label control-label">Identifiant</label>
              <input class="form-control" type="text" name="login" v-model.trim="login">
              <span class="error help-block" ></span>

              <label class="custom-label control-label">Mot de passe</label>
              <input class="form-control password-field" type="password" name="password" v-model.trim="password">
              <span class="error help-block" ></span>
            </div>
            <div class="text-danger" v-if="error"><p>Mot de passe incorrect.</p></div>
            <button class="btn btn-primary" type="submit">Se connecter</button>
          </form>
        </div>
      </div>
    </div>
</template>

<script>
import storageHelper from 'storage-helper'
import LoginDataService from "../services/LoginDataService";

export default {
  name: "login",
  created() {},
  data() {
    return {
      error: null,
      login: null,
      password: null
    };
  },
  props: {},
  methods: {
    validateBeforeSubmit () {
      LoginDataService.login(this.login, this.password)
            .then(response => {
              if (response.data.success) {
                this.error = false
                storageHelper.setItem('dolapikey', response.data.success.token)
                LoginDataService.setToken(response.data.success.token)
                this.$router.push('add')
              } else {
                this.error = true
              }
            })
            .catch(e => {
              console.log(e);
            });
      
    }

  },
};
</script>

<style lang="scss" scoped></style>