import React, {useState} from "react";
import {BackButton} from "../components/UI/BackButton";
import {Box, Icon, Image, ScrollView, VStack} from "native-base";
import {useUser} from "../context/userContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import {TouchableOpacity} from "react-native";
import {TextUpdate} from "../components/settings/TextUpdate";
import {useText} from "../utility/TextKeys/TextKeys";
import {DangerZone} from "../components/settings/DangerZone";
import {useGroup} from "../context/groupContext";
import {UpdateGroupName, UpdateGroupNameType} from "../repo/Group";


export function GroupSettings() {
    const user = useUser();
    const [imageSrc, setImageSrc] = useState(user.user.profilePicture || 'https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png');
    const group = useGroup();
    group.group.groupId

        function handleEditImage() {
    }

    async function handleEditGroupName(newGroupName: string) {
        const params: UpdateGroupNameType = {
            groupId: group.group.groupId,
            groupName: newGroupName,
        }
        try {
            const response = await UpdateGroupName(params)
            group.setGroup({
                ...group.group,
                groupName: newGroupName,
            });

        } catch (e) {
            console.log(e.message)
        }
    }

    return (
        <>
            <BackButton/>
            <ScrollView>
                <VStack maxH={'100%'} flex={1} alignItems="center" p={"10px 5px"} space={4}>

                    <Box position="relative" width="70px" height="70px">
                        <Image
                            source={{uri: imageSrc}}
                            alt="Profile picture"
                            onError={() =>
                                setImageSrc(
                                    "https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png"
                                )
                            }
                            width="70px"
                            height="70px"
                            borderRadius="full"
                        />

                        <TouchableOpacity onPress={handleEditImage}>
                            <Icon
                                as={Ionicons}
                                name="create-outline"
                                size={5}
                                color="black"
                                position="absolute"
                                bottom={0}
                                right={-15}
                            />
                        </TouchableOpacity>
                    </Box>
                    <TextUpdate text={group.group.groupName} title={useText('updateGroupName')}
                                onSuccess={handleEditGroupName}/>

                    <DangerZone/>
                </VStack>
            </ScrollView>
        </>
    )
}