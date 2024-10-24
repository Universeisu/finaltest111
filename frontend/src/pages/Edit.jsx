import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StoreService from '../services/Store.services';

const Edit = () => {
  const { storeId } = useParams(); // รับ store ID จาก URL
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await StoreService.getStoreById(storeId); // ตรวจสอบให้แน่ใจว่าฟังก์ชันบริการนี้ถูกต้อง
        if (response.status === 200) {
          setStore(response.data);
        } else {
          // จัดการสถานะที่ไม่ใช่ 200
          console.error('Failed to fetch store:', response.status);
        }
      } catch (error) {
        console.error('Error fetching store:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [storeId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!store) {
    return <div>No store found!</div>;
  }

  return (
    <div>
      <h1>Edit Store</h1>
      <form>
        <label>
          Store Name:
          <input type="text" value={store.storeName} onChange={(e) => setStore({ ...store, storeName: e.target.value })} />
        </label>
        {/* เพิ่มฟิลด์ฟอร์มอื่นๆ ตามต้องการ */}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Edit;
