import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { Home } from './screens/Home';
import { Login } from './screens/Login';
import { Signup } from './screens/Signup';
import { User } from './screens/User';
import { Group } from './screens/Group';
import { UserProvider } from './context/userContext';
import { BaseLayout } from './layout/BaseLayout';

const Stack = createStackNavigator();

// Create wrapped components outside of Router
const HomeScreen = () => (
    <BaseLayout>
        <Home />
    </BaseLayout>
);

const LoginScreen = () => (
    <BaseLayout>
        <Login />
    </BaseLayout>
);

const SignupScreen = () => (
    <BaseLayout>
        <Signup />
    </BaseLayout>
);

const UserScreen = () => (
    <BaseLayout>
        <User />
    </BaseLayout>
);

const GroupDetailsScreen = () => (
    <BaseLayout>
        <Group />
    </BaseLayout>
);

export function Router() {
    return (
        <UserProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="home" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="home" component={HomeScreen} />
                    <Stack.Screen name="login" component={LoginScreen} />
                    <Stack.Screen name="signup" component={SignupScreen} />
                    <Stack.Screen name="user" component={UserScreen} />
                    <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </UserProvider>
    );
}
