/* region Navigation */
import Menu from '../components/Menu';
/* endregion */

/* region React */
import {
    StyleSheet,
    Text,
    View,
    Button,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Image,
    Modal,
    Pressable,
    TextInput
} from 'react-native';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useStoreState, useStoreActions} from 'easy-peasy';

/* endregion */

/* region FireStore */
import {initializeApp} from "firebase/app";
import {getFirestore, collection, getDocs, query} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDDvcz0oGtL8gFQq0OSidN_BjQINIOj3vg",
    authDomain: "csodapp-471f4.firebaseapp.com",
    projectId: "csodapp-471f4",
    storageBucket: "csodapp-471f4.appspot.com",
    messagingSenderId: "41075695763",
    appId: "1:41075695763:web:a7973be2a4d290eca06d66",
    measurementId: "G-8B1367S9RM"
};
/* endregion */

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

/* region Progress */
import AsyncStorage from '@react-native-async-storage/async-storage';
/* endregion */

export default function CsodAppSettingsScreen() {
    const navigation = useNavigation();

    const [isModalOpened, setIsModalOpened] = useState(false);

    /* region Exercises */
    const [exercises, setExercises] = useState([]);

    const fetchExercises = async () => {
        try {
            const app = initializeApp(firebaseConfig);
            const db = getFirestore(app);
            const table = collection(db, "420");
            const titleCollection = await getDocs(table);
            const exercisesFromFirebase = titleCollection.docs.map((doc) => doc.data());
            exercisesFromFirebase.map((title, idx) => (title.index = idx));
            setExercises(exercisesFromFirebase);
            setExercisesToAsyncStorage(exercisesFromFirebase);
        } catch (error) {
            console.log(error);
        }
    };
    /* endregion */

    /* region Progress */
    const [progress, setProgress] = useState(0);
    const [viewed, setViewed] = useState(0);

    /* region Async Storage */
    const setExercisesToAsyncStorage = async (exercisesToAsyncStorage) => {
        try {
            await AsyncStorage.setItem('exercises', JSON.stringify(exercisesToAsyncStorage));
        } catch (error) {
            console.log(error);
        }
    }


    const getExercisesFromAsyncStorage = async () => {
        try {
            const exercisesFromAsyncStorage = await AsyncStorage.getItem('exercises');
            if (exercisesFromAsyncStorage !== null) {
                setExercises(JSON.parse(exercisesFromAsyncStorage));
            } else {
                fetchExercises();
            }
        } catch (error) {
            console.log(error);
        }
    }


    const setProgressToAsyncStorage = async (progress, isSetViewed = true) => {
        try {
            setProgress(progress);
            setIsModalOpened(false);
            if (isSetViewed) {
                setViewed(progress);
            }
            await AsyncStorage.setItem(
                'progress',
                `${progress}`
            );
        } catch (error) {
            console.log(error);
        }
    };

    const getProgressFromAsyncStorage = async () => {
        try {
            const progress = await AsyncStorage.getItem('progress');
            if (progress !== null) {
                setProgress(parseInt(progress));
                setViewed(parseInt(progress));
            }
        } catch (error) {
            console.log(error);
        }
    };
    /* endregion */

    /* region Viewed */
    const viewPrevious = () => {
        if (viewed > 0) {
            setViewed(viewed - 1);
        }
    }

    const viewNext = () => {
        setViewed(viewed + 1);
    }
    /* endregion */

    /* region Change number */
    const [continueFrom, setContinueFrom] = useState(0);
    const [pushNotification, setPushNotification] = useState(0);
    /* endregion */

    useEffect(() => {
        getExercisesFromAsyncStorage();
        getProgressFromAsyncStorage();
    }, []);

    const setUserProgress = useStoreActions((actions) => actions.setUserProgress);

    return (
        <View style={styles.container}>
            {/* region Modal */}
            <Modal
                animationType="none"
                transparent={false}
                visible={isModalOpened}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.modalBox}>
                            <Text style={styles.modalText}>Biztosan a {continueFrom + 1}. gyakorlattól folytatod?</Text>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity onPress={() => {
                                    setIsModalOpened(false);
                                }} style={styles.modalNoButton}>
                                    <Text style={styles.textNoButton}>Nem</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalYesButton} onPress={() => {
                                    setProgressToAsyncStorage(continueFrom);
                                    setUserProgress(continueFrom);
                                }}>
                                    <Text style={styles.text}>Igen</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* endregion */}

            <Text style={styles.screenTitle}>Beállítások</Text>
            {/* region Progress */}
            <ScrollView contentContainerStyle={{
                marginLeft: 0,
                width: screenWidth,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 60,
                paddingLeft: 20,
                paddingRight: 20
            }}>
                <View style={[styles.titleContainer]}>
                    <Text style={styles.titleItemText}>
                        Aktuális gyakorlat
                    </Text>
                    <TouchableOpacity style={styles.titleItemText}>
                        <TextInput
                            style={{
                                height: 38,
                                width: 66,
                                backgroundColor: 'white',
                                borderRadius: 4,
                                borderWidth: 1,
                                borderColor: '#cccccc',
                                borderStyle: 'solid',
                                textAlign: 'center'
                            }}
                            onEndEditing={text => {
                                setContinueFrom(parseInt(text.nativeEvent.text - 1));
                                setIsModalOpened(true);
                            }}
                            keyboardType="numeric"
                            placeholder={(progress + 1) + ''}
                            // editable={false}
                        />
                    </TouchableOpacity>
                </View>
                <View style={[styles.titleContainer]}>
                    <Text style={styles.titleItemText}>
                        Értesítések
                    </Text>
                    <TouchableOpacity style={styles.titleItemText} onPress={async () => {
                        // togglePushNotification();
                    }}>
                        {pushNotification ?
                            <Image style={{height: 38, width: 66}}
                                   source={require('../assets/old/radio-checked.png')}></Image> :
                            <Image style={{height: 38, width: 66}} source={require('../assets/old/radio.png')}></Image>}
                    </TouchableOpacity>
                </View>

            </ScrollView>
            {/* endregion */}

            <Menu/>
        </View>
    );
}

