import * as React from 'react';
import { View, Text, StyleSheet,Dimensions, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView ,{Marker} from 'react-native-maps';
import { useEffect, useState } from 'react/cjs/react.development';
import db, {rejectRequest, storeDriverLocation, acceptedRequest} from '../../config/firebase'
import { geohashForLocation, geohashQueryBounds, distanceBetween} from 'geofire-common';

export default function DriverDashboard(){
    const [currentLocation, setCurrentLocation] = useState('');
    const [pickUpLocation, setPickUpLocation] = useState('');
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    
    const [region, setRegion] = useState({
        latitude: 24.9323526,
        longitude: 67.0872638,
        latitudeDelta: 0.0022,
        longitudeDelta: 0.0021,
})

  useEffect(()=>{
    listenToRequests()
  },[])

  const listenToRequests = () =>{
    db.collection('drivers').doc('eRKtPetBcnXj16DjgJ3b').onSnapshot((doc)=>{
      console.log('doc data==>',doc.data());
      const data =  doc.data()
       if(data.currentRequest){
        //  console.log("userID==>",data.currentRequest.userId)
         Alert.alert(
          "Ride Request",
          "1 user requested a ride",
          [
            {
              text: "Accept",
              onPress: ()=> acceptedRequest(data.currentRequest.userId,{
                driverId: 'eRKtPetBcnXj16DjgJ3b',
                lat: region.latitude,
                lng: region.longitude
              }),
              style: "Ok"
            },
            
            {
              text: "Reject",
              onPress: ()=> rejectRequest('eRKtPetBcnXj16DjgJ3b'),
              style: "cancel"
            }
          ],
          {
            cancelable: true,
            onDismiss: () => Alert.alert("This alert was dismissed by tapping outing")
          }
          );
        
      }
    })
  }

    useEffect(()=>{
      
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

            Location.watchPositionAsync({
                distanceInterval: 0.01
            }, async(location) => {
                const {coords: {latitude, longitude}} = location
                setRegion({...region, latitude, longitude});
                console.log('location***', location)
                const lat = 24.9323526;
                const lng = 67.087263;
                try{
                  const hash = geohashForLocation([lat,lng]);
                  await storeDriverLocation('eRKtPetBcnXj16DjgJ3b',{
                    geohash: hash, lat, lng
                  })
                  console.log("chala gya")
                }catch(e){
                  console.log("nh gya",e)
                }
            })
            
            
            fetch('https://api.foursquare.com/v2/venues/search?client_id=WW3RFWSW52A4L14OURWZ2RKBJBQAN0WZK4P02JUZMMH15N0B&client_secret=Y500SBLI0E0XCQOEFB0OPOKHY0HNDC2UEI50GDTBYOH0DHRC&ll=24.9121428,67.0545419&v=20180323')
              .then(res => res.json())
              .then(res => setCurrentLocation(res.response.venues[0].name))
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
            <MapView style={styles.map} region={region}>
            <Marker
            image={require('../../../assets/car.png')}
            style={{height:10,width:0}}
            coordinate={region}
            />
        </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
    });