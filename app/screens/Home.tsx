import { Box, Button, Text } from 'native-base'
import React from 'react'

export function Home({navigation }: any) {

    return (
        <Box flex={1} justifyContent="center" alignItems="center" p={4} >
            <Text fontSize="2xl" mb={4}>Welcome to EnGuete!</Text>
            <Button onPress={() => navigation.navigate('login')} my={2}>
                <Text>Login</Text>
            </Button>
            <Button onPress={() => navigation.navigate('signup')} my={2}>
                <Text>Sing up</Text>
            </Button>
        </Box>
    )
}