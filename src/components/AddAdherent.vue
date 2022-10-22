<template>
  
  <div class="list row">
    <div class="col-md-6">
      <form class="submit-form" v-on:submit.prevent="saveAdherent">
        <div v-if="!submitted">
          
          <label for="moralPerson">Nature de l'adhérent</label>
          <div class="form-check">
              <label class="form-check-label" for="moralPerson0">Physique</label>
              <input
                type="radio"
                class="form-check-input"
                id="moralPerson0"
                required
                v-model="nu_adherent.moralPerson"
                name="moralPerson"
                value='phy'
                checked
              />
            </div>
            <div class="form-check">
              <label class="form-check-label"  for="moralPerson1">Morale
              </label>
              <input
                type="radio"
                class="form-check-input"
                id="moralPerson1"
                required
                v-model="nu_adherent.moralPerson"
                name="moralPerson"
                value="mor"
              />
          </div>
          <div class="form-group" >
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
          </div>
          <div class="form-group" v-if="nu_adherent.moralPerson == 'mor'">
            <label for="societe">Société</label>
            <input
              type="text"
              class="form-control"
              id="societe"
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
              
              v-model.trim="subscription.amount"
              name="amount"
              v-on:input="refreshList"
            />
          </div>
    
          <button type="submit"  :disabled="!isValid" class="btn btn-success">Appliquer</button>
        </div>
    
        <div v-else>
          <h4>You submitted successfully!</h4>
          <button class="btn btn-success" @click="newAdherent">Add</button>
        </div>
      </form>
    </div>
    <div class="col-md-3">
        <div v-if="currentAdherent">
          <h4>Adherent</h4>
          <div>
            <i v-if="currentAdherent.morphy == 'phy'" class="bi bi-person-circle"></i>
            <i v-if="currentAdherent.morphy == 'mor'" class="bi bi-building"></i>
          </div>
          <div v-if="currentAdherent.morphy == 'mor'">
            <label><strong>Société:</strong></label> {{ currentAdherent.societe }}
          </div>
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
import * as EmailValidator from 'email-validator';

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
        isValid: false,
      };
    },
    methods: {
      getAdhesionDate(){
        console.log(this.$root.subDatetime)
        return this.$root.subDatetime;

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
              this.updateThirdparty(response.data)
              if (this.subscription.amount){
                this.saveSubscription(response.data.id);
              }
              this.submitted = true;
              this.editMode = false;
              this.currentAdherent = null;
            })
            .catch(e => {
              console.log(e);
            });
        }
      },
      createThirdparty(id){
        ThirdpartyDataService.create(this.nu_adherent)
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
      
      updateThirdparty(adherent){
        if (adherent.fk_soc){
          ThirdpartyDataService.update(adherent.fk_soc,this.nu_adherent)
              .then(response => {
                console.log(response.data);
              })
              .catch(e => {
                console.log(e);
              });
         
        }else{
          ThirdpartyDataService.create(this.nu_adherent)
              .then(response => {
                console.log(response.data);
                AdherentDataService.update(adherent.id, {socid:response.data})
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
        }
      },

      saveSubscription(id){
        
        BanklineDataService.createLine(this.bank_account,this.getAdhesionDate().valueOf()/1000, this.subscription.amount,"LIQ","Adhésion / cotisation")
            .then(b_line => {
                console.log(b_line);
              
              BanklineDataService.createLink(this.bank_account,b_line.data, id,`${this.base_domain}/htdocs/adherents/card.php?rowid=`,`${this.nu_adherent.firstname} ${this.nu_adherent.lastname}`,"member")
              .then(b_link => {
                console.log(b_link);
                var start = this.getAdhesionDate();
                var end = new Date(this.getAdhesionDate());
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
        this.isValid = false;
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
        
        this.isValid = (this.getAdhesionDate() != null) && (((this.nu_adherent.moralPerson == 'phy') && this.nu_adherent.firstname.length && this.nu_adherent.lastname.length ) || ((this.nu_adherent.moralPerson == 'mor') && this.nu_adherent.societe.length)) && (this.nu_adherent.email=='' || EmailValidator.validate(this.nu_adherent.email))
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
  