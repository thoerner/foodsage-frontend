import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL,
});

const lookupProduct = async (barcode: string) => {
  const response = await api.get(`/inventory/lookup/${barcode}`);
  return response.data;
};

export { lookupProduct };
