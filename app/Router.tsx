import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import {Home} from './screens/Home';
import {Login} from './screens/Login';
import {Signup} from './screens/Signup';
import {User} from './screens/User';
import {UserProvider} from './context/userContext';

const Stack = createStackNavigator();

export function Router() {
    return (
        <UserProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
                    <Stack.Screen name="Home" component={Home}/>
                    <Stack.Screen name="login" component={Login}/>
                    <Stack.Screen name="signup" component={Signup}/>
                    <Stack.Screen name="user" component={User}/>
                </Stack.Navigator>
            </NavigationContainer>
        </UserProvider>

    );
}