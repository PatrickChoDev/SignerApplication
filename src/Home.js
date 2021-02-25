import 'react-native-gesture-handler';
import React from 'react';
import { Text, View } from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { Button, IconButton, Provider } from 'react-native-paper';
import Styles from './style';

export default function HomePage({navigation}) {
    return (
        <Provider>
            <View style={[Styles.root,Styles.darkBG]}>
                <Text style={Styles.header}>
                    Signer : Real-time Sign language translator
                </Text>
                <Text style={Styles.subHeading}>
                    Please select mode to use translator
                </Text>
                <View style={Styles.containerButton}>
                    <TouchableOpacity style={Styles.button} onPress={() => {navigation.navigate('DeafMode')}}>
                    <IconButton
                        icon='ear-hearing-off'
                        color='#eeeeee'
                        size={72}
                    />
                    <Text style={Styles.fonts}>I'm Deafen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.button} onPress={() => {navigation.navigate('NormalMode')}}>
                    <IconButton
                        icon='account'
                        color='#eeeeee'
                        size={72}
                    />
                    <Text style={Styles.fonts}>I'm Normal</Text>
                    </TouchableOpacity>
                </View>
            </View>
                <Button icon='information' mode='contained' color='#ffd369' onPress={()=>navigation.navigate('AboutPage')}>About</Button>

        </Provider>
    );
}
