import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, useState } from 'react';
import { Text, View } from 'react-native';
import {
    Appbar,
    Button,
    Portal,
    Provider,
    Title,
    Dialog,
    TextInput,
    Paragraph,
} from 'react-native-paper';
import Styles from './style';
import { ENDPOINT } from './Config';

export default class AboutPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            text: '',
        };
        this.getServer();
    }
    async getServer() {
        await AsyncStorage.getItem('SignServer').then((value) => {
            this.setState({ text: value });
        });
        console.log(this.state.text);
    }

    async saveServer() {
        this.setState({ visible: false });
        if (this.state.text == '' || this.state.text== null) {
            await AsyncStorage.setItem('SignServer', ENDPOINT);
        } else await AsyncStorage.setItem('SignServer', this.state.text);
        console.log('Saved as ' + this.state.text);
    }

    render() {
        const { visible } = this.state;
        const { navigation } = this.props;

        return (
            <Provider>
                <Appbar.Header style={Styles.appbar}>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title='About' />
                </Appbar.Header>
                <View style={[Styles.darkBG, { flex: 1, padding: 20 }]}>
                    <Title style={Styles.subHeading}>About Signer</Title>
                    <Text
                        style={[
                            Styles.fonts,
                            { textAlign: 'left', fontSize: 18 },
                        ]}>
                        License Agreement
                    </Text>
                    <Text style={[Styles.fonts, { textAlign: 'left' }]}>
                        {
                            '\t\t\tThis software is a work developed by Thanapat Chotipun from Bodindecha (Sing Singhaseni) school  under the provision of Cholnicha K. under Signer : Real-time Sign Language Translator , which has been supported by the National Science and Technology Development Agency (NSTDA), in order to encourage pupils and students to learn and practice their skills in developing software. Therefore, the intellectual property of this software shall belong to the developer and the developer gives NSTDA a permission to distribute this software as an “as is ” and non-modified software for a temporary and non-exclusive use without remuneration to anyone for his or her own purpose or academic purpose, which are not commercial purposes. In this connection, NSTDA shall not be responsible to the user for taking care, maintaining, training or developing the efficiency of this software. Moreover, NSTDA shall not be liable for any error, software efficiency and damages in connection with or arising out of the use of the software.'
                        }
                    </Text>
                    <Button
                        color='#ffd369'
                        icon='server'
                        onPress={() => {
                            this.setState({ visible: true });
                        }}>
                        Change Server
                    </Button>
                </View>
                <Portal>
                    <Dialog
                        visible={visible}
                        onDismiss={this.saveServer.bind(this)}>
                        <Dialog.Title>Change Server Address</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                label='Server Address'
                                value={this.state.text}
                                onChangeText={(text) => this.setState({ text: text })}
                                mode='flat'
                                autoCorrect={false}
                                autoCompleteType='off'
                            />
                            <Paragraph
                                style={{
                                    fontSize: 12,
                                    color: 'grey',
                                    fontWeight: '100',
                                }}>
                                Leave blank to use default server
                            </Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={this.saveServer.bind(this)}>
                                Done
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </Provider>
        );
    }
}
