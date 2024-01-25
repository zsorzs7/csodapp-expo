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
    Pressable
} from 'react-native';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useStoreState, useStoreActions} from 'easy-peasy';
import {Timer} from '../components/Timer';

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

export default function CsodAppProgressScreen() {
    const navigation = useNavigation();

    const setExercisesToStore = useStoreActions((actions) => actions.setExercises);

    const exercisesFromStore = useStoreState((state) => state.exercises);

    /* region Exercises */
    const userProgress =  useStoreState(state => state.userProgress);
    /* endregion */


    const [isModalOpened, setIsModalOpened] = useState(false);

    /* region Exercises */
    const [exercises, setExercises] = useState([]);

    fetchExercises = async () => {
        try {
            const app = initializeApp(firebaseConfig);
            const db = getFirestore(app);
            const table = collection(db, "420");
            const titleCollection = await getDocs(table);
            const exercisesFromFirebase = titleCollection.docs.map((doc) => doc.data());
            setExercises(exercisesFromFirebase);
            setExercisesToAsyncStorage(exercisesFromFirebase);
            setExercisesToStore(JSON.parse(exercisesFromFirebase));
        } catch (error) {
            console.log(error);
        }
    };
    /* endregion */

    /* region Progress */
    const [progress, setProgress] = useState(0);
    const [viewed, setViewed] = useState(0);

    /* region Async Storage */
    setExercisesToAsyncStorage = async (exercisesToAsyncStorage) => {
        try {
            await AsyncStorage.setItem('exercises', JSON.stringify(exercisesToAsyncStorage));
        } catch (error) {
            console.log(error);
        }
    }


    getExercisesFromAsyncStorage = async () => {
        try {
            const exercisesFromAsyncStorage = await AsyncStorage.getItem('exercises');
            if (exercisesFromAsyncStorage !== null) {
                setExercises(JSON.parse(exercisesFromAsyncStorage));
                setExercisesToStore(JSON.parse(exercisesFromAsyncStorage));
            } else {
                fetchExercises();
            }
        } catch (error) {
            console.log(error);
        }
    }


    setProgressToAsyncStorage = async (progress, isSetViewed = true) => {
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

    getProgressFromAsyncStorage = async () => {
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
    viewPrevious = () => {
        if (viewed > 0) {
            setViewed(viewed - 1);
        }
    }

    viewNext = () => {
        setViewed(viewed + 1);
    }
    /* endregion */

    /* region Navigate */
    const setLastRoute = useStoreActions((actions) => actions.setLastRoute);
    const setCurrentlyViewedExercise = useStoreActions((actions) => actions.setCurrentlyViewedExercise);

    const navigateToExercise = (id, title) => {
        setCurrentlyViewedExercise(title);
        setLastRoute('Progress');
        navigation.navigate('Read');
    }
    /* endregion */

    useEffect(() => {
        getExercisesFromAsyncStorage();
        getProgressFromAsyncStorage();
    }, []);

    useEffect(() => {
        setProgress(userProgress);
        setViewed(userProgress);
    },[userProgress]);

    // setProgress(userProgress);
    // setViewed(userProgress);

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
                            <Text style={styles.modalText}>Végeztél mára?</Text>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity onPress={() => {
                                    setIsModalOpened(false);
                                }} style={styles.modalNoButton}>
                                    <Text style={styles.textNoButton}>Nem</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalYesButton} onPress={() => {
                                    setProgressToAsyncStorage(progress + 1);
                                }}>
                                    <Text style={styles.text}>Igen</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* endregion */}

            {/* region Progress */}
            <ScrollView contentContainerStyle={{
                marginLeft: 0,
                width: screenWidth,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 60,
                paddingLeft: 20,
                paddingRight: 20
            }} contentInset={{top: 200, left: 0, bottom: 0, right: 0}}>
                <Text style={styles.progressId}>{viewed + 1}. GYAKORLAT</Text>
                <Text style={styles.progressText}>{exercises[viewed]?.title || 'Szentségem megáldja a világot.'}</Text>

                {/* region Actions */}
                <View style={styles.progressIcons}>
                    <TouchableOpacity onPress={() => {
                        viewPrevious();
                    }}>
                        <Image style={styles.smallIcon} source={require('../assets/old/back.png')}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigateToExercise(viewed, exercises[viewed]);
                    }}>
                        <Image style={styles.bigIcon} source={require('../assets/old/expand.png')}></Image>
                    </TouchableOpacity>
                    {progress > viewed &&
                        <TouchableOpacity onPress={() => {
                            viewNext();
                        }}>
                            <Image style={styles.smallIcon} source={require('../assets/old/view-next.png')}></Image>
                        </TouchableOpacity>
                    }
                    {progress === viewed &&
                        <TouchableOpacity onPress={() => {
                            setIsModalOpened(true);
                        }}>
                            <Image style={styles.smallIcon} source={require('../assets/old/next.png')}></Image>
                        </TouchableOpacity>
                    }
                </View>
                {/* endregion */}
                <Timer></Timer>

            </ScrollView>
            {/* endregion */}

            <Menu/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    progressId: {
        textAlign: 'center',
        paddingTop: 50,
        fontSize: 26,
        paddingBottom: 18
    },
    progressText: {
        fontSize: 19,
        fontWeight: '700',
        paddingBottom: 18,
        textAlign: 'center',
        width: 260,
        maxWidth: 260,
        marginBottom: 10
    },
    progressIcons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: 260,
        maxWidth: 260
    },
    smallIcon: {
        width: 42,
        height: 42
    },
    bigIcon: {
        width: 60,
        height: 60
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
    modalText: {
        fontWeight: '700',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
        color: 'black'
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
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    textNoButton: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#9E99ED',
    }
});
