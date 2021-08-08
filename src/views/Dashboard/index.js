import React from "react";
import { View, Text, Button, StyleSheet, Dimensions } from "react-native";
import MapView ,{Marker} from 'react-native-maps';
import { useState,useEffect } from "react/cjs/react.development";
import * as Location from 'expo-location';


export default function Dashboard({navigation}) {
    // console.log("Navigation from dashboard",navigation) 
    const [region, setRegion] = useState({
            latitude: 24.9323526,
            longitude: 67.0872638,
            latitudeDelta: 0.00022,
            longitudeDelta: 0.00021,
    })
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
          Location.watchPositionAsync({
              distanceInterval: 0.01
          }, location => {
              const {coords: {latitude, longitude}} = location
              setRegion({...region, latitude, longitude});
              console.log('location***', location)
          })
        //   let location = await Location.getCurrentPositionAsync({});
        //   setLocation(location);
        //   const {coords: {latitude,longitude}} = location;
        //   setRegion({...region, latitude, longitude});
        })();
      }, []);
      let text = 'Waiting..';
    if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

    return(
        <View>
            <MapView region={region} style={styles.map}>
                <Marker 
                coordinate={region}
                />
            </MapView>

            {/* <Text style={{fontSize:40}}>DASHBOARD SCREEN</Text>
            <Button 
            title="goto DropOff"
            onPress={()=>navigation.navigate('DropOff')}
            /> */}
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