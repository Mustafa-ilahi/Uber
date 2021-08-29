import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,Button,Alert, ActivityIndicator } from 'react-native';
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
    const [loadingText,setLoadingText] = useState('Finding Drivers');
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
    // setIsLoading(false)
    console.log("matchingDocs ===>", matchingDocs);
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
      navigation.navigate('StartRide');
    }
    const listenToRequestedDriver = (driverId) =>{
      db.collection('drivers').doc(driverId).onSnapshot((doc)=>{
        const data = doc.data();
        if(!data.currentRequest){
          setCurrentIndex(currentIndex + 1);
          requestDrivers();
          setLoadingText("1 driver rejected! Finding another driver");
        }
      })
      db.collection('users').doc('Qtt4HaEVXHoDGVofJwts').onSnapshot((doc)=>{
        const data = doc.data();
        if(data.acceptedRequest){
          setIsLoading(false)
          setLoadingText("1 driver accepted!");
          storeDropOffLocation('Qtt4HaEVXHoDGVofJwts',regionDropOff);

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
                {isLoading && <>
                <Image 
                style={{height:100}}
                source={{uri: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif?cid=ecf05e4736p8duzse7v642wwy2bnkh3xsdcgndlxf1l4p9cn&rid=giphy.gif&ct=g"}}/>
                <Text style={{textAlign:"center",fontSize:16}}>{loadingText}</Text>
                </>
                }
            <View style={styles.SelectRide}>
            <TouchableOpacity onPress={fetchDrivers}>
                {/* {selectedCar ? 
                <><Text style={styles.price}>Lets Ride!</Text></>
                : */}
                <Text style={styles.buttonText}>Lets Ride!</Text>
            {/* } */}
            </TouchableOpacity>
        </View>
            <Text style={styles.pickUpLocation}>PickUp Location: <Text style={styles.location}>{pickUpLocation}</Text></Text>
            <Text style={styles.pickUpLocation}>DropOff Location: <Text style={styles.location}>{dropOffLocation}</Text></Text>
            {/* <Text>{"\n"}</Text> */}
            <MapView style={styles.map} initialRegion={pickUpRegion}>
                <Marker title={pickUpLocation} 
                coordinate={regionPickUp}/>
                <Marker title={dropOffLocation} 
                coordinate={regionDropOff}/>
            </MapView>
        <View style={styles.miniBtn}>
            <TouchableOpacity onPress={()=>{{
            setPrice(Math.round(25*getDistanceFromLatLonInKm()))
             setSelectedCar('Mini')
             setIsSelected(true)
              }}}>

                <Text style={styles.buttonText}>Mini</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.goBtn}>
            <TouchableOpacity onPress={()=>{{
            setPrice(Math.round(45*getDistanceFromLatLonInKm()))
             setSelectedCar('Go')
             setIsSelected(true)
              }}}>
                <Text style={styles.buttonText}>Go</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.Btn}>
            <TouchableOpacity onPress={()=>{{
            setPrice(Math.round(60*getDistanceFromLatLonInKm()))
             setSelectedCar('Business')
             setIsSelected(true)
              }}}>
                <Text style={styles.buttonText}>Business</Text>
            </TouchableOpacity>
        </View>
        
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "lightgray"
    },
    pickUpLocation: {
        fontWeight:"bold",
        textAlign:"center",
        color:"#000000"
    },
    location: {
        color:"red",
        textTransform:"capitalize"
    },
    map: {
        height:350,
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
    }
})