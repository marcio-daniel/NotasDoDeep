import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Login';
import Registration from '../screens/Registration';
import Home from '../screens/Home';
import {StatusBar} from 'react-native';
import {Colors} from '../assets/Colors';
import NoteDetail from '../screens/NoteDetail';

export default function AppNavigation() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor={Colors.secundaryColor}
      />
      <Stack.Navigator>
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Registration" component={Registration} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="NoteDetail" component={NoteDetail} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
