import * as React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as Facebook from 'expo-facebook';


export default function Login({setIsSignedIn}){
    return(
        <View>
            <Text style={{fontSize:50}}>Login</Text>
            <Button 
            title="Login with Facebook"
            onPress={facebooklogIn}
            />
        </View>
    )
}

async function facebooklogIn({navigation}) {
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
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }