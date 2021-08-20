import * as React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as Facebook from 'expo-facebook';
import { useState } from 'react';
import Dashboard from '../Dashboard';

export default function Login({setIsSignedIn, setDriverSignedIn}){
  const [userInfo, setUserInfo] = useState();
  const [driverInfo, setDriverInfo] = useState();
  return(
    <View>  
              {/* <Text style={{fontSize:50}}>Login</Text> */}
              <Button 
              title="Login as User"
              onPress={userFacebookLogIn}
              />
              <Text>{"\n"}</Text>
              <Button 
              title="Login as Driver"
              onPress={driverFacebookLogIn}
              />
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
          const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
          const userInfo = await response.json();
          setUserInfo(userInfo);
          Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
          setIsSignedIn(true);
          setDriverSignedIn(false);
        } else {
          // type === 'cancel'
        }
      } catch ({ message }) {
        alert(`Facebook Login Error: ${message}`);
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
        const driverInfo = await response.json();
        setDriverInfo(driverInfo);
        Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
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
  