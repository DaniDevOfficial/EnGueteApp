import {Box, Input, InputGroup, Pressable, ScrollView, Text, useToast, VStack} from "native-base";
import {RefreshControl} from "react-native-gesture-handler";
import {GroupCard} from "./GroupCard";
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {GetUserGroups, Group} from "../../repo/User";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {UnauthorizedError, useErrorText} from "../../utility/Errors";
import {showToast} from "../UI/Toast";
import {handleLogoutProcedure} from "../../Util";

export function GroupList({groupsDefault}: { groupsDefault: Group[] }) {
    const navigation = useNavigation();
    const text = useTexts(['youAreInNoGroup', 'startByJoiningOrCreating', 'yourGroups', 'createNewGroup', 'searchForGroup', 'error']);
    const toast = useToast();
    const getError = useErrorText();

    const [refreshing, setRefreshing] = useState(false);
    const [groups, setGroups] = useState(groupsDefault);
    const [filteredGroups, setFilteredGroups] = useState(groups);
    const [searchQuery, setSearchQuery] = useState('');

    async function onRefresh() {
        setRefreshing(true);
        try {
            const groupsResponse = await GetUserGroups()
            setGroups(groupsResponse)
        } catch (e) {

            showToast({
                toast,
                title: text.error,
                description: getError(e.message),
                status: "warning",
            })
            if (e instanceof UnauthorizedError) {
                await handleLogoutProcedure(navigation)
                return;
            }
        }
        setRefreshing(false);
    }

    function handleSearch(query: string) {

        setFilteredGroups(groups);
    }
    useEffect(() => {
        handleSearch(searchQuery);
    }, [groups]);
    return (
        <>
            <Box
                height="1px"
                width="90%"
                backgroundColor="coolGray.300"
                marginY="3px"
            />

            <Text fontWeight={"bold"} fontSize={"2xl"}>{text.yourGroups}</Text>
            {filteredGroups.length > 0 && (
                <InputGroup w={'100%'} justifyContent={'center'} alignItems={'center'}>
                    <Input
                        width={'70%'}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            handleSearch(text);
                        }}
                        placeholder={text.searchForGroup}
                        value={searchQuery}
                    />
                </InputGroup>
            )}
            <ScrollView
                w={'100%'}
                contentContainerStyle={{flexGrow: 1}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            >
                <VStack alignItems="center" w={'100%'}>
                    {filteredGroups && filteredGroups.length > 0 ? (filteredGroups.map((group) => (
                            <GroupCard group={group} key={group.groupId}/>
                        ))
                    ) : (
                        <Box mt={5}>
                            <Text color={"gray.500"} textAlign={"center"}>
                                {text.youAreInNoGroup}
                            </Text>

                            <Text color={"gray.500"} textAlign={"center"}>
                                {text.startByJoiningOrCreating}
                            </Text>
                        </Box>
                    )}
                </VStack>

            </ScrollView>
            <Pressable
                onPress={() => {
                    navigation.navigate('test')
                }}
            >
                <Text>Test</Text>
            </Pressable>
        </>

    )
}