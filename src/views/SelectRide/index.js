import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,Button } from 'react-native';
import { useState } from 'react';
import MapView ,{Marker} from 'react-native-maps';

export default function SelectRide({route,navigation},props){
    const [price,setPrice] = useState();
    const [selectedCar,setSelectedCar] = useState();
    const [isSelected,setIsSelected] = useState(false);
    const {pickUpLocation, dropOffLocation,pickUpRegion,dropOffRegion} = route.params;
    const [regionPickUp, setRegionPickUp] = useState({
        latitude: pickUpRegion.latitude,
        longitude: pickUpRegion.longitude,
        latitudeDelta:0.00922,
        longitudeDelta: 0.00921,
})

    const [regionDropOff, setRegionDropOff] = useState({
        latitude: dropOffRegion.latitude,
        longitude: dropOffRegion.longitude,
        latitudeDelta:0.00922,
        longitudeDelta: 0.00921,
})

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
            <Text style={styles.pickUpLocation}>PickUp Location: <Text style={styles.location}>{pickUpLocation}</Text></Text>
            <Text style={styles.pickUpLocation}>DropOff Location: <Text style={styles.location}>{dropOffLocation}</Text></Text>
            {/* <Text>{"\n"}</Text> */}
            <MapView style={styles.map} initialRegion={pickUpRegion}>
                <Marker title={pickUpLocation} 
                coordinate={regionPickUp}/>
                <Marker title={dropOffLocation} 
                coordinate={regionDropOff}/>
            </MapView>
            {/* <Text>{"\n"}</Text> */}
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
        <View style={styles.SelectRide}>
            <TouchableOpacity >
                {selectedCar ? 
                <><Text>{selectedCar} {price} PKR</Text></>
                :
                <Text style={styles.buttonText}>Select Your Ride</Text>
            }
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
        marginTop:5,
        marginBottom:5,
        backgroundColor:"darkgray",
        height:50
    }
})