import React from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToString } from "react-dom/server";
import { EnvironmentOutlined } from "@ant-design/icons";

/* ----------  zoom ---------- */
const FlyToLocation = ({ location }) => {
  const map = useMap();
  React.useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 14, { duration: 1.5 });
    }
  }, [location, map]);
  return null;
};
const SendCenterLocation = ({ onCenterChange }) => {
  const map = useMap();
  
  React.useEffect(() => {
    const updateCenter = () => {
      const center = map.getCenter();
      onCenterChange({ lat: center.lat, lng: center.lng });
    };
    
    updateCenter();
    
    // center loacation
    map.on('moveend', updateCenter);
    return () => map.off('moveend', updateCenter);
  }, [map, onCenterChange]);
  
  return null;
};

/* ----------  marker in center always ---------- */
const CenterMarker = ({ icon }) => {
  const map = useMap();
  const [center, setCenter] = React.useState(() => map.getCenter());

  React.useEffect(() => {
    const update = () => setCenter(map.getCenter());
    map.on("move", update);
    return () => map.off("move", update);
  }, [map]);

  return <Marker position={center} icon={icon} interactive={false} />;
};

/* ---------- icon for select---------- */
const selectIcon = new L.DivIcon({
  className: "select-pin-icon",
  html: '<div style="font-size:20px">📍</div>',
  iconSize: [20, 20],
  iconAnchor: [10, 20],
});

/* ---------- icon for display ---------- */
const companyIcon = (company) =>
  new L.DivIcon({
    className: "custom-div-icon",
    html: renderToString(
      <div style={{ textAlign: "center" }}>
        <EnvironmentOutlined style={{ fontSize: 24, color: "#ff4d4f" }} />
        <div
          style={{
            background: "white",
            borderRadius: "6px",
            padding: "2px 6px",
            fontSize: "8px",
            fontFamily: "vazir",
            fontWeight: "bold",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            whiteSpace: "nowrap",
          }}
        >
          {company}
        </div>
      </div>
    ),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

const MapFixed = ({
  mode = "view",
  contacts = [],
  selectedLocation,
  onCenterChange,
}) => {
  const mapRef = React.useRef();
  const center = selectedLocation || [35.6892, 51.389];

  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
      whenCreated={(m) => (mapRef.current = m)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


      {/*see contacts location */}
      {mode === "view" &&
        contacts
          .filter((c) => c.location)
          .map((c, idx) => (
            <Marker
              key={idx}
              position={[c.location.lat, c.location.lng]}
              icon={companyIcon(c.company)}
            />
          ))}

      {/* center in marker */}
     {mode === "select" && (
  <>
    <CenterMarker icon={selectIcon} />
    <SendCenterLocation onCenterChange={onCenterChange} />
  </>
)}

      {/*jump to selectedLocation */}
      <FlyToLocation location={selectedLocation} />
    </MapContainer>
  );
};

export default MapFixed;