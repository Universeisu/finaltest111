import { useState, useEffect } from "react"; // นำเข้า useState และ useEffect จาก React
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/StoreContext"; // นำเข้า AuthContext
import Swal from "sweetalert2";
import StoreService from "../services/Store.services"; // นำเข้า StoreService

function Add() {
  const navigate = useNavigate();
  const { currentUser } = useAuthContext(); // ดึงข้อมูลผู้ใช้จาก AuthContext
  const base_url = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // ถ้าผู้ใช้ไม่ได้ล็อกอิน ให้แสดง SweetAlert แล้วเปลี่ยนเส้นทางไปที่หน้า Login
    if (!currentUser) {
      Swal.fire({
        title: 'Unauthorized',
        text: 'Please log in to add a store.',
        icon: 'warning',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate("/login");
      });
    }
  }, [currentUser, navigate]);

  // สร้าง state สำหรับเก็บข้อมูล Store
  const [store, setStore] = useState({
    storeId: "",
    storeName: "",
    address: "",
    latitude: "",
    longitude: "",
    deliveryRadius: "",
  });

  // ฟังก์ชันจัดการการเปลี่ยนแปลงของ input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ฟังก์ชันจัดการการส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    const isEmptyField = Object.values(store).some(value => !value);
    if (isEmptyField) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all fields.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }
  
    try {
      const { storeId, storeName, address, latitude, longitude, deliveryRadius } = store;

      // เรียกใช้ createStore จาก StoreService
      const response = await StoreService.createStore(storeName, currentUser.id, address, latitude, longitude, deliveryRadius);
  
      // ตรวจสอบว่าการสร้างสำเร็จ
      if (response) {
        Swal.fire({
          title: 'Success',
          text: 'Store added successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        });
  
        // Reset form after successful addition
        setStore({
          storeId: "",
          storeName: "",
          address: "",
          latitude: "",
          longitude: "",
          deliveryRadius: "",
        });
        // Redirect to home or refresh stores
        navigate("/home"); 
      }
    } catch (error) {
      console.error("Error adding Store:", error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while adding the store: ' + error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };
  
  const handleCancel = () => {
    navigate("/"); // เปลี่ยนเส้นทางไปที่หน้า Home
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {["storeId", "storeName", "address", "latitude", "longitude", "deliveryRadius"].map((field, index) => (
          <label key={index} className="block">
            <span className="text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
            <input
              type="text"
              className="mt-1 block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-[#008163]"
              placeholder={field}
              name={field}
              onChange={handleChange}
              value={store[field]}
              style={{ backgroundColor: '#F7F7F8' }}
            />
          </label>
        ))}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            className="get-location-btn text-white bg-[#0A6847] border-2 border-white py-2 px-4 rounded hover:bg-[#006e52] transition duration-300"
            type="submit"
          >
            Add Store
          </button>

          <button
            className="get-location-btn text-white bg-[#FFA41B] border-2 border-white py-2 px-4 rounded hover:bg-[#006e52] transition duration-300"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default Add;
