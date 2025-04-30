import React from 'react';
import {NativeBaseProvider} from 'native-base';
import {RouterWrapper} from './app/Router';

export default function App() {
    return (
        <NativeBaseProvider>
            <RouterWrapper/>
        </NativeBaseProvider>
    );
}