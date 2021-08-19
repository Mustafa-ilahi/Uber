import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useState } from "react";

import Dashboard from '../views/Dashboard';
import DropOff from '../views/DropOff';
import FavoriteLocations from '../views/FavoriteLocations';
import YourTrips from '../views/YourTrips';
import TripDetails from '../views/TripDetails';
import Login from "../views/Login";
import SelectRide from "../views/SelectRide";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


export default function MainNavigator() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    // console.log('isSigned In', isSignedIn)
    return<NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                {
                    isSignedIn ?
                <Stack.Screen name="Auth" component={()=> <AuthNavigator setIsSignedIn={setIsSignedIn}/>} />
                :
                <Stack.Screen name="App" component={AppNavigator} />
                }
            </Stack.Navigator>
    </NavigationContainer>
}

function AuthNavigator({setIsSignedIn}) {
    return<Stack.Navigator screenOptions={{headerShown: true}}>
                <Stack.Screen 
                name="Login"
                component={()=> <Login setIsSignedIn={setIsSignedIn}/>} />
            </Stack.Navigator>
}
function AppNavigator(){
    return  <Drawer.Navigator>
    <Drawer.Screen name="Dashboard Stack" component={DashboardStack} />
    <Drawer.Screen name="Trips Stack" component={TripsStack} />
    <Drawer.Screen name="Login" component={Login} />
    {/* <Drawer.Screen name="DropOff" component={DropOff} /> */}
  </Drawer.Navigator>
  }

function DashboardStack() {
    return  <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="DropOff" component={DropOff} />      
      <Stack.Screen name="SelectRide" component={SelectRide} />      
    </Stack.Navigator>
}

function DashboardTabs() {
    return <Stack.Navigator>
    <Stack.Screen name="DashboardTab" component={Dashboard} />
    <Stack.Screen name="FavoriteTab" component={FavoriteLocations} />
  </Stack.Navigator>
}

function TripsStack() {
    return  <Stack.Navigator>
    <Stack.Screen name="Your Trips" component={YourTrips} />
    <Stack.Screen name="Trip Details" component={TripDetails} />
  </Stack.Navigator>
}