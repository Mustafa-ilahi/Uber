import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, Button } from 'react-native';
import MapView ,{Marker} from 'react-native-maps';
import { useEffect, useState } from 'react/cjs/react.development';
import db from '../../config/firebase';
import * as Location from 'expo-location';
// import { Button } from 'react-native-paper';

export default function EndRideDriver(){
    const [location, setLocation] = useState(null);
    const [driverRegion, setDriverRegion] = useState();
    const [userRegion, setUserRegion] = useState();
    const [droffRegion, setDroffRegion] = useState();
    const [rideStatus, setRideStatus] = useState(false);
    const [rideComplete,setRideComplete] = useState(false);
    useEffect(()=>{

        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }})

        db.collection('users').doc('Qtt4HaEVXHoDGVofJwts').onSnapshot((doc)=>{
            const data = doc.data();
            // console.log("data==>",data.acceptedRequest)
            // console.log("drop off===>",data.dropOffLocation.dropOffRegion.latitude)
            setDriverRegion({
                    latitude: data.acceptedRequest.lat,
                    longitude: data.acceptedRequest.lng,
                    latitudeDelta:0.0022,
                    longitudeDelta: 0.0021
                })
                setUserRegion({
                    latitude: data.pickUpLocation.pickUpRegion.latitude,
                    longitude: data.pickUpLocation.pickUpRegion.longitude,
                    latitudeDelta: 0.0022,
                    longitudeDelta: 0.0021
                })
                setDroffRegion({
                    latitude: data.dropOffLocation.dropOffRegion.latitude,
                    longitude: data.dropOffLocation.dropOffRegion.longitude,
                    latitudeDelta: 0.0022,
                    longitudeDelta: 0.0021
                })
            })
            
        //     Location.watchPositionAsync({
        //         distanceInterval: 0.01
        //     }, async(location) => {
        //         const {coords: {latitude, longitude}} = location
        //         setDriverRegion({...driverRegion, latitude, longitude});
        //         console.log('location***', location)
        //         const lat = 24.90;
        //         const lng = 67.08;
        // })
    // })
        // console.log("---->")
        if(driverRegion == driverRegion){
            // Alert.alert("User Arrived");
            setRideStatus(true)
        }
    },[])
    console.log("driverRegion==>",driverRegion)

    function startRide() {
        Alert.alert("Start Ride");
    }
    return(
        <View>
            <MapView style={styles.map} region={userRegion}>
                {driverRegion && <Marker  
                image={require('../../../assets/car.png')}
                style={{height:10,width:0}}
                coordinate={driverRegion}/>}
                <Marker coordinate={userRegion}
                title="pickup"/> 

                {rideStatus &&  
                <Marker coordinate={droffRegion} title="dropOff"/>
                }
            </MapView>
            {
                rideStatus && <Button title="Start" onPress={startRide}/>
            }
            {/* <Text>
                Hello ending screeeeeeen
            </Text> */}
        </View>
    )   
}

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.8
      },
})