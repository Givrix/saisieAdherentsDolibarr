
class LoginDataService {
    async login(http,id,password) {
      const params = new URLSearchParams({
        login: id,
        password: password
      })
        console.log(params)
        return await http.get(`/login`, {params});
    }
    setToken(token){
      // http.defaults.headers.common["DOLAPIKEY"] = token;

    }

    
}
export default new LoginDataService();