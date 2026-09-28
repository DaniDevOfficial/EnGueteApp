import "./global.css";
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {RouterWrapper} from './app/Router';
import {createTable} from "./app/utility/database";
import {ToastProvider} from "./app/components/Ui/Toast";

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
        <GestureHandlerRootView style={{flex: 1}}>
            <SafeAreaProvider>
                <ToastProvider>
                    <RouterWrapper/>
                </ToastProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
