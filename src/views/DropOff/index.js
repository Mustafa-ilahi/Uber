import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import * as Location from 'expo-location';
import MapView ,{Marker} from 'react-native-maps';
import { useState,useEffect } from 'react/cjs/react.development';


export default function DropOff({route,navigation},props){
    const [dropOffLocation,setDropOffLocation] = useState();
    const {pickUpLocation, pickUpRegion} = route.params;
    const [region,setRegion] = useState(pickUpRegion)
    console.log("PickUp===>", pickUpLocation);
    console.log("Region==>",region)


    useEffect(()=>{
        fetch(`https://api.foursquare.com/v2/venues/search?client_id=QEJ3YKKOS5HOCE4ANKTO4UWF1ERT4SJBNIXPWZGBE0VY02UI&client_secret=QD2I1K00RYVZ5A4TGQFUK3FVZOY44CPZX2NNA25KDQP5NVLI&ll=${region.latitude},${region.longitude}&v=20180323`)
            .then(res => res.json())
            .then(res => setDropOffLocation(res.response.venues[0].name))
      },[region])


    return(
        <View style={styles.mainView}>
            <Text style={styles.pickUpLocation}>PickUp Location: <Text style={styles.location}>{pickUpLocation}</Text></Text>
            <TextInput style={styles.input} placeholder="Search Your Drop Location"/>
            <Button mode="contained" style={{backgroundColor:"black"}} onPress={()=>navigation.navigate('SelectRide',{
                dropOffLocation: dropOffLocation,
                pickUpLocation: pickUpLocation,
                pickUpRegion: pickUpRegion,
                dropOffRegion: region
            })}>Select Ride</Button>
            <MapView style={styles.map} region={region}>
            <Marker 
            pinColor={'navy'}
            title={dropOffLocation}
            coordinate={region}
            draggable={true}
            onDragStart={(e)=>console.log('drag start',region)}
            onDragEnd={(e)=>
              setRegion({
                ...region,
                latitude:e.nativeEvent.coordinate.latitude,
                longitude:e.nativeEvent.coordinate.longitude
              })
            }
            />
        </MapView>
        </View>
    )
}
const styles = StyleSheet.create({
    mainView: {
        backgroundColor:"#fff"
    },

    pickUpLocation: {
        fontWeight:"bold",
        textAlign:"center",
        color:"#000000"
    },
    location: {
        color:"navy",
        textTransform:"capitalize"
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
      input: {
        height: 50,
        marginTop: 12,
        marginBottom: 5,
        borderWidth: 2,
        padding: 10,
        fontSize: 16,
        backgroundColor:"#fff"
      },
    
})