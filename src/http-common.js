import axios from "axios";
import config from "./config";

export default axios.create({
  baseURL: `${config.protocol}://${config.domain}/htdocs/api/index.php`});