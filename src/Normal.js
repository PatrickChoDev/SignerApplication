import React, { Component } from 'react';
import {
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import {
    Appbar,
    Portal,
    Provider,
    Button,
    Dialog,
    RadioButton,
} from 'react-native-paper';
import Styles from './style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINT } from './Config';

class SignLocales extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.server);
        const { server } = this.props;
        this.state = {
            isloading: true,
            localesList: [],
        };
        this.getLocales(server);
    }
    async getLocales(server) {
        let res = await fetch(server + '/locales', {
            headers: {
                connection: 'keep-alive',
            },
        });
        let json = await res.json();
        console.log(json);
        this.setState({ localesList: json, isloading: false });
    }
    render() {
        const localesItem = this.state.localesList.map((locale) => {
            return (
                <RadioButton.Item
                    style={Styles.RadioButton}
                    labelStyle={Styles.RadioButton}
                    value={locale[1]}
                    label={locale[0]}
                />
            );
        });
        return (
            <>
                {this.state.isloading ? (
                    <ActivityIndicator animating={true} color='#ffd369' />
                ) : (
                    localesItem
                )}
            </>
        );
    }
}

export default class NormalMode extends Component {
    constructor() {
        super();

        this.state = {
            recording: false,
            processing: false,
            isSettingLocale: false,
            server: '',
            results: "Let's Talk",
            error: false,
            locale: 'de',
            localesList: [],
            loadingLocales: true,
            token: '',
        };
    }
    componentDidMount() {
        this.getServer();
    }
    async getServer() {
        await AsyncStorage.getItem('SignServer').then(async (serv) => {
            if (serv == null) {
                this.setState({ server: ENDPOINT });
                await fetch(ENDPOINT)
                    .then(async (response) => {
                        var stat = await response.text();
                        if (stat == "Signer's API Server")
                            this.setState({ server: ENDPOINT });
                        else throw 'Wrong Server IP';
                    })
                    .catch((error) => {
                        console.error(error);

                        this.setState({ error: true });
                    });
            } else {
                this.setState({ server: serv });
                await fetch(serv)
                    .then(async (response) => {
                        var stat = await response.json();
                        if (stat['results'] == "Signer's API Server")
                            this.setState({ server: serv });
                        else throw 'Wrong Server IP';
                    })
                    .catch((error) => {
                        console.error(error);
                        this.setState({ error: true });
                    });
            }
        });
    }
    async startRecording() {
        this.setState({ recording: true });
        console.log('Start recording');
        const { uri, codec = 'mp4' } = await this.camera.recordAsync({
            quality: '720p',
            orientation: 'portrait',
            videoBitrate: 0.25 * 1000 * 1000,
        });
        this.setState({ recording: false, processing: true });
        await fetch(this.state.server + '/getToken')
            .then(async (response) => {
                const token = await response.text();
                console.log(token);
                this.setState({ token: token });
            })
            .catch((error) => {
                console.error(error);
                this.setState({ error: true });
            });
        const type = `video/${codec}`;
        const data = new FormData();
        data.append('video', { name: 'video.thesecret', uri, type });
        let response = await fetch(
            this.state.server +
                '/' +
                this.state.token +
                '/' +
                this.state.locale,
            {
                method: 'POST',
                body: data,
            },
        ).catch((error) => {
            console.error(error);
            this.setState({ error: true });
        });
        console.log(response);
        let json = await response.json();
        console.log(json.results);
        this.setState({ results: json.results, processing: false });
    }

    stopRecording() {
        this.camera.stopRecording();
    }

    render() {
        const { recording, processing, isSettingLocale } = this.state;
        const { navigation } = this.props;
        let button = (
            <TouchableOpacity onPress={this.startRecording.bind(this)}>
                <Button
                    icon='camera'
                    color='#ffd369'
                    mode='contained'
                    style={Styles.recordBtn}>
                    Record
                </Button>
            </TouchableOpacity>
        );

        if (recording) {
            button = (
                <TouchableOpacity onPress={this.stopRecording.bind(this)}>
                    <Button
                        icon='stop'
                        color='#eeeeee'
                        mode='contained'
                        style={Styles.recordBtn}>
                        Stop
                    </Button>
                </TouchableOpacity>
            );
        }

        if (processing) {
            button = (
                <View>
                    <ActivityIndicator
                        animating={true}
                        color='#ffd369'
                        size={30}
                    />
                </View>
            );
        }

        return (
            <Provider>
                <Portal>
                    <Dialog
                        style={[Styles.modal, { padding: 5 }]}
                        visible={this.state.error}
                        onDismiss={() => navigation.goBack()}>
                        <Dialog.Title
                            style={[
                                Styles.fonts,
                                {
                                    textAlign: 'left',
                                    alignContent: 'flex-start',
                                },
                            ]}>
                            Can't connect to server
                        </Dialog.Title>
                        <Dialog.Content>
                            <Text
                                style={[
                                    Styles.fonts,
                                    {
                                        textAlign: 'left',
                                        alignContent: 'flex-start',
                                    },
                                ]}>
                                Please try again later or change server
                            </Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                color='#ffd369'
                                onPress={() => navigation.goBack()}>
                                Back
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <Appbar.Header style={Styles.appbar}>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content
                        title='Normal Mode'
                        subtitle='Sign To Text Translator'
                    />
                    <Appbar.Action
                        icon='translate'
                        onPress={() => this.setState({ isSettingLocale: true })}
                    />
                </Appbar.Header>
                <Portal>
                    <Dialog
                        style={Styles.modal}
                        visible={isSettingLocale}
                        onDismiss={() =>
                            this.setState({ isSettingLocale: false })
                        }>
                        <ScrollView>
                            <RadioButton.Group
                                onValueChange={(newValue) => {
                                    this.setState({
                                        locale: newValue,
                                        isSettingLocale: false,
                                    });
                                }}
                                value={this.state.locale}>
                                <SignLocales server={this.state.server} />
                            </RadioButton.Group>
                        </ScrollView>
                        <Button
                            style={Styles.localeButton}
                            color='#eeeeee'
                            onPress={() => {
                                this.setState({ isSettingLocale: false });
                            }}>
                            Cancel
                        </Button>
                    </Dialog>
                </Portal>
                <View style={Styles.container}>
                    <View style={Styles.cameraContainer}>
                        <RNCamera
                            ref={(ref) => {
                                this.camera = ref;
                            }}
                            style={Styles.preview}
                            type={RNCamera.Constants.Type.back}
                            flashMode={RNCamera.Constants.FlashMode.off}
                            ratio='4:3'
                            defaultVideoQuality='720p'
                            videoStabilizationMode='standard'
                            androidCameraPermissionOptions={{
                                title: 'Permission to use camera',
                                message:
                                    'We need your permission to use your camera',
                                buttonPositive: 'Apcept',
                                buttonNegative: 'Deny',
                            }}
                            androidRecordAudioPermissionOptions={{
                                title: 'Permission to use audio recording',
                                message:
                                    'We need your permission to use your audio',
                                buttonPositive: 'Apcept',
                                buttonNegative: 'Deny',
                            }}
                            captureAudio={false}
                        />
                    </View>
                    <View style={Styles.textContainer}>
                        <Text style={[Styles.subHeading, Styles.biggerFont]}>
                            {this.state.results}
                        </Text>
                    </View>
                    {button}
                </View>
            </Provider>
        );
    }
}
