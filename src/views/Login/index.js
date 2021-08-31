import * as React from 'react';
import { View, Text, Alert, Image,StyleSheet } from 'react-native';
import * as Facebook from 'expo-facebook';
import { useState } from 'react';
import Dashboard from '../Dashboard';
import {userLogInData} from '../../config/firebase';
import { Button } from 'react-native-paper';

export default function Login({setIsSignedIn, setDriverSignedIn}){
  const [userFbData, setUserFbData] = useState([]);
  const [driverData, setDriverInfo] = useState([]);
  return(
    <View>  
        <Text style={styles.heading}>Welcome to Uber</Text>
        <View style={style=styles.imgContainer}>
          <Image source={require('../../../assets/ubericon.png')} style={styles.img}/>
        </View>
        <Text>{"\n"}</Text>
        <Button mode="contained" style={{backgroundColor:"black"}} onPress={userFacebookLogIn}>Login as User</Button>
        <Text>{"\n"}</Text>
        <Button mode="contained" style={{backgroundColor:"black"}} onPress={driverFacebookLogIn}>Login as Driver</Button>
        </View>
    )
    async function userFacebookLogIn() {
      try {
        await Facebook.initializeAsync({
          appId: '368317494901331',
          });
          const {
          type,
          token,
          expirationDate,
          permissions,
          declinedPermissions,
        } = await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile'],
        });
        if (type === 'success') {
          // Get the user's name using Facebook's Graph API
          const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`);
          const userFbData = await response.json();
          setUserFbData(userFbData)
          try{
            await userLogInData(userInfo)
            console.log("fb data sending successfully");
          }
          catch(e){
            console.log("unable to send fb data")
          }
          // Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
          setIsSignedIn(true);
          setDriverSignedIn(false);
        } else {
          // type === 'cancel'
        }
      } catch ({ message }) {
        // alert(`Facebook Login Error: ${message}`);
      }
    }

  // For driver login
  async function driverFacebookLogIn() {
    try {
      await Facebook.initializeAsync({
        appId: '368317494901331',
        });
        const {
        type,
        token,
        expirationDate,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        // const driverInfo = await response.json();
        // setDriverInfo(driverInfo);
        // Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
        setIsSignedIn(true); 
        setDriverSignedIn(true);
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }
  }

  const styles = StyleSheet.create({
    heading : {
      fontSize: 25, 
      textAlign:"center", 
      fontFamily: 'sans-serif-condensed',
      marginTop: 15,
    },
    imgContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10
    },
    img: {
      height:70,
      width: 70
    }
  })