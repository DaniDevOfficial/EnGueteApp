import {CommonActions, NavigationProp} from "@react-navigation/native";


export function resetToHomeScreen(navigation: NavigationProp<any>) {
    navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: 'home' }],
        })
    );
}
export function resetToUserScreen(navigation: NavigationProp<any>) {
    navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: 'user' }],
        })
    );
}