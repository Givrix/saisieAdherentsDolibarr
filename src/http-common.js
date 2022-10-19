import axios from "axios";
import config from "./config";

export default axios.create({
  baseURL: `http://${config.domain}/htdocs/api/index.php`,
  headers: {
    "DOLAPIKEY": config.dolapikey
  }
});
