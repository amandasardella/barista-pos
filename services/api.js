import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://barista-pos-rsed.vercel.app"
    : "http://localhost:3000";

const api = axios.create({
  baseURL,
});

export default api;
