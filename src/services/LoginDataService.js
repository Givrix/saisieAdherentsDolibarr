import http from "../http-common";

http.interceptors.request.use(request => {
  console.log('Starting Request', JSON.stringify(request, null, 2))
  return request
})

http.interceptors.response.use(response => {
  console.log('Response:', JSON.stringify(response, null, 2))
  return response
})

class LoginDataService {
    login(id,password) {
      const params = new URLSearchParams({
        login: id,
        password: password
      })
        console.log(params)
        return http.get(`/login`, {params});
      }
      setToken(token){
        http.defaults.headers.post["DOLAPIKEY"] = token;

      }

    
}
export default new LoginDataService();