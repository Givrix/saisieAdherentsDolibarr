

class AdherentDataService {
  async getAll(http,firstname,lastname,societe,email) {
    let filters = ''
    if (firstname != ''){
      // SOUNDEX(t.firstname) = SOUNDEX('${firstname}') OR 
      filters += `(t.firstname:LIKE:'%${firstname}%')`;

    }
    if (lastname != ''){
      if (filters != ''){
        filters += ' AND ';
      }
      // SOUNDEX(t.lastname) = SOUNDEX('${lastname}') OR 
      filters += `(t.lastname:LIKE:'%${lastname}%')`;

    }
    if (email != ''){
      if (filters != ''){
        filters += ' AND ';
      }
      // SOUNDEX(t.email) = SOUNDEX('${email}') OR 
      filters += `(t.email:LIKE:'%${email}%')`;

    }
    if (societe != ''){
      if (filters != ''){
        filters += ' AND ';
      }
      // SOUNDEX(t.societe) = SOUNDEX('${societe}') OR 
      filters += `(t.societe:LIKE:'%${societe}%')`;

    }
    console.log(filters);
    const params = new URLSearchParams({
        sortfield: 't.rowid',
        sortorder: 'ASC',
        limit: '30',
        sqlfilters: filters
    });
    return await http.get("/members",{
      params
    });
  }

  async get(http,id) {
    
    return await http.get(`/members/${id}`);
  }

  async create(http,data) {
    console.log(data);
    return await http.post("/members", data);
  }

  async update(http,id, data) {
    console.log(data)

    return await http.put(`/members/${id}`, data);
  }

  async addSubscription(http,id,fk_type,start_date,end_date,amount,label) {
    var subscription = {
      fk_type: fk_type,
      start_date: start_date,
      end_date: end_date,
      amount: amount,
      label: label
    }
    console.log(subscription)
    return await http.post(`/members/${id}/subscriptions`, subscription);
    
  }
  async addSubscriptionBankline(http,id,fk_bank){
    console.log(fk_bank)
    return await http.put(`/subscriptions/${id}`, {
      fk_bank: fk_bank,});
  }
  

  
}

export default new AdherentDataService();
