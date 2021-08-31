import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,Alert, ActivityIndicator } from 'react-native';
import { List,Button } from 'react-native-paper';

import { useState } from 'react';
import MapView ,{Marker} from 'react-native-maps';
import db, {getNearestDrivers, requestDriver, storeDropOffLocation} from '../../config/firebase'
import { geohashForLocation, geohashQueryBounds, distanceBetween} from 'geofire-common';

export default function SelectRide({route,navigation},props){
    const [price,setPrice] = useState();
    const [selectedCar,setSelectedCar] = useState();
    const [isSelected,setIsSelected] = useState(false);
    const {pickUpLocation, dropOffLocation,pickUpRegion,dropOffRegion} = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText,setLoadingText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [request, setRequest] = useState(false);

    const [regionPickUp, setRegionPickUp] = useState({
        latitude: pickUpRegion.latitude,
        longitude: pickUpRegion.longitude,
        latitudeDelta:0.0922,
        longitudeDelta: 0.0921,
    })
    const center = [regionPickUp.latitude, regionPickUp.longitude];
    const radiusInM = 3000; 

    const [regionDropOff, setRegionDropOff] = useState({
        latitude: dropOffRegion.latitude,
        longitude: dropOffRegion.longitude,
        latitudeDelta:0.0922,
        longitudeDelta: 0.0921,
})

// fetching drivers from firestore
  const fetchDrivers = async () =>{
    setIsLoading(true);
    const bounds = geohashQueryBounds(center, radiusInM);
    const promises = [];
    for(const b of bounds) {
      const q = getNearestDrivers(b)
      promises.push(q.get());
    }


    const snapshots = await Promise.all(promises)
    console.log('snapshots==>',snapshots)
    const matchingDocs = [];

    for(const snap of snapshots) {
      for(const doc of snap.docs){
        const lat = doc.get('lat');
        const lng = doc.get('lng');
        console.log("doc===>",doc)


    //calculating a distance
    const distanceInKm = distanceBetween([lat,lng], center);
    console.log('distance, radiusINM ***', distanceInKm, radiusInM);
    const distanceInM = distanceInKm * 1000;
    if(distanceInM <= radiusInM) {
        matchingDocs.push({...doc.data(), id: doc.id, distanceInKm});
        } 
      }
    }
    setLoadingText(`${matchingDocs.length} Drivers found`)
    console.log("matchingDocs ===>", matchingDocs);
    setIsLoading(false)
    requestDrivers(matchingDocs)
  }

  const requestDrivers = async (matchingDocs) =>{
      await requestDriver(matchingDocs[currentIndex].id,{
        userId: "Qtt4HaEVXHoDGVofJwts",
        lat: pickUpRegion.latitude,
        lng: pickUpRegion.longitude
      })
      Alert.alert("Requesting to 1 driver")
      listenToRequestedDriver(matchingDocs[currentIndex].id)
    }
    const listenToRequestedDriver = (driverId) =>{
      db.collection('drivers').doc(driverId).onSnapshot((doc)=>{
        const data = doc.data();
        if(!data.currentRequest){
          setCurrentIndex(currentIndex + 1);
          requestDrivers();
          setLoadingText("1 driver rejected! Finding another driver")
        }
      })
      db.collection('users').doc('Qtt4HaEVXHoDGVofJwts').onSnapshot((doc)=>{
        const data = doc.data();
        if(data.acceptedRequest){
          setLoadingText("1 driver accepted!");
          storeDropOffLocation('Qtt4HaEVXHoDGVofJwts',regionDropOff,dropOffLocation);
          navigation.navigate('StartRide');
        }
      })
    }

// Calculating Payment

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var lat1 = pickUpRegion.latitude;
    var lon1 = pickUpRegion.longitude;
    var lat2 = dropOffRegion.latitude;
    var lon2 = dropOffRegion.longitude;
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
    return(
        
        <View style={styles.container}>
                {isLoading ? <>
                  <ActivityIndicator size="large" color="black" />
                </>
                :
                <>
                <Text style={{textAlign:"center",fontSize:16}}>{loadingText}</Text>
                </>
                }
            <View style={styles.heading}>
              <Text style={styles.pickUpLocation}>Pick-up Location: <Text style={styles.location}>{pickUpLocation}</Text></Text>
              <Text style={styles.pickUpLocation}>Drop-off Location: <Text style={styles.location}>{dropOffLocation}</Text></Text>
              </View>
              <MapView style={styles.map} initialRegion={pickUpRegion}>
                  <Marker title={pickUpLocation} 
                  coordinate={regionPickUp}/>
                  <Marker title={dropOffLocation} 
                  coordinate={regionDropOff}/>
              </MapView>
        <List.Section>
          <List.Item style={{backgroundColor:"black", borderWidth:1, borderColor:"white"}}
          title='Mini'
          titleStyle={{color:"lightgray"}}
          left={() => <List.Icon icon="car" color="lightgray"/>} 
          onPress={()=>{{
            setPrice(Math.round(25*getDistanceFromLatLonInKm()))
            setSelectedCar('Mini')
            setIsSelected(true)
          }}}
          />
          <List.Item style={{backgroundColor:"black",borderWidth:1, borderColor:"white"}}
          title='Go'
          titleStyle={{color:"lightgray"}}
          left={() => <List.Icon icon="car-side" color="lightgray" />} 
          onPress={()=>{{
            setPrice(Math.round(45*getDistanceFromLatLonInKm()))
             setSelectedCar('Go')
             setIsSelected(true)
            }}}
          />

        <List.Item style={{backgroundColor:"black",borderWidth:1, borderColor:"white"}}
          title='Business'
          titleStyle={{color:"lightgray"}}
          left={() => <List.Icon icon="car-side" color="lightgray" />} 
          onPress={()=>{{
            setPrice(Math.round(60*getDistanceFromLatLonInKm()))
             setSelectedCar('Business')
             setIsSelected(true)
            }}}
          />
        </List.Section>
        <Button mode="contained" style={{backgroundColor:"gray",borderWidth:2, borderColor:"black"}} onPress={fetchDrivers}>
          {selectedCar ? 
          <>{selectedCar} {price} PKR</>
          :
          <>Select Your Ride</>
          }
          </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      fontFamily: 'sans-serif-condensed',
    },
  //   heading: {
  //     marginTop:-15
  //  },
    pickUpLocation: {
        fontWeight:"bold",
        textAlign:"center",
        color:"#000000",
    },
    location: {
        color:"navy",
        textTransform:"capitalize"
    },
    map: {
        height:330,
        width:400,
      },
    buttonText: {
        color:"white",
        fontSize:20,
        paddingTop:10,
        textAlign:"center",
    },
    Btn: {
        backgroundColor:"#000000",
        height:50,
    },
    miniBtn: {
        marginTop:15,
        backgroundColor:"#000000",
        height:50
    },
    goBtn: {
        marginTop:5,
        marginBottom:5,
        backgroundColor:"black",
        height:50
    },
    SelectRide: {
        marginTop:20,
        marginBottom:5,
        backgroundColor:"wheat",
        height:50
    },
    price: {
        fontSize:20,
        paddingTop:10,
        textAlign:"center",
    },
})