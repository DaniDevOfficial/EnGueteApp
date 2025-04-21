import React, {ComponentType, ReactElement, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import {Home} from './screens/Home';
import {Login} from './screens/Login';
import {Signup} from './screens/Signup';
import {User} from './screens/User';
import {Group} from './screens/Group';
import {UserProvider} from './context/userContext';
import {BaseLayout} from './layout/BaseLayout';
import {NewMeal} from "./screens/newMeal";
import {GroupProvider} from "./context/groupContext";
import {Meal} from "./screens/Meal";
import {Test} from "./screens/Test";
import {UserSettings} from "./screens/UserSettings";
import {SettingsProvider} from "./context/settingsContext";
import {NewGroup} from "./screens/newGroup";
import {GroupSettings} from "./screens/GroupSettings";
import {GroupMemberList} from "./screens/GroupMemberList";

const Stack = createStackNavigator();

function withBaseLayout<T>(Component: ComponentType<T>) {
    return function WrappedComponent(props: T): ReactElement {
        return (
            <BaseLayout>
                <Component {...props} />
            </BaseLayout>
        );
    };
}


const HomeScreen = withBaseLayout(Home);
const LoginScreen = withBaseLayout(Login);
const SignupScreen = withBaseLayout(Signup);
const UserScreen = withBaseLayout(User);
const UserSettingsScreen = withBaseLayout(UserSettings);
const NewGroupScreen = withBaseLayout(NewGroup);
function GroupContextStack() {
    const GroupStack = createStackNavigator();

    return (
        <GroupProvider>
            <GroupStack.Navigator screenOptions={{headerShown: false}}>
                <GroupStack.Screen name="groupDetails" component={withBaseLayout(Group)}/>
                <GroupStack.Screen name="groupSettings" component={withBaseLayout(GroupSettings)}/>
                <GroupStack.Screen name="memberList" component={withBaseLayout(GroupMemberList)}/>
                <GroupStack.Screen name="newMeal" component={withBaseLayout(NewMeal)}/>
                <GroupStack.Screen name="Meal" component={withBaseLayout(Meal)}/>
            </GroupStack.Navigator>
        </GroupProvider>
    );
}

export function Router() {

    return (
        <SettingsProvider>
            <UserProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="home" screenOptions={{headerShown: false}}>
                        <Stack.Screen name="home" component={HomeScreen}/>
                        <Stack.Screen name="login" component={LoginScreen}/>
                        <Stack.Screen name="signup" component={SignupScreen}/>
                        <Stack.Screen name="user" component={UserScreen}/>
                        <Stack.Screen name="userSettings" component={UserSettingsScreen}/>
                        <Stack.Screen name="newGroup" component={NewGroupScreen}/>
                        <Stack.Screen name="test" component={Test}/>
                        <Stack.Screen name="group" component={GroupContextStack}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </UserProvider>
        </SettingsProvider>
    );
}
