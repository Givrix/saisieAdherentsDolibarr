import http from "../http-common";


class BanklineDataService {
    createLine(id, date, amount, type, label) {
      var bankline = {
        date: date,
        amount: amount,
        type: type,
        label: label
      }
        console.log(bankline)
        return http.post(`/bankaccounts/${id}/lines`, bankline);
      }
    createLink(id, line_id, url_id, url, label, type) {
      var banklink = {
        url_id: url_id,
        url: url,
        label: label,
        type: type
      }
        console.log(banklink)
        return http.post(`/bankaccounts/${id}/lines/${line_id}/links`, banklink);
      } 
       
}
export default new BanklineDataService();