const styles = StyleSheet.create({
    screenTitle: {
        textTransform: 'uppercase',
        fontSize: 26,
        fontStyle: 'normal',
        paddingTop: 30,
        paddingBottom: 15,
        paddingLeft: 30,
    },
    modalText: {
        fontWeight: '700',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
        color: 'black'
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 15,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)',
        alignSelf: "stretch",
        minWidth: 300,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    borderlessTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 15,
        marginBottom: 10,
        borderBottomWidth: 0,
        borderColor: 'rgba(0, 0, 0, 0.15)',
        alignSelf: "stretch",
        minWidth: 300,
        width: 300,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleItemId: {
        paddingRight: 12,
        color: '#9E99ED'
    },
    titleItemText: {
        color: 'black',
        fontWeight: '400'

    },
    menu: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: "space-around",
        paddingTop: 12,
        height: 64,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 12,
        backgroundColor: 'white',
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0
    },
    pageContent: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 80,
        flex: 1,
        width: '100%',
        alignSelf: "stretch"
    },
    menuItem: {
        height: 40,
        width: 37
    },
    container: {
        flex: 1,
        paddingTop: 30,
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: '#F9F9F9',
        height: '100%',
        alignSelf: "stretch"
    },
    scrollContainer: {
        flex: 1,
        paddingTop: 30,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        alignSelf: "stretch"
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#9E99ED',
    },
    modalButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center'
    },
    modalYesButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#9E99ED',
        marginLeft: 7,
        borderColor: '#9E99ED',
        borderWidth: 1,
        borderStyle: 'solid',
    },
// text: {
//     fontSize: 16,
//     lineHeight: 21,
//     fontWeight: 'bold',
//     letterSpacing: 0.25,
//     color: 'white',
// },
    textNoButton: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#9E99ED',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 40,
        alignItems: 'center',
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalBox: {
        bottom: 0,
        padding: 30,
        paddingBottom: 30,
        width: '100%',
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 12,
        borderRadius: 12,
        position: "absolute"
    },
    modalNoButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
        elevation: 3,
        borderColor: '#9E99ED',
        borderWidth: 1,
        borderStyle: 'solid',
        backgroundColor: 'white',
        marginRight: 7
    }
});
