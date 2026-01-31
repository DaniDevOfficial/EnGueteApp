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
import {SettingsProvider} from "./context/settingsContext";
import {NewGroup} from "./screens/newGroup";
import {GroupSettings} from "./screens/GroupSettings";
import {GroupMemberList} from "./screens/GroupMemberList";
import {Invites} from "./screens/Invites";
import * as Linking from 'expo-linking';
import {getRefreshToken} from "./utility/Auth";
import {TokenPopupHandler} from "./components/Utility/JoinGroupPopup";
import {setPendingInviteToken} from "./utility/DeepLinking";
import {ForgotPassword} from "./screens/ForgotPassword";

const Stack = createStackNavigator();

function withBaseLayout<T>(Component: ComponentType<T>, noPadding = false) {
    return function WrappedComponent(props: T): ReactElement {
        return (
            <BaseLayout noPadding={noPadding}>
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

const HomeScreen = withBaseLayout(Home, true);
const LoginScreen = withBaseLayout(Login);
const SignupScreen = withBaseLayout(Signup);
const ForgotPasswordScreen = withBaseLayout(ForgotPassword);
const UserScreen = withBaseLayout(User);
const UserSettingsScreen = withBaseLayout(UserSettings);
const NewGroupScreen = withBaseLayout(NewGroup);

export function RouterWrapper() {
    return (
        <SettingsProvider>
            <UserProvider>
                <NavigationContainer>
                    <Router/>
                </NavigationContainer>
            </UserProvider>
        </SettingsProvider>
    );
}

export function Router() {
    const {user} = useUser();
    const [inviteToken, setInviteToken] = useState<string | null>(null);

    useEffect(() => {
        const sub = Linking.addEventListener('url', ({url}) => handleUrl(url));
        // @ts-ignore
        Linking.getInitialURL().then((url) => url && handleUrl(url));

        return () => sub.remove();
    }, []);


    async function handleUrl(url: string) {
        setInviteToken(null);
        const {path, queryParams} = Linking.parse(url);
        const inviteToken = queryParams?.token;

        if (path === 'invite' && inviteToken && inviteToken !== '' && typeof inviteToken === 'string') {
            const refreshToken = await getRefreshToken();
            if (refreshToken) {
                setTimeout(() => {
                    setInviteToken(inviteToken);
                }, 500);
            } else {
                await setPendingInviteToken(inviteToken);
            }
        }
    }


    return (
        <>
            {inviteToken && (
                <TokenPopupHandler
                    token={inviteToken}
                />
            )}
            <Stack.Navigator initialRouteName="home" screenOptions={{headerShown: false}}>
                <Stack.Screen name="home" component={HomeScreen}/>
                <Stack.Screen name="login" component={LoginScreen}/>
                <Stack.Screen name="signup" component={SignupScreen}/>
                <Stack.Screen name="forgotPassword" component={ForgotPasswordScreen}/>
                <Stack.Screen name="user" component={UserScreen}/>
                <Stack.Screen name="userSettings" component={UserSettingsScreen}/>
                <Stack.Screen name="newGroup" component={NewGroupScreen}/>
                <Stack.Screen name="test" component={Test}/>
                <Stack.Screen name="group" component={GroupContextStack}/>
            </Stack.Navigator>
        </>
    );
}



