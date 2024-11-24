import React from 'react';
import { useRoute } from '@react-navigation/native';
import { Text, Box } from 'native-base';

export function Group() {
    const route = useRoute();
    const { groupId } = route.params;

    return (
        <Box>
            <Text>Details for Group ID: {groupId}</Text>
        </Box>
    );
}
