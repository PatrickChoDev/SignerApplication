import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import {
    Appbar,
    Button,
    Dialog,
    IconButton,
    Portal,
    Provider,
    RadioButton,
} from 'react-native-paper';
import Styles from './style';
import Voice from '@react-native-community/voice';

const locales = [
    ['Egypt', 'ar-EG'],
    ['Deutschland', 'de-DE'],
    ['English', 'en-US'],
    ['Chile', 'es-CL'],
    ['France', 'fr-FR'],
    ['भारत', 'hi-IN'],
    ['Italia', 'it-IT'],
    ['ไทย', 'th-TH'],
    ['Japan', 'ja-JP'],
    ['Korea', 'ko-KR'],
    ['Brazil', 'pt-BR'],
    ['Russia', 'ru-RU'],
    ['Chinese', Platform.OS === 'android' ? 'cmn-Hans-CN' : 'zh_Hans_SG'],
];
const localesList = locales.map((l) => (
    <RadioButton.Item
        label={l[0]}
        labelStyle={Styles.fonts}
        value={l[1]}
        style={Styles.fonts}
    />
));

class SpeechLocale extends React.Component {
    render() {
        return <>{localesList}</>;
    }
}

export default function DeafMode({ navigation }) {
    const [isListening, setListensing] = useState(false);
    const [isSettingLocales, setisSettingLocales] = useState(false);
    const [locale, setLocale] = useState('en-US');
    const [result, setResult] = useState(["Let's talk"]);
    const [partialResult, setPartialResult] = useState(["Let's Talk"]);
    const [end, setEnded] = useState(false);

    useEffect(() => {
        function onSpeechStart(e) {
            console.log('onSpeechStart: ', e);
            setListensing(true);
            setEnded(false);
        }
        function onSpeechResults(e) {
            setListensing(false);
            console.log('onSpeechResults: ', e);
            setResult(e.value);
        }
        function onSpeechPartialResults(e) {
            console.log('onSpeechPartialResults: ', e);
            setPartialResult(e.value);
        }

        function onSpeechEnd(e) {
            setListensing(false);
            setEnded(true);
        }

        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
        Voice.onSpeechEnd = onSpeechEnd;
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const _startRecognize = async () => {
        setResult([]);
        await Voice.start(locale);
    };

    const _stopRecognize = async () => {
        await Voice.stop();
    };

    return (
        <Provider>
            <Appbar.Header style={Styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content
                    title='Deaf Mode'
                    subtitle='Speech To Text Translator'></Appbar.Content>
                <Appbar.Action
                    icon='translate'
                    onPress={() => setisSettingLocales(true)}
                />
            </Appbar.Header>
            <Portal>
                <Dialog
                    style={Styles.modal}
                    visible={isSettingLocales}
                    onDismiss={() => {
                        setisSettingLocales(false);
                    }}>
                    <ScrollView>
                        <RadioButton.Group
                            onValueChange={(newValue) => {
                                setLocale(newValue);
                                setisSettingLocales(false);
                            }}
                            value={locale}>
                            <SpeechLocale />
                        </RadioButton.Group>
                    </ScrollView>
                    <Button
                        style={Styles.localeButton}
                        color='#eeeeee'
                        onPress={() => {
                            setisSettingLocales(false);
                        }}>
                        Cancel
                    </Button>
                </Dialog>
            </Portal>
            <View style={Styles.speechContainer}>
                <View style={[Styles.root]}>
                    <Text style={[Styles.subHeading, Styles.biggerFont]}>
                        {!end ? partialResult[0] : result[0]}
                    </Text>
                </View>
            </View>
            <View style={Styles.container}>
                <IconButton
                    icon={isListening ? 'stop' : 'microphone'}
                    color='#eeeeee'
                    size={60}
                    onPress={() => {
                        setListensing(!isListening);
                        isListening ? _stopRecognize() : _startRecognize();
                    }}></IconButton>
                <Text style={Styles.fonts}>
                    {'Locales : '}
                    {locale}
                </Text>
            </View>
        </Provider>
    );
}
