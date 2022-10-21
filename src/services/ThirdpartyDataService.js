import http from "../http-common";



class ThirdpartyDataService {
    create(lastname,firstname,email) {
      var thirdparty = {
        name: firstname+' '+lastname,
        lastname: lastname,
        firstname: firstname,
        email: email,
        client: "1",
        prospect: 0,
        fournisseur: "0"
      }
        console.log(thirdparty)
        return http.post(`/thirdparties`, thirdparty);
    }
    update(id, lastname,firstname,email) {
      var thirdparty = {
        name: firstname+' '+lastname,
        lastname: lastname,
        firstname: firstname,
        email: email
      }
        console.log(thirdparty)
        return http.put(`/thirdparties/${id}`, thirdparty);
    }
    
}
export default new ThirdpartyDataService();