import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { db } from '../firebaseConfig';

export default function PlacesScreen({ navigation }) {
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        const subscriber = db.collection('addresses')
            .onSnapshot(
                querySnapshot => {
                    const newAddresses = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setAddresses(newAddresses);
                },
                error => {
                    console.error("Firestore error:", error);
                    Alert.alert('Error', 'Could not fetch addresses');
                }
            );

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, []);

    const deleteAddress = async (id) => {
        try {
            await db.collection('addresses').doc(id).delete();
        } catch (error) {
            console.error('Error deleting document:', error);
            Alert.alert('Error', 'Could not delete address');
        }
    };

    const handlePress = (item) => {
        navigation.navigate('Map', { address: item });
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={addresses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ListItem
                        bottomDivider
                        onPress={() => handlePress(item)}
                        onLongPress={() => deleteAddress(item.id)}
                    >
                        <ListItem.Content>
                            <ListItem.Title>{item.name}</ListItem.Title>
                            <ListItem.Subtitle>{item.address}</ListItem.Subtitle>
                        </ListItem.Content>
                        <Button
                            title="Delete"
                            onPress={() => deleteAddress(item.id)}
                        />
                    </ListItem>
                )}
            />
        </View>
    );
}