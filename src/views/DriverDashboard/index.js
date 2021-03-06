import * as React from 'react';
import { View, Text, StyleSheet,Dimensions, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView ,{Marker} from 'react-native-maps';
import { useEffect, useState } from 'react/cjs/react.development';
import db, {rejectRequest, storeDriverLocation, acceptedRequest} from '../../config/firebase'
import { geohashForLocation, geohashQueryBounds, distanceBetween} from 'geofire-common';

export default function DriverDashboard({navigation}){
    const [currentLocation, setCurrentLocation] = useState('');
    const [pickUpLocation, setPickUpLocation] = useState('');
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    
    const [region, setRegion] = useState({
        latitude: 24.9218401,
        longitude: 67.0601765,
        latitudeDelta: 0.0022,
        longitudeDelta: 0.0021,
})

  useEffect(()=>{
    listenToRequests()
  },[])

  const listenToRequests = () =>{
    db.collection('drivers').doc('ql5ZsQpDd667aUZVwvfZ').onSnapshot((doc)=>{
      console.log('doc data==>',doc.data());
      const data =  doc.data()
       if(data.currentRequest){
        //  console.log("userID==>",data.currentRequest.userId)
         Alert.alert(
          "Ride Request",
          "1 user requested a ride",
          [
            {
              // StartRideDriver
              text: "Accept",
              onPress: ()=>{ acceptedRequest(data.currentRequest.userId,{
                driverId: 'eRKtPetBcnXj16DjgJ3b',
                lat: region.latitude,
                lng: region.longitude
              });
               navigation.navigate("Ride Screen")
            }
              ,
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
                const lat = 24.90;
                const lng = 67.08;
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
            
            
            fetch(`https://api.foursquare.com/v2/venues/search?client_id=QEJ3YKKOS5HOCE4ANKTO4UWF1ERT4SJBNIXPWZGBE0VY02UI&client_secret=QD2I1K00RYVZ5A4TGQFUK3FVZOY44CPZX2NNA25KDQP5NVLI&ll=${region.latitude},${region.longitude}&v=20180323`)
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