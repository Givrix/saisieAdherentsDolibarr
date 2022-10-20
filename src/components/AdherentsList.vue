<template>
    <div class="list row">
      <div class="col-md-12">
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="Search by title"
            v-model="title"/>
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button"
              @click="searchTitle"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <h4>Adherents List</h4>
        <ul class="list-group">
          <li class="list-group-item"
            :class="{ active: index == currentIndex }"
            v-for="(adherent, index) in adherents"
            :key="index"
            @click="setActiveAdherent(adherent, index)"
          >
            {{ adherent.firstname+" "+adherent.lastname }}
          </li>
        </ul>
  
        <button class="m-3 btn btn-sm btn-danger" @click="removeAllAdherents">
          Remove All
        </button>
      </div>
      <div class="col-md-4">
        <div v-if="currentAdherent">
          <h4>Adherent</h4>
          <div>
            <label><strong>Prénom:</strong></label> {{ currentAdherent.firstname }}
          </div>
          <div>
            <label><strong>Nom:</strong></label> {{ currentAdherent.lastname }}
          </div>
          <div>
            <label><strong>Email:</strong></label> {{ currentAdherent.email }}
          </div>
  
          <router-link :to="'/adherents/' + currentAdherent.id" class="badge badge-warning">Edit</router-link>
        </div>
        <div v-else>
          <br />
          <p>Please click on a Adherent...</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import AdherentDataService from "../services/AdherentDataService";
  
  export default {
    name: "adherents-list",
    data() {
      return {
        adherents: [],
        currentAdherent: null,
        currentIndex: -1,
        title: ""
      };
    },
    methods: {
      retrieveAdherents() {
        AdherentDataService.getAll()
          .then(response => {
            this.adherents = response.data;
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      },
  
      refreshList() {
        this.retrieveAdherents();
        this.currentAdherent = null;
        this.currentIndex = -1;
      },
  
      setActiveAdherent(adherent, index) {
        this.currentAdherent = adherent;
        this.currentIndex = adherent ? index : -1;
      },
  
      removeAllAdherents() {
        AdherentDataService.deleteAll()
          .then(response => {
            console.log(response.data);
            this.refreshList();
          })
          .catch(e => {
            console.log(e);
          });
      },
      
      searchTitle() {
        AdherentDataService.findByTitle(this.title)
          .then(response => {
            this.adherents = response.data;
            this.setActiveAdherent(null);
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    mounted() {
      this.retrieveAdherents();
    }
  };
  </script>
  
  <style>
  .list {
    text-align: left;
    max-width: 750px;
    margin: auto;
  }
  </style>
  