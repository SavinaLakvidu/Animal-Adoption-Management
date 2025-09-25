import axios from "axios";
import { baseURL } from "../common/SummaryApi";

const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: false, // can enable later if cookies needed
});

export default Axios;
