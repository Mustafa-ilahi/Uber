import * as React from 'react';
import { View, Text, Button, Alert } from 'react-native';
// import * as Facebook from 'expo-facebook';


export default function Login({setIsSignedIn}){
    return(
        <View>
            <Text style={{fontSize:50}}>Login</Text>
            <Button 
            title="Login"
            />
        </View>
    )
}