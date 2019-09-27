import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';

import './config/ReactotonConfig';

import { store, persistor } from './store';
import App from './App';

// Ignore annoying warning from AnimatedComponent (react-native-reanimated)
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['AnimatedComponent']);

export default function Index() {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="transparent"
                    translucent
                />
                <App />
            </PersistGate>
        </Provider>
    );
}
