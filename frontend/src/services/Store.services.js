import api from "./api"; // Ensure api.js is set up properly

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STORE_API = `${BASE_URL}${import.meta.env.VITE_STORE_API}`;

// Create a new store
const createStore = async (storeData) => {
  try {
    const response = await api.post(STORE_API, storeData);
    return response;
  } catch (error) {
    console.error("Failed to create store:", error);
    throw error;
  }
};

// Get all stores
const getAllStores = async () => {
  try {
    const response = await api.get(STORE_API);
    return response;
  } catch (error) {
    console.error("Failed to get all stores:", error);
    throw error;
  }
};

// Get store by ID
const getStoreById = async (storeId) => {
  try {
    const response = await api.get(`${STORE_API}/${storeId}`);
    return response.data; // คืนค่าข้อมูลจากการตอบกลับ
  } catch (error) {
    console.error(`ไม่สามารถดึงร้านค้าด้วย id ${storeId}:`, error);
    throw error; // ขว้างข้อผิดพลาดเพื่อให้สามารถจัดการเพิ่มเติมหากต้องการ
  }
};



// Update store by ID
const updateStore = async (storeId, storeData) => {
  try {
    const response = await api.put(`${STORE_API}/${storeId}`, storeData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update store with id ${storeId}:`, error);
    throw error;
  }
};

// Delete store by ID
const deleteStore = async (storeId) => {
  try {
    const response = await api.delete(`${STORE_API}/${storeId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete store with id ${storeId}:`, error);
    throw error;
  }
};

// Export all StoreService functions
const StoreService = {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore,
};

export default StoreService;
