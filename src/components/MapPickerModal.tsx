import React, { useEffect, useRef, useState } from 'react';
import { X, MapPin } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const GEOAPIFY_API_KEY = '876fe1fa321f4e45b9cc6af0c331c0fc';

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPosition: { lat: number; lng: number };
  onSelect: (address: string, coordinates: { lat: number; lng: number }, geoapifyProps?: any) => void;
}

const ReverseGeocode = async (lat: number, lng: number) => {
  const apis = [
    {
      name: 'Geoapify',
      url: `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&limit=1&filter=countrycode:in&lang=en&apiKey=${GEOAPIFY_API_KEY}&format=json`,
      parser: parseGeoapifyResponse
    },
    {
      name: 'Nominatim',
      url: `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=en&zoom=18&namedetails=1&extratags=1`,
      parser: parseNominatimResponse
    }
  ];

  for (const api of apis) {
    try {
      console.log(`🔍 MapPicker trying ${api.name}...`);
      const response = await fetch(api.url);
      
      if (!response.ok) {
        console.warn(`⚠️ ${api.name} failed with status: ${response.status}`);
        continue;
      }

      const data = await response.json();
      console.log(`📋 ${api.name} response:`, data);

      const result = api.parser(data);
      if (result && result.address) {
        console.log(`✅ ${api.name} succeeded:`, result.address);
        return result;
      }
    } catch (error) {
      console.warn(`⚠️ ${api.name} error:`, error);
      continue;
    }
  }

  // Fallback to coordinates
  console.log('⚠️ All APIs failed, using coordinates as fallback');
  return { 
    address: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`, 
    props: {} 
  };
};

// Parse Geoapify response for Indian addresses
const parseGeoapifyResponse = (data: any): { address: string; props: any } | null => {
  if (!data.features || data.features.length === 0) return null;

  const props = data.features[0].properties;
  console.log('🏠 MapPicker Geoapify properties:', props);

  // Use the formatted address directly - it's usually the most accurate
  const address = props.formatted as string;
  if (!address) return null;
  
  return {
    address,
    props: {
      houseNumber: props.housenumber || props.house_number,
      street: props.street || props.road,
      suburb: props.suburb,
      city: props.city || props.town || props.village,
      state: props.state,
      pincode: props.postcode,
      landmark: props.suburb || props.neighbourhood
    }
  };
};

// Parse Nominatim response for Indian addresses
const parseNominatimResponse = (data: any): { address: string; props: any } | null => {
  if (!data) return null;

  // Use display_name directly - it's usually the most accurate
  const address = data.display_name as string;
  if (!address) return null;

  const addressData = data.address as any;
  
  return {
    address,
    props: {
      houseNumber: addressData?.house_number,
      street: addressData?.road,
      suburb: addressData?.suburb,
      city: addressData?.city || addressData?.town || addressData?.village,
      state: addressData?.state,
      pincode: addressData?.postcode,
      landmark: addressData?.suburb || addressData?.neighbourhood
    }
  };
};

const MapPickerModal: React.FC<MapPickerModalProps> = ({ isOpen, onClose, initialPosition, onSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(initialPosition);
  const [address, setAddress] = useState('');
  const [geoapifyProps, setGeoapifyProps] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [houseNumber, setHouseNumber] = useState('');
  const [landmark, setLandmark] = useState('');

  // Initialize map
  useEffect(() => {
    if (!isOpen) return;
    if (map) return;
    if (!mapContainer.current) return;
    
    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${GEOAPIFY_API_KEY}`,
      center: [initialPosition.lng, initialPosition.lat], // MapLibre uses [lng, lat]
      zoom: 17,
    });
    
    setMap(m);
    
    return () => {
      m.remove();
      setMap(null);
    };
  }, [isOpen, initialPosition]);

  // Add marker and handle drag
  useEffect(() => {
    if (!map) return;
    
    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.remove();
    }
    
    // Create new marker at current coordinates
    const marker = new maplibregl.Marker({ draggable: true })
      .setLngLat([coords.lng, coords.lat]) // MapLibre uses [lng, lat]
      .addTo(map);
    
    markerRef.current = marker;
    
    // Center map on marker
    map.setCenter([coords.lng, coords.lat]);
    
    // Handle marker drag
    marker.on('dragend', async () => {
      const lngLat = marker.getLngLat();
      const newCoords = { lat: lngLat.lat, lng: lngLat.lng };
      console.log('📍 Marker dragged to:', newCoords);
      setCoords(newCoords);
    });
    
    return () => {
      marker.remove();
    };
  }, [map, coords.lat, coords.lng]);

  // Reverse geocode on coords change
  useEffect(() => {
    if (!isOpen) return;
    
    setLoading(true);
    console.log('🔍 Reverse geocoding for:', coords);
    
    ReverseGeocode(coords.lat, coords.lng).then((result) => {
      if (result) {
        console.log('✅ Geocoding result:', result);
        setAddress(result.address);
        setGeoapifyProps(result.props);
        
        // Auto-fill house number if available
        if (result.props.houseNumber && !houseNumber) {
          setHouseNumber(result.props.houseNumber);
        }
        
        // Auto-fill landmark/area if available
        if (result.props.suburb && !landmark) {
          setLandmark(result.props.suburb);
        }
      } else {
        setAddress(`Location (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
        setGeoapifyProps({});
      }
      setLoading(false);
    }).catch((error) => {
      console.error('❌ Geocoding failed:', error);
      setAddress(`Location (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
      setGeoapifyProps({});
      setLoading(false);
    });
  }, [coords.lat, coords.lng, isOpen, houseNumber, landmark]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 Resetting to initial position:', initialPosition);
      setCoords(initialPosition);
      setHouseNumber('');
      setLandmark('');
      setAddress('');
      setGeoapifyProps({});
    }
  }, [isOpen, initialPosition]);

  const handleSelect = () => {
    const fullAddress = address;
    onSelect(fullAddress, coords, geoapifyProps);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Pin Your Exact Location</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mb-4">
            <div ref={mapContainer} style={{ width: '100%', height: 350, borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }} />
          </div>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">House/Flat Number *</label>
              <input
                type="text"
                value={houseNumber}
                onChange={e => setHouseNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g. 123, A-4, 2nd Floor"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Landmark / Area *</label>
              <input
                type="text"
                value={landmark}
                onChange={e => setLandmark(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g. Near Metro, Sarai Jullena"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Detected Address</label>
            <div className="p-3 bg-gray-100 rounded-lg text-gray-800 text-sm min-h-[48px]">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                  <span>Detecting address...</span>
                </div>
              ) : address}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              <MapPin className="inline h-4 w-4 mr-1" />
              {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
            </div>
          </div>
          <button
            onClick={handleSelect}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            disabled={loading || !houseNumber || !landmark}
          >
            Use This Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPickerModal; 