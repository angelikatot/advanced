import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const Map = ({ route }) => {
    const { selectedAddress } = route.params;
    const [region, setRegion] = useState({
        latitude: 60.20,
        longitude: 24.92,
        latitudeDelta: 0.03,
        longitudeDelta: 0.02,
    });
    const [location, setLocation] = useState(null);

    useEffect(() => {
        if (selectedAddress) {
            getCoordinates(selectedAddress);
        } else {
            // current location
            getCurrentLocation();
        }
    }, [selectedAddress]);

    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Location permission denied');
            return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.02,
        });
        setLocation({
            coords: {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            },
        });
    };

    const getCoordinates = async (address) => {
        try {
            const response = await fetch(`https://geocode.maps.co/search?q=${encodeURIComponent(address)}`);
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
            Alert.alert('Something went wrong');
        }
    };

    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={region}>
                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="Selected Location"
                    />
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});

export default Map;
