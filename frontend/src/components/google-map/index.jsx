import PropTypes from "prop-types";
import GoogleMapReact from 'google-map-react';
import { useState } from "react";


const GoogleMap = ({
    lat,
    lng,
    zoom,
    options,
}) => {
    
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    
    const handleMapLoaded = ({ map, maps }) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setCenter({ lat: latitude, lng: longitude });
            },
            (error) => {
              console.error('Error getting the current location:', error);
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
        }
      };

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyDlN9nwEuPcue96abGsNsBIx0lEJlk7rZI" }} // GoogleMapAPI AIzaSyDlN9nwEuPcue96abGsNsBIx0lEJlk7rZI
                defaultCenter={{lat, lng}}
                defaultZoom={zoom}
                onGoogleApiLoaded={handleMapLoaded}
            >
                <Marker
                    lat={lat}
                    lng={lng}
                    text="My Marker"
                />
            </GoogleMapReact>
        </div>
    );
};

GoogleMap.propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    zoom: PropTypes.number,
    options: PropTypes.shape({}) 
}

GoogleMap.defaultProps = {
    lat: -3.745,
    lng: -38.523,
    zoom: 12,
};

export default GoogleMap;

const Marker = ({ text }) => <div className="map-marker"><img src={`${process.env.PUBLIC_URL + "/assets/img/icon-img/2.png"}`} alt={text}/></div>;