// Home.jsx
import Map from '../component/Map'; // แก้ไขเส้นทางให้ถูกต้องตามโครงสร้างโฟลเดอร์ของคุณ
import Navbar from '../component/Navbar';
import { Outlet } from "react-router-dom";
import 'tailwindcss/tailwind.css';


const Home = () => {
  
  return (
    <div>
    <Navbar />
      <div className="mt-24"></div>
      <Map />
      <main>
        <Outlet />
      </main>
    </div>
    
  );
};

export default Home;