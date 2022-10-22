import http from "../http-common";



class ThirdpartyDataService {
    create(adherent) {
      var name = ''
      if(adherent.moralPerson == 'phy'){
        name = adherent.firstname+' '+adherent.lastname
      }else{
        name = adherent.societe
      }
      var thirdparty = {
        name: name,
        lastname: adherent.lastname,
        firstname: adherent.firstname,
        email: adherent.email,
        client: "1",
        prospect: 0,
        fournisseur: "0"
      }
        console.log(thirdparty)
        return http.post(`/thirdparties`, thirdparty);
    }
    update(id, adherent) {
      var name = ''
      if(adherent.moralPerson == 'phy'){
        name = adherent.firstname+' '+adherent.lastname
      }else{
        name = adherent.societe
      }
      var thirdparty = {
        name: name,
        lastname: adherent.lastname,
        firstname: adherent.firstname,
        email: adherent.email
      }
        console.log(thirdparty)
        return http.put(`/thirdparties/${id}`, thirdparty);
    }
    
}
export default new ThirdpartyDataService();