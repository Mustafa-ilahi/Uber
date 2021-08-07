import React from "react";
import { View, Text, Button } from "react-native";

export default function Dashboard({navigation}) {
    console.log("Navigation from dashboard",navigation) 
    return(
        <View>
            <Text style={{fontSize:40}}>DASHBOARD SCREEN</Text>
            <Button 
            title="goto Login"
            onPress={()=>navigation.navigate('Login')}
            />
        </View>
    )
}