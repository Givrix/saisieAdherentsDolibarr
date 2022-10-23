
class ThirdpartyDataService {
    async create(http,adherent) {
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
        return await http.post(`/thirdparties`, thirdparty);
    }
    async update(http,id, adherent) {
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
        return await http.put(`/thirdparties/${id}`, thirdparty);
    }
    
}
export default new ThirdpartyDataService();