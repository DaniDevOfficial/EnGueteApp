import {Alert} from "react-native";
import {JoinGroupWithToken} from "../../repo/group/Invites";
import {removePendingInviteToken} from "../../utility/DeepLinking";
import {useEffect} from "react";
import {useNavigation} from "@react-navigation/native";
import {useTexts} from "../../utility/TextKeys/TextKeys";

export function TokenPopupHandler({token}: { token: string }) {
    const navigation = useNavigation();
    const text = useTexts(['groupInvite', 'youWereInvited', 'joinGroup', 'maybeLater'])
    useEffect(() => {
        async function showAlertIfThereIsAValidJoinToken() {
            await removePendingInviteToken();
            // TODO: maybe a backend call to check if the token is valid and if the group exists and if the user is not already in the group
            setTimeout(() => {
                Alert.alert(text.groupInvite, text.youWereInvited, [
                    {
                        text: text.joinGroup,
                        onPress: () => handleJoiningGroup(token, navigation),
                    },
                    {
                        text: text.maybeLater,
                        style: 'cancel',
                    },
                ]);
            }, 500);
        }

        showAlertIfThereIsAValidJoinToken();
    }, []);

    return null;
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

