import * as React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as Facebook from 'expo-facebook';
import { useState } from 'react';
import Dashboard from '../Dashboard';

export default function Login(){
  const [loginStatus, setLoginStatus] = useState(false)
  console.log(loginStatus)
  return(
    <View>  
            {loginStatus ? <Dashboard /> :
              <>
              <Text style={{fontSize:50}}>Login</Text>
              <Button 
              title="Login with Facebook"
              onPress={facebooklogIn}
              />
            </>
            }
        </View>
    )
    async function facebooklogIn() {
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
          Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
          setLoginStatus(true)    
              
        } else {
          // type === 'cancel'
        }
      } catch ({ message }) {
        alert(`Facebook Login Error: ${message}`);
      }
      console.log("==>Milgya?",loginStatus)
    }
  }
  