import http from "../http-common";


http.interceptors.request.use(request => {
  console.log('Starting Request', JSON.stringify(request, null, 2))
  return request
})

http.interceptors.response.use(response => {
  console.log('Response:', JSON.stringify(response, null, 2))
  return response
})

class AdherentDataService {
  getAll(firstname,lastname,societe,email) {
    let filters = ''
    if (firstname != ''){
      filters += `(SOUNDEX(t.firstname) = SOUNDEX('${firstname}') OR t.firstname LIKE '%${firstname}%')`;

    }
    if (lastname != ''){
      if (filters != ''){
        filters += ' AND ';
      }
      filters += `(SOUNDEX(t.lastname) = SOUNDEX('${lastname}') OR t.lastname LIKE '%${lastname}%')`;

    }
    if (email != ''){
      if (filters != ''){
        filters += ' AND ';
      }
      filters += `(SOUNDEX(t.email) = SOUNDEX('${email}') OR t.email LIKE '%${email}%')`;

    }
    if (societe != ''){
      if (filters != ''){
        filters += ' AND ';
      }
      filters += `(SOUNDEX(t.societe) = SOUNDEX('${societe}') OR t.societe LIKE '%${societe}%')`;

    }
    console.log(filters);
    const params = new URLSearchParams({
        sortfield: 't.rowid',
        sortorder: 'ASC',
        limit: '10',
        sqlfilters: filters
    });
    return http.get("/members",{
      params
    });
  }

  get(id) {
    
    return http.get(`/members/${id}`);
  }

  create(data) {
    console.log(data)
    return http.post("/members", data);
  }

  async update(id, data) {
    console.log(data)

    return await http.put(`/members/${id}`, data);
  }

  addSubscription(id,fk_type,start_date,end_date,amount,label) {
    var subscription = {
      fk_type: fk_type,
      start_date: start_date,
      end_date: end_date,
      amount: amount,
      label: label
    }
    console.log(subscription)
    return http.post(`/members/${id}/subscriptions`, subscription);
    
  }
  addSubscriptionBankline(id,fk_bank){
    console.log(fk_bank)
    return http.put(`/subscriptions/${id}`, {
      fk_bank: fk_bank,});
  }
  

  
}

export default new AdherentDataService();
