import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useCities } from '../contexts/contexts';
import { useGeolocation } from '../hooks/useGeolocation';
import { useUrlPosition } from '../hooks/useUrlPosition';
import Button from './Button';

import styles from './Map.module.css'

// custom component not given by leaflet
const ChangeCenter = ({position}) => {
    // useMap custom hook coming from leaflet
    const map = useMap();
    map.setView(position);

    return null;
};

// custom component not given by leaflet
const DetectClick = () => {
    const navigate = useNavigate();

    // useMapEvents custom hook coming from leaflet
    useMapEvents({
        click: e => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    });
};

const Map = () => {
    const [mapPosition, setMapPosition] = useState([51.505, -0.09]);
    const {cities} = useCities();
    const {
        isLoading: isLoadingPosition,
        position: geoLocationPosition,
        getPosition
    } = useGeolocation();
    const [mapLat, mapLng] = useUrlPosition();

    useEffect(() => {
        if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    }, [mapLat, mapLng]);

    useEffect(() => {
        if (geoLocationPosition) setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    }, [geoLocationPosition]);

    return (
        <div className={styles.mapContainer}>
            {!geoLocationPosition
                && <Button type="position" onClick={getPosition}>{isLoadingPosition ? 'Loading...' : 'Use your position'}</Button>
            }

            <MapContainer className={styles.map} center={mapPosition} zoom={6} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map(city => (
                    <Marker key={city.id} position={[city.position.lat, city.position.lng]}>
                        <Popup>
                            <span>{city.emoji}</span> <span>{city.cityName}</span> 
                        </Popup>
                    </Marker>
                ))}

                <ChangeCenter position={mapPosition} />
                <DetectClick />
            </MapContainer>
        </div>
    );
};

export default Map;
