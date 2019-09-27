import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import Dashboard from './pages/Dashboard';
import Subscriptions from './pages/Subscriptions';
import Profile from './pages/Profile';

export default (isSigned = false) =>
    createAppContainer(
        createSwitchNavigator(
            {
                Sign: createSwitchNavigator({
                    SignIn,
                    SignUp,
                }),
                App: createBottomTabNavigator(
                    {
                        Dashboard,
                        Subscriptions,
                        Profile,
                    },
                    {
                        resetOnBlur: true,
                        tabBarOptions: {
                            keyboardHidesTabBar: true,
                            activeTintColor: '#FFF',
                            inactiveTintColor: 'rgba(255, 255, 255, 0.6)',
                            style: {
                                height: 64,
                                backgroundColor: '#2B1A2F',
                                borderTopWidth: 0,
                            },
                            tabStyle: {
                                marginTop: 13,
                                marginBottom: 12,
                            },
                            labelStyle: {
                                fontSize: 12,
                            },
                        },
                    }
                ),
            },
            {
                initialRouteName: isSigned ? 'App' : 'Sign',
            }
        )
    );
