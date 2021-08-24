import React from "react";
import { View, Text, Button, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import MapView ,{Marker} from 'react-native-maps';
import { useState,useEffect } from "react/cjs/react.development";
import * as Location from 'expo-location';
import db, { storeLocation, getNearestDrivers } from '../../config/firebase';
import { geohashForLocation, geohashQueryBounds, distanceBetween} from 'geofire-common';


export default function Dashboard({navigation}) {
  const [region, setRegion] = useState({
            latitude: 24.9190862,
            longitude: 67.0639514,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0021,
    })
  const [currentLocation, setCurrentLocation] = useState('');
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText,setLoadingText] = useState('Finding Drivers');
  const [currentIndex, setCurrentIndex] = useState(0);
  const center = [region.latitude, region.longitude];
  const radiusInm = 1000; 
  
    const fetchDrivers = async () =>{
      const bounds = geohashQueryBounds(center, radiusInm);
    const promises = [];
    for (const b of bounds) {
      const q = getNearestDrivers(b);
      promises.push(q.get());
    }
    const snapshots = await Promise.all(promises);
    const matchingDocs = [];
    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const lat = doc.get("lat");
        const lng = doc.get("lng");
        const distanceInkm = distanceBetween([lat, lng], center);
        const distanceInM = distanceInkm * 1000;
        console.log("distance in Meter=====>", distanceInM);
        if (distanceInM <= radiusInm) {
          matchingDocs.push({ ...doc.data(), id: doc.id, distanceInkm });
        }
      }
    }
    console.log("matching docs======>", matchingDocs);
    setLoadingText(`${matchingDocs.length} Drivers Found!`);
    // requestDrivers(matchingDocs); 
    }

    // const requestDrivers = async (matchingDocs) =>{
    //   await requestDriver(matchingDocs[currentIndex].id,{
    //     userId: "Qtt4HaEVXHoDGVofJwts",
    //     lat: region.latitudeDelta,
    //     lng: region.longitude
    //   })
    //   console.log("driver requested")
    //   listenToRequestedDriver(matchingDocs[currentIndex].id)
    // }

    // const listenToRequestedDriver = (driverId) =>{
    //   db.collection('drivers').doc(driverId).onSnapshot((doc)=>{
    //     const data = doc.data();
    //     if(!data.currentRequest){
    //       setLoadingText("1 driver rejected! Finding another driver");
    //       setCurrentIndex(currentIndex + 1);
    //       requestDrivers();
    //     }
    //   })
    // }

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
          // Location.watchPositionAsync({
          //     distanceInterval: 0.01
          // }, location => {
          //     const {coords: {latitude, longitude}} = location
          //     setRegion({...region, latitude, longitude});
          //     console.log('location***', location)
          // })

          // let location = await Location.getCurrentPositionAsync({});
          let location ={
            coords: {
              latitude: 24.9190862,
              longitude: 67.0639514,            
            }
          }
          const {coords:{latitude,longitude}} = location
          console.log('loc======>',location)
          setRegion({...region,latitude,longitude})
          setLocation(location);
          const lat = latitude;
          const lng = longitude;
          try{
            const hash = geohashForLocation([lat,lng]);
            await storeLocation(undefined, {
              geohash: hash, lat, lng
            })
            console.log("chala gya user==>");
          }
          catch(e){
            console.log("unable to store",e)
          }

          fetch('https://api.foursquare.com/v2/venues/search?client_id=WW3RFWSW52A4L14OURWZ2RKBJBQAN0WZK4P02JUZMMH15N0B&client_secret=Y500SBLI0E0XCQOEFB0OPOKHY0HNDC2UEI50GDTBYOH0DHRC&ll=24.9121428,67.0545419&v=20180323')
            .then(res => res.json())
            .then(res => setCurrentLocation(res.response.venues[0].name))
        })();
      }, []);

      useEffect(()=>{
        fetch(`https://api.foursquare.com/v2/venues/search?client_id=WW3RFWSW52A4L14OURWZ2RKBJBQAN0WZK4P02JUZMMH15N0B&client_secret=Y500SBLI0E0XCQOEFB0OPOKHY0HNDC2UEI50GDTBYOH0DHRC&near=${region.latitude},${region.longitude}&v=20180323`)
            .then(res => res.json())
            .then(res => setPickUpLocation(res.response.venues[0].name))
      },[region])

    let text = 'Waiting..';
    if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

    return(
      <View>
          <Button 
        title="Select DropOff" 
        onPress={()=>navigation.navigate('DropOff',{
          pickUpLocation: pickUpLocation,
          pickUpRegion: region
        })}
        />
        <Button 
            title="chalo"
            onPress={fetchDrivers}/>

          {isLoading && <>
            <ActivityIndicator size="large" color="#00ff00"/>
            <Text>{loadingText}</Text>
            </>
          }
            <MapView style={styles.map} region={region}>
            {/* region={region} */}
            <Marker 
            title={pickUpLocation}
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
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height * 0.8,
    },
  });