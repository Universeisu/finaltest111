import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL; // Make sure this is correct
const instance = axios.create({
  baseURL: baseURL, // Corrected here
  headers: {
    "Content-Type": "application/json",
  },
});



export default instance;