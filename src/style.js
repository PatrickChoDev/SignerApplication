import { StyleSheet } from 'react-native';

var primary = '#eeeeee';
var accent = '#ffd369';
var subBackground = '#393e46';
var background = '#222831';

const Styles = StyleSheet.create({
    darkBG: {
        backgroundColor: background,
    },
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: background,
    },
    header: {
        padding: 8,
        color: primary,
        fontSize: 16,
    },
    subHeading: {
        color: accent,
    },
    containerButton: {
        flexDirection: 'row',
        marginTop: 48,
    },
    fonts: {
        color: primary,
        alignItems: 'center',
        textAlign: 'center',
    },
    button: {
        backgroundColor: subBackground,
        color: accent,
        borderColor: accent,
        borderRadius: 5,
        borderWidth: 1,
        padding: 8,
        marginHorizontal: 8,
        alignItems: 'center',
    },
    appbar: {
        backgroundColor: accent,
        color: primary,
    },
    modal: {
        backgroundColor: subBackground,
        color: primary,
        padding: 10,
    },
    RadioButton: {
        color: primary,
    },
    localeButton: {
        color: primary,
    },
    biggerFont: {
        fontSize: 24,
    },
    speechContainer: {
        flex: 2,
        backgroundColor: background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        textAlign: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraContainer: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recordBtn: {
        width: 200,
        padding: 8,
    },
    preview: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 288,
        height: 288,
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});
export default Styles;
