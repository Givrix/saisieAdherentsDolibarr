<template>
  
  <div class="list row">
    <div class="col-md-6">
      <form class="submit-form" v-on:submit.prevent="saveAdherent">
        <Teleport to="#dateForm">
          <span class="navbar-text">Jour d'adhésion</span>
            <div class="form-group">
                <input
                  type="date"
                  class="form-control"
                  id="subdate"
                  required
                  v-model="subdate"
                  name="subdate"
                  ref="subdate"
                  v-on:change="checkDate"
                />
          </div>
        </Teleport>
        <div v-show="!submitted">
          
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
              ref="firstname"
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
          <div class="form-group" v-show="nu_adherent.moralPerson == 'mor'">
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
          <label for="payMode">Mode de paiement</label>
          <div class="form-check">
              <label class="form-check-label" for="payModeCash">Espèces</label>
              <input
                type="radio"
                class="form-check-input"
                id="payModeCash"
                required
                v-model="subscription.payMode"
                name="payMode"
                value='cash'
                checked
              />
            </div>
            <div class="form-check">
              <label class="form-check-label"  for="payModeCard">CB</label>
              <input
                type="radio"
                class="form-check-input"
                id="payModeCard"
                required
                v-model="subscription.payMode"
                name="payMode"
                value="card"
              />
          </div>
          <div class="form-check">
              <label class="form-check-label"  for="payModeCheck">Chèque</label>
              <input
                type="radio"
                class="form-check-input"
                id="payModeCheck"
                required
                v-model="subscription.payMode"
                name="payMode"
                value="check"
              />
          </div>
    
          <button type="submit" ref="apply"  :disabled="!isValid" class="btn btn-success">Appliquer</button>
        </div>
    
        <div v-show="submitted">
          <h4>Saisie réussie !</h4>
          <button class="btn btn-success" @click="newAdherent" ref="new">Nouveau</button>
        </div>
      </form>
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
          moralPerson: "phy",
          last_subscription_date_end: null
        },
        subscription: {
          amount: '',
          payMode: "cash"
        },
        submitted: false,
        adherents: [],
        currentAdherent: null,
        currentIndex: -1,
        editMode: false,
        subdate: null,
        subDatetime: null,
        isValid: false,
      };
    },
    methods: {
      getAdhesionDate(){
        if (this.debug) {console.log(this.subDatetime)}
        return this.subDatetime;

      },
      saveAdherent() {
        this.nu_adherent.lastname = this.nu_adherent.lastname.toLocaleUpperCase();
        var data = {
          firstname: this.nu_adherent.firstname,
          lastname: this.nu_adherent.lastname,
          societe: this.nu_adherent.societe,
          email: this.nu_adherent.email,
          morphy: this.nu_adherent.moralPerson,
          statut: 1,
          typeid: this.$adherent_type
        };
        if (!this.editMode){
          AdherentDataService.create(this.$http,data)
            .then(response => {
              this.nu_adherent.id = response.data;
              if (this.debug) {console.log(response.data);}
              this.createThirdparty(response.data);
              if (this.subscription.amount){
                this.saveSubscription(response.data);
              }
              this.submitted = true;
              this.adherents = [];
              this.$nextTick(() => {
                this.$refs.new.focus();
              })
            })
            .catch(e => {
              if (this.debug) {console.log(e);}
            });
        }else{
          AdherentDataService.update(this.$http,this.nu_adherent.id, data)
            .then(response => {
              if (this.debug) {console.log(response.data);}
              this.updateThirdparty(response.data)
              if (this.subscription.amount){
                this.saveSubscription(response.data.id);
              }
              this.submitted = true;
              this.editMode = false;
              this.currentAdherent = null;
              this.adherents = [];
              this.$nextTick(() => {
                this.$refs.new.focus();
              })
            })
            .catch(e => {
              if (this.debug) {console.log(e);}
            });
        }
      },
      createThirdparty(id){
        ThirdpartyDataService.create(this.$http,this.nu_adherent)
            .then(response => {
              if (this.debug) {console.log(response.data);}
              AdherentDataService.update(this.$http,id, {socid:response.data})
                .then(up_response => {
                  if (this.debug) {console.log(up_response.data);}
                })
                .catch(e => {
                  if (this.debug) {console.log(e);}
                });
            })
            .catch(e => {
              if (this.debug) {console.log(e);}
            });
      },
      
      updateThirdparty(adherent){
        if (adherent.fk_soc){
          ThirdpartyDataService.update(this.$http,adherent.fk_soc,this.nu_adherent)
              .then(response => {
                if (this.debug) {console.log(response.data);}
              })
              .catch(e => {
                if (this.debug) {console.log(e);}
              });
         
        }else{
          ThirdpartyDataService.create(this.$http,this.nu_adherent)
              .then(response => {
                if (this.debug) {console.log(response.data);}
                AdherentDataService.update(this.$http,adherent.id, {socid:response.data})
                  .then(up_response => {
                    if (this.debug) {console.log(up_response.data);}
                  })
                  .catch(e => {
                    if (this.debug) {console.log(e);}
                  });
              })
              .catch(e => {
                if (this.debug) {console.log(e);}
              });
        }
      },

      saveSubscription(id){
        var bank_account;
        var pay_mode;
        switch(this.subscription.payMode){
          case 'cash':
            bank_account = this.$cash_account;
            pay_mode = 'LIQ';
            break;
          case 'card':
            bank_account = this.$card_account;
            pay_mode = 'CB';
            break;
          case 'check':
            bank_account = this.$check_account;
            pay_mode = 'CHQ';
          break;
        }
        BanklineDataService.createLine(this.$http,bank_account,this.subDatetime.valueOf()/1000, this.subscription.amount,pay_mode,"Adhésion / cotisation")
            .then(b_line => {
                if (this.debug) {console.log(b_line);}
              
              BanklineDataService.createLink(this.$http,bank_account,b_line.data, id,`${this.$base_domain}/htdocs/adherents/card.php?rowid=`,`${this.nu_adherent.firstname} ${this.nu_adherent.lastname}`,"member")
              .then(b_link => {
                if (this.debug) {console.log(b_link);}
                var start;
                var end;
                if (this.nu_adherent.last_subscription_date_end===null || parseInt(this.nu_adherent.last_subscription_date_end)*1000 < this.subDatetime){
                  start = this.subDatetime;
                  end = new Date(this.subDatetime);
                }else{
                  var subscription_date_end = parseInt(this.nu_adherent.last_subscription_date_end)*1000;
                  start = subscription_date_end;
                  end = new Date(subscription_date_end);
                }
                end.setFullYear(end.getFullYear()+1);
               
                AdherentDataService.addSubscription(this.$http,id, this.$adherent_type,start.valueOf()/1000,end.valueOf()/1000,this.subscription.amount,"Adhésion / cotisation")
                  .then(response => {
                    if (this.debug) {console.log(response.data);}
                    AdherentDataService.addSubscriptionBankline(this.$http,response.data, b_line.data)
                    .then(finish => {
                      if (this.debug) {console.log(finish.data);}
                      
                    })
                    .catch(e => {
                      if (this.debug) {console.log(e);}
                    });
                  })
                  .catch(e => {
                    if (this.debug) {console.log(e);}
                  });
              })
              .catch(e => {
                if (this.debug) {console.log(e);}
              });
            })
            .catch(e => {
              if (this.debug) {console.log(e);}
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
        this.subscription.amount = '';
        this.refreshList();
        this.setFillingFocus();

      },
      retrieveAdherents() {
        AdherentDataService.getAll(this.$http,this.nu_adherent.firstname,this.nu_adherent.lastname,this.nu_adherent.societe,this.nu_adherent.email)
          .then(response => {
            this.adherents = response.data;
            if (this.debug) {console.log(response.data);}
          })
          .catch(e => {
            if (this.debug) {console.log(e);}
            this.adherents = [];
          });
      },
  
      refreshList() {
        if (!this.editMode){
          this.retrieveAdherents();
          this.currentAdherent = null;
          this.currentIndex = -1;
        }
        
        this.isValid = (this.subDatetime != null) && (((this.nu_adherent.moralPerson == 'phy') && this.nu_adherent.firstname.length && this.nu_adherent.lastname.length ) || ((this.nu_adherent.moralPerson == 'mor') && this.nu_adherent.societe.length)) && (this.nu_adherent.email=='' || EmailValidator.validate(this.nu_adherent.email))
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
        this.nu_adherent.last_subscription_date_end = this.currentAdherent.last_subscription_date_end;
        this.editMode = true;
        this.setFillingFocus();
      },
      stopEdit(){
        this.editMode = false;
        this.nu_adherent = {
          id: null,
          firstname: "",
          lastname: "",
          societe: "",
          email: "",
          moralPerson: "phy"
        };
        this.setFillingFocus();
      },
      formatDate(dateString) {
            const date = new Date(parseInt(dateString)*1000);
                // Then specify how you want your dates to be formatted
            return new Intl.DateTimeFormat('fr-FR').format(date);
      },
      checkDate(){
        const subdate = new Date(this.subdate);
          if (subdate.valueOf()!=0 && subdate.toString() != 'Invalid Date'){
            this.subDatetime = subdate;
          }
        this.refreshList()
      },
      setFillingFocus(){
        if(this.subDatetime != null){
          this.$refs.firstname.focus();
        }else{
          this.$refs.subdate.focus();
        }
      }
    },
    mounted() {
      this.$refs.firstname.focus()
    }
  };
  </script>
  
  <style>
  .submit-form {
    max-width: 300px;
    margin: auto;
  }
  </style>
  