import React, { useState } from "react";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L, { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

const deliveryBoyIcon = L.icon({
  iconUrl: scooter,
  iconSize: [50, 50],
  iconAnchor: [25, 25],
});

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const DeliveryBoyTracking = ({ data }) => {
  const customerLat = data.customerLocation.lat;
  const customerLon = data.customerLocation.lon;
  const deliveryBoyLat = data.deliveryBoyLocation.lat;
  const deliveryBoylon = data.deliveryBoyLocation.lon;

  const path = [
    [deliveryBoyLat, deliveryBoylon],
    [customerLat, customerLon],
  ];

  const center = [deliveryBoyLat, deliveryBoylon];

  return (
    <div className="w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md">
      <MapContainer
        className={"w-full h-full"}
        center={center}
        zoom={16}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[deliveryBoyLat,deliveryBoylon]} icon={deliveryBoyIcon}>
          <Popup>Delivery Boy</Popup>
        </Marker>
        <Marker position={[customerLat,customerLon]} icon={customerIcon}>
          <Popup>Customer</Popup>
        </Marker>

        <Polyline positions={path} color="blue" weight={3} />
        
      </MapContainer>
    </div>
  );
};

export default DeliveryBoyTracking;
