import React, { useState, useEffect } from 'react';
import { View, Alert, FlatList, StyleSheet } from 'react-native';
import { ref, push, onValue, remove } from 'firebase/database';
import { database } from '../firebaseConfig';
import { Input, ListItem, Button } from 'react-native-elements';

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
        <View style={styles.container}>
            <Input
                placeholder="Enter address"
                value={address}
                onChangeText={setAddress}
                containerStyle={styles.inputContainer}
            />
            <Button
                title="SAVE"
                onPress={handleSave}
                buttonStyle={styles.saveButton}
            />
            <FlatList
                data={items}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                    <ListItem bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title style={styles.listTitle}>{item.address}</ListItem.Title>
                        </ListItem.Content>
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Show on Map"
                                onPress={() => handleNavigateToMap(item.address)}
                                buttonStyle={styles.showButton}
                                containerStyle={styles.buttonSpacing}
                            />
                            <Button
                                title="Delete"
                                onPress={() => handleRemove(item.key)}
                                buttonStyle={styles.deleteButton}
                                containerStyle={styles.buttonSpacing}
                            />
                        </View>
                    </ListItem>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f8ff', // taustaväri
    },
    inputContainer: {
        marginBottom: 16,
    },
    saveButton: {
        backgroundColor: '#FF69B4',
        marginBottom: 16,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonSpacing: {
        marginHorizontal: 5,
    },
    showButton: {
        backgroundColor: '#4682b4',
    },
    deleteButton: {
        backgroundColor: '#ff6347',
    },
});

export default Places;
