import React from "react";
import { View, Text, Button, StyleSheet, Dimensions } from "react-native";
import MapView ,{Marker} from 'react-native-maps';
import { useState,useEffect } from "react/cjs/react.development";
import * as Location from 'expo-location';
import { storeLocation } from '../../config/firebase';
import { geohashForLocation, geohashQueryBounds, distanceBetween} from 'geofire-common';


export default function Dashboard({navigation}) {
  const [currentLocation, setCurrentLocation] = useState('');
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText,setLoadingText] = useState('Finding Drivers');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [region, setRegion] = useState({
            latitude: 24.9323526,
            longitude: 67.0872638,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0021,
    })
    const fetchDrivers = async () =>{
      const bounds = geohashQueryBounds(center, radiusInM);
      const promises = [];
      for(const b of bounds) {
        const q = getNearestDrivers(b)
        promises.push(q.get());
      }
      const snapshots = await Promise.all(promises)
      console.log('snapshots==>',snapshots)
      const matchDocs = [];

      for(const snap of snapshots) {
        for(const doc of snap.docs){
          const lat = doc.get('lat');
          const lng = doc.get('lng');
          console.log("doc===>",doc)

          const distanceInKm = distanceBetween([lat,lng], center);
          console.log('distance, radiusINM ***', distanceInKm, radiusInM);
          const distanceInM = distanceInKm * 1000;
          if(distanceInM <= radiusInM) {
            matchDocs.push({...doc.data(), id: doc.id, distanceInKm});
          } 
        }
      }
      console.log("matchingDocs ===>", matchDocs);
    }

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

          let location = await Location.getCurrentPositionAsync({});
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
        {/* <Button 
        title="chalo"
        onPress={fetchDrivers}/> */}

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
      height: Dimensions.get('window').height,
    },
  });