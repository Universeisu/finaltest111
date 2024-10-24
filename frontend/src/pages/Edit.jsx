import { useState, useEffect } from "react"; // นำเข้า useState และ useEffect จาก React
import { useNavigate, useParams } from "react-router-dom"; // นำเข้า useNavigate และ useParams
import StoreService from "../services/Store.services"; // นำเข้า StoreService
import Swal from "sweetalert2";

function Edit() {
  const navigate = useNavigate();
  const { storeId } = useParams(); // ดึง storeId จาก URL
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        const response = await StoreService.getStoreById(storeId);
        setStore(response);
      } catch (error) {
        console.error("Error fetching store:", error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch store data.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [storeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await StoreService.updateStore(storeId, store);
      Swal.fire({
        title: 'Success',
        text: 'Store updated successfully',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      navigate("/"); // เปลี่ยนเส้นทางไปยังหน้า Home หลังจากบันทึก
    } catch (error) {
      console.error("Error updating store:", error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update store.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    navigate("/"); // เปลี่ยนเส้นทางไปยังหน้า Home
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!store) {
    return <div>No store found!</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl text-center font-bold text-white bg-[#008163] shadow-lg p-4 rounded mb-6">
        Edit Store
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["storeName", "address", "latitude", "longitude", "deliveryRadius"].map((field, index) => (
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
            className="get-location-btn text-white bg-[#008163] border-2 border-white py-2 px-4 rounded hover:bg-[#006e52] transition duration-300"
            type="submit"
          >
            Update Store
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

export default Edit;
