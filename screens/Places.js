import React, { useState, useEffect } from 'react';
import { View, Button, FlatList, Alert } from 'react-native';
import { ref, push, onValue, remove } from 'firebase/database';
import { database } from '../firebaseConfig';
import { Input, ListItem } from 'react-native-elements';

const Places = ({ navigation }) => {
    const [address, setAddress] = useState('');
    const [items, setItems] = useState([]);

    const handleSave = () => {
        if (address) {
            push(ref(database, 'places/'), { address })
                .then(() => setAddress(''))
                .catch((error) => Alert.alert('Error', 'Could not save address: ' + error.message));
        } else {
            Alert.alert('Error', 'Please enter an address.');
        }
    };

    useEffect(() => {
        const placesRef = ref(database, 'places/');
        onValue(placesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setItems(Object.entries(data).map(([key, value]) => ({ key, ...value })));
            } else {
                setItems([]);
            }
        });
    }, []);

    const handleRemove = (key) => {
        remove(ref(database, `places/${key}`))
            .then(() => Alert.alert('Success', 'Address removed successfully.'))
            .catch((error) => Alert.alert('Error', 'Could not remove address: ' + error.message));
    };

    const handleNavigateToMap = (address) => {
        if (address) {
            navigation.navigate('Map', { selectedAddress: address });
        } else {
            Alert.alert('Error', 'No address found');
        }
    };

    return (
        <View>
            <Input
                placeholder="Enter address"
                value={address}
                onChangeText={setAddress}
            />
            <Button title="SAVE" onPress={handleSave} />
            <FlatList
                data={items}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                    <ListItem bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title>{item.address}</ListItem.Title>
                        </ListItem.Content>
                        <Button
                            title="Show on Map"
                            onPress={() => handleNavigateToMap(item.address)}
                        />
                        <Button
                            title="Delete"
                            onPress={() => handleRemove(item.key)}
                        />
                    </ListItem>
                )}
            />
        </View>
    );
};

export default Places;
