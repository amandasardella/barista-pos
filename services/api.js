import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // endereço do seu backend
});

export default api;
