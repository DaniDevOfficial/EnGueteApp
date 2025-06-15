import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Input,
    InputGroup,
    Pressable,
    ScrollView,
    Text,
    useToast,
    VStack
} from "native-base";
import {RefreshControl} from "react-native-gesture-handler";
import {GroupCard} from "./GroupCard";
import React, {useCallback, useEffect, useState} from "react";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {GetUserGroups, Group} from "../../repo/User";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {UnauthorizedError, useErrorText} from "../../utility/Errors";
import {showToast} from "../UI/Toast";
import {handleLogoutProcedure} from "../../Util";
import Ionicons from "react-native-vector-icons/Ionicons";

export function GroupList({groupsDefault}: { groupsDefault: Group[] }) {
    const navigation = useNavigation();
    const text = useTexts(['youAreInNoGroup', 'startByJoiningOrCreating', 'yourGroups', 'createNewGroup', 'searchForGroup', 'error', 'noGroupsFound']);
    const toast = useToast();
    const getError = useErrorText();

    const [refreshing, setRefreshing] = useState(false);
    const [groups, setGroups] = useState(groupsDefault);
    const [filteredGroups, setFilteredGroups] = useState(groups);
    const [searchQuery, setSearchQuery] = useState('');
    const [shouldReload, setShouldReload] = useState(false);


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
        console.log(query)
        const lowerCaseQuery = query.toLowerCase();
        const groupsFiltered = groupsDefault.filter((group) => {
            return group.groupName.toLowerCase().includes(lowerCaseQuery) ||
                group.groupId.toLowerCase().includes(lowerCaseQuery);
        });

        setFilteredGroups(groupsFiltered);
    }

    useEffect(() => {
        if (!shouldReload) {
            return;
        }
        setTimeout(() => {
            onRefresh()
            setShouldReload(false);
        }, 100) // this is because the animation is not finished yet and a statechange will cause a re-render. it's a bit hacky but it works
        //TODO: find a better way to do this

    }, [shouldReload]);

    useFocusEffect(
        useCallback(() => {
            setShouldReload(true);
        }, [])
    );

    useEffect(() => {
        handleSearch(searchQuery);
    }, [groups]);
    return (
        <VStack
            space={4}
            w={'100%'}
        >
            <InputGroup w={'100%'} justifyContent={'center'} alignItems={'center'}>
                <Input
                    width={'100%'}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        handleSearch(text);
                    }}
                    placeholder={text.searchForGroup}
                    value={searchQuery}
                    InputLeftElement={
                        <Icon
                            as={<Ionicons name="search"/>}
                            size={5}
                            ml="2"
                            color="gray.400"
                        />
                    }
                />
            </InputGroup>
            <Flex
                flexDir={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
            >
                <Text
                    fontSize={'lg'}
                    fontWeight={'bold'}
                >
                    {text.yourGroups}
                </Text>
                <Button
                    borderRadius={30}
                >
                    <HStack flexDir={'row'} space={2} justifyContent={'space-between'} alignItems={'center'}>

                        <Icon
                            as={<Ionicons name="add"/>}
                            size={5}
                            color="white"
                        />
                        <Text
                            color={'white'}
                        >
                            {text.createNewGroup}
                        </Text>
                    </HStack>
                </Button>
            </Flex>

            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
                w={'100%'}
            >

                <VStack alignItems="center">
                    {filteredGroups && filteredGroups.length > 0 ? (filteredGroups.map((group) => (
                            <GroupCard group={group} key={group.groupId}/>
                        ))
                    ) : (
                        <Box mt={5}>
                            {groups.length > 0 ? (
                                <Text color={"gray.500"} textAlign={"center"}>
                                    {text.noGroupsFound}
                                </Text>
                            ) : (

                                <>
                                    <Text color={"gray.500"} textAlign={"center"}>
                                        {text.youAreInNoGroup}
                                    </Text>
                                    <Text color={"gray.500"} textAlign={"center"}>
                                        {text.startByJoiningOrCreating}
                                    </Text>
                                </>
                            )}
                        </Box>
                    )}
                </VStack>

            </ScrollView>


        </VStack>

    )
}