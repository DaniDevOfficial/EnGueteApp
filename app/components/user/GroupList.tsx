import React, {useCallback, useEffect, useState} from "react";
import {ScrollView, Text, TextInput, View} from "react-native";
import {RefreshControl} from "react-native-gesture-handler";
import {GroupCard} from "./GroupCard";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {GetUserGroups, Group} from "../../repo/User";
import {useTexts} from "../../utility/TextKeys/TextKeys";
import {UnauthorizedError, useErrorText} from "../../utility/Errors";
import {showToast} from "../Ui/Toast";
import {handleLogoutProcedure} from "../../Util";
import Ionicons from "react-native-vector-icons/Ionicons";
import {CreateGroup} from "../group/CreateGroup";
import {JoinGroup} from "../group/JoinGroup";

export function GroupList({groupsDefault}: { groupsDefault: Group[] }) {
    const navigation = useNavigation();
    const text = useTexts(['youAreInNoGroup', 'startByJoiningOrCreating', 'groups', 'createNewGroup', 'searchForGroup', 'error', 'noGroupsFound']);
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
        <View className="flex-1 w-full">
            <View className="w-full flex-1 gap-6 pb-[60px]">
                <View className="w-full flex-row items-center rounded-full border border-gray-300 bg-white px-2 py-2">
                    <Ionicons name="search" size={20} color="#9ca3af" style={{marginLeft: 8}}/>
                    <TextInput
                        className="flex-1 px-2 text-base text-black"
                        onChangeText={(textValue) => {
                            setSearchQuery(textValue);
                            handleSearch(textValue);
                        }}
                        placeholder={text.searchForGroup}
                        value={searchQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <View className="flex-1 gap-2">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-lg font-bold text-black">
                            {text.groups}
                        </Text>
                        <View className="flex-row items-center gap-2">
                            <JoinGroup/>
                            <CreateGroup/>
                        </View>
                    </View>

                    <ScrollView
                        className="w-full flex-1"
                        contentContainerStyle={{flexGrow: 1}}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                        }
                    >
                        {filteredGroups && filteredGroups.length > 0 ? (
                            filteredGroups.map((group, index) => (
                                <GroupCard
                                    color={index % 2 === 0 ? 'orange' : 'yellow'}
                                    group={group}
                                    key={group.groupId}
                                />
                            ))
                        ) : (
                            <View className="mt-5">
                                {groups.length > 0 ? (
                                    <Text className="text-center text-gray-500">
                                        {text.noGroupsFound}
                                    </Text>
                                ) : (
                                    <>
                                        <Text className="text-center text-gray-500">
                                            {text.youAreInNoGroup}
                                        </Text>
                                        <Text className="text-center text-gray-500">
                                            {text.startByJoiningOrCreating}
                                        </Text>
                                    </>
                                )}
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </View>
    )
}
