import React, {useEffect} from 'react';
import {NativeBaseProvider} from 'native-base';
import {RouterWrapper} from './app/Router';
import {createTable} from "./app/utility/database";

export default function App() {
    async function createTableWrapper() {
        try {
            await createTable();
        } catch (e) {
            console.error("Error creating table:", e);
        }
    }
    useEffect(() => {

        createTableWrapper()
    }, []);
    return (
        <NativeBaseProvider>
            <RouterWrapper/>
        </NativeBaseProvider>
    );
}