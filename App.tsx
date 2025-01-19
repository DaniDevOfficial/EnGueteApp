import React from 'react';
import {NativeBaseProvider} from 'native-base';
import {Router} from './app/Router';

export default function App() {
    return (
        <NativeBaseProvider>
            <Router/>
        </NativeBaseProvider>
    );
}