import React, {
    ComponentType,
    ReactElement,
    useEffect,
    useState,
} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import * as Linking from 'expo-linking';

import {Home} from './screens/Home';
import {Login} from './screens/Login';
import {Signup} from './screens/Signup';
import {User} from './screens/User';
import {Group} from './screens/Group';
import {NewMeal} from './screens/newMeal';
import {Meal} from './screens/Meal';
import {Test} from './screens/Test';
import {UserSettings} from './screens/UserSettings';
import {GroupSettings} from './screens/GroupSettings';
import {GroupMemberList} from './screens/GroupMemberList';
import {Invites} from './screens/Invites';
import {ForgotPassword} from './screens/ForgotPassword';

import {UserProvider} from './context/userContext';
import {GroupProvider} from './context/groupContext';
import {SettingsProvider} from './context/settingsContext';

import {BaseLayout} from './layout/BaseLayout';

import {getRefreshToken} from './utility/Auth';
import {setPendingInviteToken} from './utility/DeepLinking';
import {TokenPopupHandler} from './components/Utility/JoinGroupPopup';

const Stack = createNativeStackNavigator();
const GroupStack = createNativeStackNavigator();

function withBaseLayout<T extends object> (
    Component: ComponentType<T>,
    noPadding = false,
) {
    return function WrappedComponent (props: T): ReactElement {
        return (
            <BaseLayout noPadding={noPadding}>
                <Component {...props} />
            </BaseLayout>
        );
    };
}

/*
 * Create these once instead of creating new component
 * references every time GroupContextStack renders.
 */
const GroupScreen = withBaseLayout(Group);
const GroupSettingsScreen = withBaseLayout(GroupSettings);
const GroupMemberListScreen = withBaseLayout(GroupMemberList);
const NewMealScreen = withBaseLayout(NewMeal);
const MealScreen = withBaseLayout(Meal);
const InvitesScreen = withBaseLayout(Invites);

const HomeScreen = withBaseLayout(Home, true);
const LoginScreen = withBaseLayout(Login);
const SignupScreen = withBaseLayout(Signup);
const ForgotPasswordScreen = withBaseLayout(ForgotPassword);
const UserScreen = withBaseLayout(User);
const UserSettingsScreen = withBaseLayout(UserSettings);

function GroupContextStack () {
    return (
        <GroupProvider>
            <GroupStack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <GroupStack.Screen
                    name="groupDetails"
                    component={GroupScreen}
                />

                <GroupStack.Screen
                    name="groupSettings"
                    component={GroupSettingsScreen}
                />

                <GroupStack.Screen
                    name="memberList"
                    component={GroupMemberListScreen}
                />

                <GroupStack.Screen
                    name="newMeal"
                    component={NewMealScreen}
                />

                <GroupStack.Screen
                    name="meal"
                    component={MealScreen}
                />

                <GroupStack.Screen
                    name="invites"
                    component={InvitesScreen}
                />
            </GroupStack.Navigator>
        </GroupProvider>
    );
}

export function RouterWrapper () {
    return (
        <SettingsProvider>
            <UserProvider>
                <NavigationContainer>
                    <Router />
                </NavigationContainer>
            </UserProvider>
        </SettingsProvider>
    );
}

export function Router () {
    const [inviteToken, setInviteToken] = useState<string | null>(null);

    useEffect(() => {
        const sub = Linking.addEventListener('url', ({url}) => {
            handleUrl(url);
        });

        Linking.getInitialURL().then((url) => {
            if (url) {
                handleUrl(url);
            }
        });

        return () => {
            sub.remove();
        };
    }, []);

    async function handleUrl (url: string) {
        setInviteToken(null);

        const {path, queryParams} = Linking.parse(url);
        const token = queryParams?.token;

        if (
            path !== 'invite' ||
            typeof token !== 'string' ||
            token === ''
        ) {
            return;
        }

        const refreshToken = await getRefreshToken();

        if (refreshToken) {
            setTimeout(() => {
                setInviteToken(token);
            }, 500);

            return;
        }

        await setPendingInviteToken(token);
    }

    return (
        <>
            {inviteToken && (
                <TokenPopupHandler
                    token={inviteToken}
                />
            )}

            <Stack.Navigator
                initialRouteName="home"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name="home"
                    component={HomeScreen}
                />

                <Stack.Screen
                    name="login"
                    component={LoginScreen}
                />

                <Stack.Screen
                    name="signup"
                    component={SignupScreen}
                />

                <Stack.Screen
                    name="forgotPassword"
                    component={ForgotPasswordScreen}
                />

                <Stack.Screen
                    name="user"
                    component={UserScreen}
                />

                <Stack.Screen
                    name="userSettings"
                    component={UserSettingsScreen}
                />

                <Stack.Screen
                    name="test"
                    component={Test}
                />

                <Stack.Screen
                    name="group"
                    component={GroupContextStack}
                />
            </Stack.Navigator>
        </>
    );
}