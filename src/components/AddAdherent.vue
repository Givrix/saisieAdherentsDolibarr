<template>
  
  <div class="list row">
    <div class="col-md-6">
      <div class="submit-form">
        <div v-if="!submitted">
          
          <label for="moralPerson">Nature de l'adhérent</label>
          <div class="form-group">
              <label class="radio-inline" >
              <input
                type="radio"
                class="form-control"
                id="moralPerson0"
                required
                v-model="nu_adherent.moralPerson"
                name="moralPerson"
                value='phy'
                checked
              />Physique
              </label>
              <label class="radio-inline" >
              <input
                type="radio"
                class="form-control"
                id="moralPerson1"
                required
                v-model="nu_adherent.moralPerson"
                name="moralPerson"
                value="mor"
              />Morale
              </label>
          </div>
          <div class="form-group" >
            <label for="lastname">Nom</label>
            <input
              type="text"
              class="form-control"
              id="lastname"
              required
              v-model.trim="nu_adherent.lastname"
              name="lastname"
              v-on:input="refreshList"
            />
            <label for="firstname">Prénom</label>
            <input
              type="text"
              class="form-control"
              id="firstname"
              required
              v-model.trim="nu_adherent.firstname"
              name="firstname"
              v-on:input="refreshList"
            />
          </div>
          <div class="form-group" v-if="nu_adherent.moralPerson == 'mor'">
            <label for="societe">Société</label>
            <input
              type="text"
              class="form-control"
              id="societe"
              required
              v-model.trim="nu_adherent.societe"
              name="societe"
              v-on:input="refreshList"
            />
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="text"
              class="form-control"
              id="email"
              required
              v-model.trim="nu_adherent.email"
              name="email"
              v-on:input="refreshList"
            />
          </div>
          <div class="form-group">
            <label for="amount">Montant</label>
            <input
              type="text"
              class="form-control"
              id="amount"
              required
              v-model.trim="subscription.amount"
              name="amount"
              v-on:input="refreshList"
            />
          </div>
    
          <button @click="saveAdherent" class="btn btn-success">Appliquer</button>
        </div>
    
        <div v-else>
          <h4>You submitted successfully!</h4>
          <button class="btn btn-success" @click="newAdherent">Add</button>
        </div>
      </div>
    </div>
    <div class="col-md-3">
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
          <div>
            <label><strong>Fin d'adhésion: </strong></label> {{(currentAdherent.last_subscription_date_end===null ? 'Néant' : formatDate(currentAdherent.last_subscription_date_end) )}}
          </div>
  
          <button v-if="!editMode" @click="editAdherent" class="badge badge-warning">Éditer</button>
          <button v-if="editMode" @click="stopEdit" class="badge badge-danger">Stop Édition</button>
        </div>
        <div v-else>
          <br />
          <p>Sélectionner un adhérent à gauche pour afficher</p>
        </div>
      </div>
      <div class="col-md-3">
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
  
        
      </div>
  </div>
  </template>
  
  <script>
