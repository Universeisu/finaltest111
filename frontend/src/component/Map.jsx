import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Swal from "sweetalert2";
import LocationMap from "./LocationMap"; // Import LocationMap component
import "../App.css";
import StoreService from "../services/Store.services";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const storeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/948/948036.png",
  iconSize: [38, 38],
  iconAnchor: [22, 38],
  popupAnchor: [0, -40],
});

const houseIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/7720/7720526.png",
  iconSize: [38, 38],
  iconAnchor: [22, 38],
  popupAnchor: [0, -40],
});

const selectedStoreIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/7877/7877890.png",
  iconSize: [38, 38],
  iconAnchor: [22, 38],
  popupAnchor: [0, -40],
});

function Map() {
  const navigate = useNavigate(); // Initialize navigate
  const center = [13.809247028530955, 100.16073889689031];
  const [stores, setStores] = useState([]);
  const [myLocation, setMylocation] = useState({ lat: "", lng: "" });
  const [selectedStore, setSelectedStore] = useState(null);

  const [deliveryZone, setDeliveryZone] = useState({
    lat: null,
    lng: null,
    radius: 1000,
  });

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371000; // Earth radius in meters
    const phi_1 = (lat1 * Math.PI) / 180;
    const phi_2 = (lat2 * Math.PI) / 180;

    const delta_phi = ((lat2 - lat1) * Math.PI) / 180;
    const delta_lambda = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(delta_phi / 2) * Math.sin(delta_phi / 2) +
      Math.cos(phi_1) *
        Math.cos(phi_2) *
        Math.sin(delta_lambda / 2) *
        Math.sin(delta_lambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await StoreService.getAllStores();
        console.log(response.data);
        if (response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };
    fetchStores();
  }, []);

  const handlerGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMylocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  const handleLocationCheck = () => {
    console.log(myLocation);

    if (!myLocation.lat || !myLocation.lng) {
      Swal.fire({
        title: "Error!",
        text: "Please enter your valid location",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!selectedStore) {
      Swal.fire({
        title: "Error!",
        text: "Please select a store",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const distance = calculateDistance(
      myLocation.lat,
      myLocation.lng,
      selectedStore.latitude,
      selectedStore.longitude
    );

    if (distance <= selectedStore.deliveryRadius) {
      Swal.fire({
        title: "Success",
        text: `You are within the delivery zone for ${selectedStore.storeName}`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: `You are outside the delivery zone for ${selectedStore.storeName}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const handleDeleteStore = async (storeId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await StoreService.deleteStore(storeId);
        if (response.status === 200) {
          setStores((prevStores) => prevStores.filter((store) => store.storeId !== storeId));
          Swal.fire("Deleted!", "Your store has been deleted.", "success");
        }
      } catch (error) {
        console.error("Error deleting store:", error);
        Swal.fire("Error!", "There was an error deleting the store.", "error");
      }
    }
  };

  return (
    <>
      <div className="button-container">
        <button className="get-location-btn text-blue bg-[#A66E38] hover:bg-[#3C5B6F]" onClick={handlerGetLocation}>
          Get My Location
        </button>
        <button className="get-location-btn text-blue bg-[#A66E38] hover:bg-[#3C5B6F]" onClick={handleLocationCheck}>
          Check Delivery Availability
        </button>
      </div>

      <div>
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "75vh", width: "100vw" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {stores.length > 0 &&
            stores.map((store) => (
              <Marker
                key={store.storeId}
                position={[store.latitude, store.longitude]}
                icon={
                  selectedStore && selectedStore.storeId === store.storeId
                    ? selectedStoreIcon
                    : storeIcon
                }
                eventHandlers={{
                  click: () => {
                    setSelectedStore(store);
                  },
                }}
              >
                <Popup>
                  <b>{store.storeName}</b>
                  <p>{store.address}</p>
                  <p>Delivery Radius: {store.deliveryRadius} meters</p>
                  <div className="flex space-x-4">
                    <a href={store.direction} className="text-blue-500 hover:underline">
                      Get Direction
                    </a>
                    <button
                      onClick={() => navigate(`/edit/${store.storeId}`)} // Now navigate will work
                      className="popup-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStore(store.storeId)} // Call delete function
                      className="popup-button text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

          <LocationMap
            myLocation={myLocation}
            icon={houseIcon}
            onLocationSelect={setMylocation}
          />

          {selectedStore && (
            <>
              <Circle
                center={[selectedStore.latitude, selectedStore.longitude]}
                radius={selectedStore.deliveryRadius}
                color="#008163"
                fillColor="#008163"
                fillOpacity={0.2}
                weight={1.5}
              />
              <Marker position={[selectedStore.latitude, selectedStore.longitude]} icon={selectedStoreIcon}>
                <Popup>
                  <b>{selectedStore.storeName}</b>
                  <p>{selectedStore.address}</p>
                  <p>Delivery Radius: {selectedStore.deliveryRadius} meters</p>
                </Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>
    </>
  );
}

export default Map;
