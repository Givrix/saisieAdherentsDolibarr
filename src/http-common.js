import axios from "axios";
import config from "./config";
import storageHelper from 'storage-helper'

var headers = null
if (storageHelper.getItem('dolapikey')){
  headers = {
      "DOLAPIKEY": storageHelper.getItem('dolapikey')
    }
}
export default axios.create({
  baseURL: `http://${config.domain}/htdocs/api/index.php`, headers
});