import * as React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView ,{Marker} from 'react-native-maps';
import { useEffect, useState } from 'react/cjs/react.development';
import db from '../../config/firebase';
import * as Location from 'expo-location';

export default function StarRideUser(){
    const [location, setLocation] = useState(null);
    const [driverRegion, setDriverRegion] = useState();
    const [userRegion, setUserRegion] = useState()
    useEffect(()=>{

        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }})

        db.collection('users').doc('Qtt4HaEVXHoDGVofJwts').onSnapshot((doc)=>{

            const data = doc.data();
            console.log("data==>",data.acceptedRequest)
            setDriverRegion({
                    latitude: data.acceptedRequest.lat,
                    longitude: data.acceptedRequest.lng,
                    latitudeDelta:0.0922,
                    longitudeDelta: 0.0921
                })
                setUserRegion({
                    latitude: data.lat,
                    longitude: data.lng,
                    latitudeDelta: 0.0022,
                    longitudeDelta: 0.0021
                })
            })
            
            Location.watchPositionAsync({
                distanceInterval: 0.01
            }, async(location) => {
                const {coords: {latitude, longitude}} = location
                setDriverRegion({...driverRegion, latitude, longitude});
                console.log('location***', location)
                const lat = 24.90;
                const lng = 67.08;
        })
    // })
        // console.log("---->")
    },[])
    console.log("driverRegion==>",driverRegion)
    return(
        <View>
            <MapView style={styles.map} region={driverRegion}>
                {driverRegion && <Marker  
                image={require('../../../assets/car.png')}
                style={{height:10,width:0}}
                coordinate={driverRegion}/>}
                
                {userRegion && <Marker coordinate={userRegion}/>}
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
      },
})