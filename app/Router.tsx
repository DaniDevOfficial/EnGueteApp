import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { Home } from './screens/Home';
import {Login} from "./screens/Login";
import {Signup} from "./screens/Signup";

const Stack = createStackNavigator();

export function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="signup" component={Signup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
