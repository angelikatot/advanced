import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen({ route }) {
    const { address } = route.params;
    const [region, setRegion] = useState({
        latitude: 60.20,
        longitude: 24.92,
        latitudeDelta: 0.03,
        longitudeDelta: 0.02,
    });
    const [location, setLocation] = useState(null);


    useEffect(() => {
        const getCoordinates = async () => {
            try {
                const response = await fetch(`https://geocode.maps.co/search?q=${encodeURIComponent(address.address)}`);
                const data = await response.json();

                if (data.length > 0) {
                    const coords = data[0];
                    setRegion({
                        latitude: parseFloat(coords.lat),
                        longitude: parseFloat(coords.lon),
                        latitudeDelta: 0.03,
                        longitudeDelta: 0.02,
                    });
                    setLocation({
                        coords: {
                            latitude: parseFloat(coords.lat),
                            longitude: parseFloat(coords.lon),
                        },
                    });
                } else {
                    Alert.alert('Address not found');
                }
            } catch {
                Alert.alert('Error fetching coordinates');
            }
        };

        getCoordinates();
    }, [address]);

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                region={region}
            >
                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title={address.name}
                    />
                )}
            </MapView>
        </View>
    );
}
