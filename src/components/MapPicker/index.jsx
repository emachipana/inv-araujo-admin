import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ position, onPositionChange, isViewOnly = false }) => {
  const map = useMapEvents({
    click(e) {
      if (!isViewOnly) {
        onPositionChange(e.latlng);
      }
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);

  return position ? (
    <Marker position={position}>
      <Popup>Ubicación seleccionada</Popup>
    </Marker>
  ) : null;
};

const MapPicker = ({ 
  initialPosition = null, 
  onLocationSelect = () => {}, 
  isViewOnly = false,
}) => {
  const [position, setPosition] = useState(initialPosition ? [initialPosition.lat, initialPosition.lng] : null);
  const [hasLocation, setHasLocation] = useState(false);

  useEffect(() => {
    if (!hasLocation && !position && navigator.geolocation && !isViewOnly) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPosition = [latitude, longitude];
          setPosition(newPosition);
          onLocationSelect({ lat: latitude, lng: longitude });
          setHasLocation(true);
        },
        (err) => {
          console.warn('No se pudo obtener la ubicación:', err);
          const defaultPosition = [-12.06513, -75.20486];
          setPosition(defaultPosition);
          onLocationSelect({ lat: defaultPosition[0], lng: defaultPosition[1] });
        }
      );
    } else if (initialPosition && !position) {
      setPosition([initialPosition.lat, initialPosition.lng]);
    }
  }, [hasLocation, position, onLocationSelect, isViewOnly, initialPosition]);

  const handlePositionChange = (newPosition) => {
    setPosition([newPosition.lat, newPosition.lng]);
    onLocationSelect({ lat: newPosition.lat, lng: newPosition.lng });
  };

  if (typeof window === 'undefined') {
    return <div />;
  }

  return (
    <MapContainer
      center={position || [-12.06513, -75.20486]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      zoomControl={!isViewOnly}
      dragging={!isViewOnly}
      scrollWheelZoom={!isViewOnly}
      doubleClickZoom={!isViewOnly}
      touchZoom={!isViewOnly}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {position && (
        <LocationMarker 
          position={position} 
          onPositionChange={handlePositionChange} 
          isViewOnly={isViewOnly}
        />
      )}
    </MapContainer>
  );
};

export default MapPicker;
