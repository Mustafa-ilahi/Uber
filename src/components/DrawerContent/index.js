import React, { useEffect, useState } from 'react';
import { View , StatusBar} from 'react-native';
import { 
    DrawerContentScrollView ,
    DrawerItem 
} from '@react-navigation/drawer';
import {
    Avatar,
    Title,
    Text,
    Switch,
    Drawer,
} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function DrawerContent(props){
    const [userInfo,setUserInfo] = useState()

    // const getUser = () =>{
    //     db.collection('FbUser').doc('2lZRkZDbPLOjsjpnmZkU').onSnapshot((doc)=>{
    //         const data = doc.data()
    //         console.log('drawerdata',data)
    //         if(data){
    //             setUserInfo(data)
    //         }
    //     })
    // }

    return (
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                {/* {console.log('drawaerprops==>',props)} */}
                <View style={{flex:1}}>
                <StatusBar animated='auto'/>
                <Drawer.Section style={{marginTop:-5,backgroundColor:'black'}}>
                    <View style={{paddingLeft:20,marginBottom:100}}>
                        <View style={{flexDirection:'row',marginTop:15}}>
                            <Avatar.Image
                            source={{
                                uri:'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=4186122144841730&height=200&width=200&ext=1632401469&hash=AeQijQHLq3F5EzrBuCM'                   
                            }}
                            size={70}
                            />
                        <View style={{marginLeft:15}}>
                            <Title style={{fontSize:17,marginTop:15,color:'white'}}>Mustafa Ilahi</Title>
                        </View>
                        </View>
                    </View>
                    </Drawer.Section>

                    <Drawer.Section style={{marginTop:15}}>
                        <DrawerItem
                        icon={({color,size})=>(
                            <Icon
                            name='home-outline'
                            color={color}
                            size={size}
                            />
                            )}
                            label="Dashboard"
                            onPress={()=>{props.navigation.navigate('Dashboard Stack')}}
                            />

                         <DrawerItem
                        icon={({color,size})=>(
                            <Icon
                            name='car'
                            color={color}
                            size={size}
                            />
                            )}
                            label="Trips Details"
                            onPress={()=>{props.navigation.navigate('Trips Stack')}}
                            />
                    </Drawer.Section>

                </View>
            </DrawerContentScrollView>
        </View>
    )
}