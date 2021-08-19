import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SelectRide({route,navigation},props){
    const {pickUpLocation, dropOffLocation} = route.params;

    return(
        <View>
            <Text style={styles.pickUpLocation}>PickUp Location: <Text style={styles.location}>{pickUpLocation}</Text></Text>
            <Text style={styles.pickUpLocation}>DropOff Location: <Text style={styles.location}>{dropOffLocation}</Text></Text>
            {/* <Text style={{fontSize:50}}>SelectRide SCREEN</Text> */}
        </View>
    )
}

const styles = StyleSheet.create({
    pickUpLocation: {
        fontWeight:"bold",
        textAlign:"center",
        color:"#000000"
    },
    location: {
        color:"red",
        textTransform:"capitalize"
    },
})