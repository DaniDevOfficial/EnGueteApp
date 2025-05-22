import React, {useEffect} from 'react';
import {NativeBaseProvider} from 'native-base';
import {RouterWrapper} from './app/Router';
import {createTable} from "./app/utility/database";

export default function App() {
    useEffect(() => {
        createTable()
    }, []);
    return (
        <NativeBaseProvider>
            <RouterWrapper/>
        </NativeBaseProvider>
    );
}