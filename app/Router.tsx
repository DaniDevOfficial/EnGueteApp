import React, {ComponentType, ReactElement, useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {Home} from './screens/Home';
import {Login} from './screens/Login';
import {Signup} from './screens/Signup';
import {User} from './screens/User';
import {Group} from './screens/Group';
import {UserProvider, useUser} from './context/userContext';
import {BaseLayout} from './layout/BaseLayout';
import {NewMeal} from "./screens/newMeal";
import {GroupProvider} from "./context/groupContext";
import {Meal} from "./screens/Meal";
import {Test} from "./screens/Test";
import {UserSettings} from "./screens/UserSettings";
import {SettingsProvider, useSettings} from "./context/settingsContext";
import {NewGroup} from "./screens/newGroup";
import {GroupSettings} from "./screens/GroupSettings";
import {GroupMemberList} from "./screens/GroupMemberList";
import {Invites} from "./screens/Invites";
import * as Linking from 'expo-linking';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Alert} from "react-native";
import {JoinGroupWithToken} from "./repo/group/Invites";
import {getRefreshToken} from "./utility/Auth";
import {useTexts} from "./utility/TextKeys/TextKeys";

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


function GroupContextStack() {
    const GroupStack = createStackNavigator();

    return (
        <GroupProvider>
            <GroupStack.Navigator screenOptions={{headerShown: false}}>
                <GroupStack.Screen name="groupDetails" component={withBaseLayout(Group)}/>
                <GroupStack.Screen name="groupSettings" component={withBaseLayout(GroupSettings)}/>
                <GroupStack.Screen name="memberList" component={withBaseLayout(GroupMemberList)}/>
                <GroupStack.Screen name="newMeal" component={withBaseLayout(NewMeal)}/>
                <GroupStack.Screen name="meal" component={withBaseLayout(Meal)}/>
                <GroupStack.Screen name="invites" component={withBaseLayout(Invites)}/>
            </GroupStack.Navigator>
        </GroupProvider>
    );
}

const HomeScreen = withBaseLayout(Home);
const LoginScreen = withBaseLayout(Login);
const SignupScreen = withBaseLayout(Signup);
const UserScreen = withBaseLayout(User);
const UserSettingsScreen = withBaseLayout(UserSettings);
const NewGroupScreen = withBaseLayout(NewGroup);

export function RouterWrapper() {
    return (
        <SettingsProvider>
            <UserProvider>
                <Router/>
            </UserProvider>
        </SettingsProvider>
    );
}

export function Router() {
    const {user} = useUser();
    const [handledUrls] = useState(new Set<string>());
    useEffect(() => {
        const sub = Linking.addEventListener('url', ({url}) => handleUrl(url));
        Linking.getInitialURL().then((url) => url && handleUrl(url));

        return () => sub.remove();
    }, []);

    const [text] = useState(useTexts(['maybeLater', 'joinGroup', 'youWereInvited', 'groupInvite']));


    async function handleUrl(url: string) {
        if (handledUrls.has(url)) {
            return;
        }

        handledUrls.add(url);
        const {path, queryParams} = Linking.parse(url);

        if (path === 'invite' && queryParams?.token && queryParams?.token !== '') {
            await AsyncStorage.setItem('pendingInviteToken', queryParams.token);
            const refreshToken = await getRefreshToken();

            if (user.userId !== '' && refreshToken) {
                await handleInviteToken(false, text);
            }
        }
    }


    return (
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
    );
}

interface invitePopupText {
    groupInvite: string,
    youWereInvited: string,
    joinGroup: string,
    maybeLater: string,
}

export async function handleTokenPopup(text: invitePopupText, token: string, navigation: any) {
    Alert.alert(text.groupInvite, text.youWereInvited, [
        {
            text: text.joinGroup,
            onPress: () => handleJoiningGroup(token, navigation),
        },
        {text: text.maybeLater, style: 'cancel'},
    ]);
}


export async function handleInviteToken(navigation: any, text: invitePopupText) {
    const token = await AsyncStorage.getItem('pendingInviteToken');

    if (!token) {
        return;
    }
    await AsyncStorage.removeItem('pendingInviteToken');

    setTimeout(() => {
        handleTokenPopup(text, token, navigation);
    }, 500);

}

async function handleJoiningGroup(token: string, navigation: any) {
    const response = await JoinGroupWithToken(token);
    //TODO: error handeling
    if (navigation) {
        navigation.navigate('group', {
            screen: 'groupDetails',
            params: {
                groupId: response.groupId,
            },
        });
    }
}

