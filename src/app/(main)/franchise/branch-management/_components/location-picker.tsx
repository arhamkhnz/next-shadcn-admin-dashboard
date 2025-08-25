import "leaflet-geosearch/dist/geosearch.css";

import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";

// Fix for default icon issue with webpack
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { Info } from "lucide-react";
import { useMap, MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

import { cn } from "@/lib/utils";

const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  initialPosition?: { lat: number; lng: number };
  className?: string;
}

function LocationMarker({
  onLocationSelect,
  initialPosition,
}: {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  initialPosition?: { lat: number; lng: number };
}) {
  const [position, setPosition] = useState(initialPosition);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    if (!initialPosition) {
      map.locate().on("locationfound", function (e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        onLocationSelect(e.latlng);
      });
    }
  }, [map, initialPosition, onLocationSelect]);

  return position ? <Marker position={position}></Marker> : null;
}

const SearchField = ({ onLocationSelect }: { onLocationSelect: (location: { lat: number; lng: number }) => void }) => {
  const map = useMap();
  const provider = new OpenStreetMapProvider();

  useEffect(() => {
    const searchControl = new (GeoSearchControl as any)({
      provider: provider,
      style: "bar",
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result: any) => {
      const { x, y } = result.location;
      const latlng = { lat: y, lng: x };
      onLocationSelect(latlng);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onLocationSelect]);

  return null;
};

export function LocationPicker({ onLocationSelect, initialPosition, className }: LocationPickerProps) {
  return (
    <div className={cn("relative", className)}>
      <MapContainer
        center={initialPosition ?? [51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={true}
        className="z-0 h-full w-full rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} initialPosition={initialPosition} />
        <SearchField onLocationSelect={onLocationSelect} />
      </MapContainer>
      <div className="bg-background/80 absolute bottom-2 left-2 z-10 flex items-center gap-2 rounded-md px-3 py-2 text-sm backdrop-blur-sm">
        <Info className="h-4 w-4" />
        <span>Click on the map to select location</span>
      </div>
    </div>
  );
}
