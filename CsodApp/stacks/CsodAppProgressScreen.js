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

/* region Exercises Data */
const exercisesData = require('../data/exercises.json');
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

    const loadExercises = () => {
        try {
            // Load exercises from JSON file
            const exercisesFromJson = exercisesData.map((exercise) => ({
                ...exercise,
                index: exercise.index !== undefined ? parseInt(exercise.index) : 0
            }));
            setExercises(exercisesFromJson);
            setExercisesToStore(exercisesFromJson);
        } catch (error) {
            console.log('Error loading exercises:', error);
        }
    };

    // Helper function to find exercise by index
    const getExerciseByIndex = (index) => {
        return exercises.find(ex => ex.index === index) || null;
    };
    /* endregion */

    /* region Progress */
    const [progress, setProgress] = useState(0);
    const [viewed, setViewed] = useState(0);

    /* region Async Storage */
    // Only store current exercise index, not all exercises
    const setCurrentExerciseIndex = async (index) => {
        try {
            await AsyncStorage.setItem('currentExerciseIndex', `${index}`);
        } catch (error) {
            console.log('Error saving current exercise index:', error);
        }
    }

    const getCurrentExerciseIndex = async () => {
        try {
            const index = await AsyncStorage.getItem('currentExerciseIndex');
            if (index !== null) {
                return parseInt(index);
            }
            return 0;
        } catch (error) {
            console.log('Error getting current exercise index:', error);
            return 0;
        }
    }


    const setProgressToAsyncStorage = async (newProgress, isSetViewed = true) => {
        try {
            // Find the next exercise by index
            const currentExercise = getExerciseByIndex(progress);
            let nextIndex = newProgress;
            if (currentExercise) {
                const nextExercise = getExerciseByIndex(currentExercise.index + 1);
                if (nextExercise) {
                    nextIndex = nextExercise.index;
                }
            }
            
            setProgress(nextIndex);
            setIsModalOpened(false);
            if (isSetViewed) {
                setViewed(nextIndex);
            }
            await AsyncStorage.setItem('progress', `${nextIndex}`);
            // Also save current exercise index
            await setCurrentExerciseIndex(nextIndex);
        } catch (error) {
            console.log('Error saving progress:', error);
        }
    };

    const getProgressFromAsyncStorage = async () => {
        try {
            const savedProgress = await AsyncStorage.getItem('progress');
            if (savedProgress !== null) {
                const progressIndex = parseInt(savedProgress);
                // Verify the exercise exists
                const progressExercise = exercises.find(ex => ex.index === progressIndex);
                if (progressExercise) {
                    setProgress(progressIndex);
                    setViewed(progressIndex);
                } else if (exercises.length > 0) {
                    // If saved progress doesn't exist, use first exercise
                    const firstExercise = exercises[0];
                    setProgress(firstExercise.index);
                    setViewed(firstExercise.index);
                }
            } else if (exercises.length > 0) {
                // No saved progress, use first exercise
                const firstExercise = exercises[0];
                setProgress(firstExercise.index);
                setViewed(firstExercise.index);
            }
        } catch (error) {
            console.log('Error loading progress:', error);
        }
    };
    /* endregion */

    /* region Viewed */
    const viewPrevious = () => {
        const currentExercise = getExerciseByIndex(viewed);
        if (currentExercise) {
            const prevIndex = currentExercise.index - 1;
            const prevExercise = getExerciseByIndex(prevIndex);
            if (prevExercise) {
                setViewed(prevIndex);
            }
        }
    }

    const viewNext = () => {
        const currentExercise = getExerciseByIndex(viewed);
        if (currentExercise) {
            const nextIndex = currentExercise.index + 1;
            const nextExercise = getExerciseByIndex(nextIndex);
            if (nextExercise) {
                setViewed(nextIndex);
            }
        }
    }
    /* endregion */

    /* region Navigate */
    const setLastRoute = useStoreActions((actions) => actions.setLastRoute);
    const setCurrentlyViewedExercise = useStoreActions((actions) => actions.setCurrentlyViewedExercise);

    const navigateToExercise = (index) => {
        const exercise = getExerciseByIndex(index);
        if (exercise) {
            setCurrentlyViewedExercise(exercise);
            setLastRoute('Progress');
            navigation.navigate('Read');
        }
    }
    /* endregion */

    useEffect(() => {
        loadExercises();
    }, []);

    // Load progress after exercises are loaded
    useEffect(() => {
        if (exercises.length > 0) {
            getProgressFromAsyncStorage();
        }
    }, [exercises]);

    useEffect(() => {
        if (userProgress > 0) {
            const exercise = getExerciseByIndex(userProgress);
            if (exercise) {
                setProgress(exercise.index);
                setViewed(exercise.index);
            }
        }
    },[userProgress, exercises]);

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
            }}>
                {(() => {
                    const currentExercise = getExerciseByIndex(viewed);
                    return (
                        <>
                            <Text style={styles.progressId}>{currentExercise ? currentExercise.index : viewed}. GYAKORLAT</Text>
                            <Text style={styles.progressText}>{currentExercise?.title || 'Szentségem megáldja a világot.'}</Text>

                            {/* region Actions */}
                            <View style={styles.progressIcons}>
                                <TouchableOpacity onPress={() => {
                                    viewPrevious();
                                }}>
                                    <Image style={styles.smallIcon} source={require('../assets/old/back.png')}></Image>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    navigateToExercise(viewed);
                                }}>
                                    <Image style={styles.bigIcon} source={require('../assets/old/expand.png')}></Image>
                                </TouchableOpacity>
                                {(() => {
                                    const currentExercise = getExerciseByIndex(viewed);
                                    const progressExercise = getExerciseByIndex(progress);
                                    const canViewNext = progressExercise && currentExercise && progressExercise.index > currentExercise.index;
                                    const isAtCurrent = progressExercise && currentExercise && progressExercise.index === currentExercise.index;
                                    
                                    if (canViewNext) {
                                        return (
                                            <TouchableOpacity onPress={() => {
                                                viewNext();
                                            }}>
                                                <Image style={styles.smallIcon} source={require('../assets/old/view-next.png')}></Image>
                                            </TouchableOpacity>
                                        );
                                    }
                                    if (isAtCurrent) {
                                        return (
                                            <TouchableOpacity onPress={() => {
                                                setIsModalOpened(true);
                                            }}>
                                                <Image style={styles.smallIcon} source={require('../assets/old/next.png')}></Image>
                                            </TouchableOpacity>
                                        );
                                    }
                                    return null;
                                })()}
                            </View>
                        </>
                    );
                })()}
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
