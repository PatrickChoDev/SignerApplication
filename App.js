import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/Home';
import DeafMode from './src/Deaf';
import VideoOverview from './src/Normal';
import AboutPage from './src/About';

const Stack = createStackNavigator();
const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator headerMode='none'>
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='DeafMode' component={DeafMode} />
                <Stack.Screen name='NormalMode' component={VideoOverview} />
                <Stack.Screen name='AboutPage' component={AboutPage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
