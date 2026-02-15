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
import {CreateGroup} from "../group/CreateGroup";
import {JoinGroup} from "../group/JoinGroup";

export function GroupList({groupsDefault}: { groupsDefault: Group[] }) {
    const navigation = useNavigation();
    const text = useTexts(['youAreInNoGroup', 'startByJoiningOrCreating', 'groups', 'createNewGroup', 'searchForGroup', 'error', 'noGroupsFound']);
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
        const lowerCaseQuery = query.toLowerCase();
        const groupsFiltered = groups.filter((group) => {
            return group.groupName.toLowerCase().includes(lowerCaseQuery) ||
                group.groupId.toLowerCase().includes(lowerCaseQuery);
        });

        setFilteredGroups(groupsFiltered);
    }

    function handleNewGroupNavigate() {
        navigation.navigate('newGroup');
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
        <Box flex={1}>
            <VStack
                space={6}
                w={'100%'}
                flex={1}
                pb={60}
            >
                <InputGroup w={'100%'} justifyContent={'center'} alignItems={'center'}>
                    <Input
                        width={'100%'}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            handleSearch(text);
                        }}
                        fontSize={'md'}
                        py={2}
                        px={2}
                        borderRadius={'100'}
                        placeholder={text.searchForGroup
                        }
                        value={searchQuery}
                        InputLeftElement={
                            <Icon
                                as={<Ionicons name="search"/>}
                                size={5}
                                ml="4"
                                color="gray.400"
                            />
                        }
                    />
                </InputGroup>
                <VStack
                    space={2}
                >

                    <Flex
                        flexDir={'row'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                    >
                        <Text
                            fontSize={'lg'}
                            fontWeight={'bold'}
                        >
                            {text.groups}
                        </Text>
                        <HStack
                            space={2}
                            alignItems={'center'}
                        >
                            <JoinGroup />


                            <CreateGroup/>
                        </HStack>
                    </Flex>

                    <ScrollView
                        contentContainerStyle={{flexGrow: 1}}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                        }
                        flex={1}
                        w={'100%'}
                        overflowY={'hidden'}
                    >
                        {filteredGroups && filteredGroups.length > 0 ? (filteredGroups.map((group, index) => (
                                <GroupCard color={index % 2 === 0 ? 'orange' : 'yellow'} group={group}
                                           key={group.groupId}/>
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

                    </ScrollView>
                </VStack>


            </VStack>
        </Box>
    )
}