import React from "react";
import { View, Text, Button } from "react-native";

export default function Dashboard({navigation}) {
    return(
        <View>
            <Text style={{fontSize:40}}>DASHBOARD SCREEN</Text>
            <Button 
            title="goto dropOff screen"
            onPress={()=>navigation.navigate('DropOff')}
            />
        </View>
    )
}