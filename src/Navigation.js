import React from "react";
import {View, Text} from "react-native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import Menu from "./components/home/Menu";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Pdf from './screens/Pdf';
import Chat from "./screens/grafica";




const Tab = createBottomTabNavigator()

const Navigation = () => {
    return (
        <Tab.Navigator initialRouteName="Pdf">
            <Tab.Screen name="Home" component={Menu} options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons name="home-account" color={color} size={30}/>
                )
            }}/>
           
            <Tab.Screen name={'Pdf'} component={Pdf} options={{
                tabBarLabel: 'Pdf',
                tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons name={'file-pdf-box'} color={'red'} size={30}/>
                )
            }}/>

        
            <Tab.Screen name={'GRAFICA'} component={Chat} options={{
                            tabBarLabel: 'Grafica',
                            tabBarIcon: ({color}) => (
                                <MaterialCommunityIcons name={'chat'} color={'blue'} size={30}/>
                            )
                        }}/>
            
        </Tab.Navigator>
    )
}

export default Navigation