import AdherentDataService from "../services/AdherentDataService";
import BanklineDataService from "../services/BanklineDataService";
import ThirdpartyDataService from "../services/ThirdpartyDataService";


  export default {
    name: "add-adherent",
    data() {
      return {
        nu_adherent: {
          id: null,
          firstname: "",
          lastname: "",
          societe: "",
          email: "",
          moralPerson: "phy"
        },
        subscription: {
          amount: ''
        },
        submitted: false,
        adherents: [],
        currentAdherent: null,
        currentIndex: -1,
        editMode: false,
      };
    },
    methods: {
      getAdhesionDate(){
        return new Date(parseInt(this.$root.subyear),parseInt(this.$root.submonth)-1, parseInt(this.$root.subday));
      },
      saveAdherent() {
        var data = {
          firstname: this.nu_adherent.firstname,
          lastname: this.nu_adherent.lastname,
          societe: this.nu_adherent.societe,
          email: this.nu_adherent.email,
          morphy: this.nu_adherent.moralPerson,
          statut: 1,
          typeid: 2
        };
        if (!this.editMode){
          AdherentDataService.create(data)
            .then(response => {
              this.nu_adherent.id = response.data;
              console.log(response.data);
              this.createThirdparty(response.data);
              if (this.subscription.amount){
                this.saveSubscription(response.data);
              }
              this.submitted = true;
            })
            .catch(e => {
              console.log(e);
            });
        }else{
          AdherentDataService.update(this.nu_adherent.id, data)
            .then(response => {
              console.log(response.data);
              if (this.subscription.amount){
                this.saveSubscription(response.data.id);
              }
              this.submitted = true;
              this.editMode = false;
            })
            .catch(e => {
              console.log(e);
            });
        }
      },
      createThirdparty(id){
        ThirdpartyDataService.create(this.nu_adherent.firstname,this.nu_adherent.lastname,this.nu_adherent.email)
            .then(response => {
              console.log(response.data);
              AdherentDataService.update(id, {socid:response.data})
                .then(up_response => {
                  console.log(up_response.data);
                })
                .catch(e => {
                  console.log(e);
                });
            })
            .catch(e => {
              console.log(e);
            });
      },

      saveSubscription(id){
        
        BanklineDataService.createLine(this.bank_account,this.getAdhesionDate().valueOf()/1000, this.subscription.amount,"LIQ","Adhésion / cotisation")
            .then(b_line => {
                console.log(b_line);
              
              BanklineDataService.createLink(this.bank_account,b_line.data, id,`${this.base_domain}/htdocs/adherents/card.php?rowid=`,`${this.nu_adherent.firstname} ${this.nu_adherent.lastname}`,"member")
              .then(b_link => {
                console.log(b_link);
                var start = this.getAdhesionDate();
                var end = this.getAdhesionDate();
                end.setFullYear(end.getFullYear()+1);
               
                AdherentDataService.addSubscription(id, "2",start.valueOf()/1000,end.valueOf()/1000,this.subscription.amount,"Adhésion / cotisation")
                  .then(response => {
                    console.log(response.data);
                    AdherentDataService.addSubscriptionBankline(response.data, b_line.data)
                    .then(finish => {
                      console.log(finish.data);
                      
                    })
                    .catch(e => {
                      console.log(e);
                    });
                  })
                  .catch(e => {
                    console.log(e);
                  });
              })
              .catch(e => {
                console.log(e);
              });
            })
            .catch(e => {
              console.log(e);
            });

      },

      newAdherent() {
        this.submitted = false;
        this.nu_adherent = {
          id: null,
          firstname: "",
          lastname: "",
          societe: "",
          email: "",
          moralPerson: "phy"
        };
        this.subscription = {};
        this.refreshList();

      },
      retrieveAdherents() {
        AdherentDataService.getAll(this.nu_adherent.firstname,this.nu_adherent.lastname,this.nu_adherent.societe,this.nu_adherent.email)
          .then(response => {
            this.adherents = response.data;
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
            this.adherents = [];
          });
      },
  
      refreshList() {
        if (!this.editMode){
          this.retrieveAdherents();
          this.currentAdherent = null;
          this.currentIndex = -1;
        }
      },
  
      setActiveAdherent(adherent, index) {
        if(!this.editMode){
          this.currentAdherent = adherent;
          this.currentIndex = adherent ? index : -1;
        }
      },
      editAdherent(){
        this.nu_adherent.email = this.currentAdherent.email;
        this.nu_adherent.firstname = this.currentAdherent.firstname;
        this.nu_adherent.lastname = this.currentAdherent.lastname;
        this.nu_adherent.societe = this.currentAdherent.societe;
        this.nu_adherent.moralPerson = this.currentAdherent.morphy;
        this.nu_adherent.id = this.currentAdherent.id;
        this.editMode = true;
      },
      stopEdit(){
        this.editMode = false;
        this.nu_adherent.id = null;
      },
      formatDate(dateString) {
            const date = new Date(parseInt(dateString)*1000);
                // Then specify how you want your dates to be formatted
            return new Intl.DateTimeFormat('fr-FR').format(date);
      }
    },
    mounted() {
      this.retrieveAdherents();
    }
  };
  </script>
  
  <style>
  .submit-form {
    max-width: 300px;
    margin: auto;
  }
  </style>
  