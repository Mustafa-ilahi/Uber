import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import MapView ,{Marker} from 'react-native-maps';
import { useEffect, useState } from 'react/cjs/react.development';
import db from '../../config/firebase';
import * as Location from 'expo-location';
import { Button } from 'react-native-paper';

export default function StarRideDriver({navigation}){
    const [location, setLocation] = useState(null);
    const [driverRegion, setDriverRegion] = useState();
    const [userRegion, setUserRegion] = useState();
    const [droffRegion, setDroffRegion] = useState();
    const [rideStatus, setRideStatus] = useState(false);
    const [rideComplete,setRideComplete] = useState(false);
    const [dropOffLocation,setDropOffLocation] = useState();
    const [pickUpLocation,setPickUpLocation] = useState();
    useEffect(()=>{

        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }})

        db.collection('users').doc('Qtt4HaEVXHoDGVofJwts').onSnapshot((doc)=>{
            const data = doc.data();
            console.log("data==>",data)
            console.log("drop off===>",data.dropOffLocation.dropOffRegion.latitude)
            setDropOffLocation(data.dropOffLocation.dropOffLocation)
            setPickUpLocation(data.pickUpLocation.pickUpLocation)
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
        // if(driverRegion == driverRegion){
        //     // Alert.alert("User Arrived");
        //     setRideStatus(true)
        // }
        // {
        //     dropOffLocation && Alert.alert(`Drop-off location is: ${dropOffLocation}`);
        // }
        // {
        //     pickUpLocation && Alert.alert(`Pick-up location is: ${pickUpLocation}`);
        // }

    },[])
    console.log("driverRegion==>",driverRegion)

    function startRide() {
        Alert.alert(`Ride Started from: ${pickUpLocation}`);
    }
    
    function endRide() {
        Alert.alert(`Reached at: ${dropOffLocation}`);
    }
    return(
        <View>
            {/* <MapView style={styles.map} region={driverRegion}>
                {driverRegion && <Marker  
                image={require('../../../assets/car.png')}
                style={{height:10,width:0}}
                coordinate={driverRegion}/>}

                {userRegion &&
                <Marker coordinate={userRegion}
                title="pickup"/> 
                }

                {droffRegion && 
                <Marker coordinate={droffRegion} title="dropOff" pinColor={'navy'}/>
                }
            </MapView> */}
            {/* <MapView style={styles.map} region={userRegion}>
                {userRegion && <Marker  
                image={require('../../../assets/car.png')}
                style={{height:10,width:0}}
                coordinate={userRegion}/>}

                {userRegion &&
                <Marker coordinate={userRegion}
                title="pickup"/> 
                }

                {droffRegion && 
                <Marker coordinate={droffRegion} title="dropOff" pinColor={'navy'}/>
                }
            </MapView> */}

            <MapView style={styles.map} region={droffRegion}>
                {droffRegion && <Marker  
                image={require('../../../assets/car.png')}
                style={{height:10,width:0}}
                coordinate={droffRegion}/>}

                {droffRegion && 
                <Marker coordinate={droffRegion} title="dropOff" pinColor={'navy'}/>
                }
            </MapView>
            
            {/* <Button mode="contained" disabled >Start Ride</Button> */}
            {/* <Button mode="contained" onPress={startRide} style={{backgroundColor:"black"}}>Start Ride</Button> */}
            <Button mode="contained" onPress={endRide} style={{backgroundColor:"black"}}>End Ride</Button>
        </View>
    )   
}

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.8
      },
})