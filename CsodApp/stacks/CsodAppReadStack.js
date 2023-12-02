import React, {useState, useEffect} from "react";
import {View, StyleSheet, Text, ScrollView, Pressable, Image} from "react-native";
import {useStoreState, useStoreActions} from "easy-peasy";
import {TouchableOpacity} from "react-native-gesture-handler";
import Menu from "../components/Menu";

import {initializeApp} from "firebase/app";
import {getFirestore, collection, getDocs, query} from "firebase/firestore";
import {useNavigation} from '@react-navigation/native';

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

/* region Progress */
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function CsodAppProgressStack() {
    const navigation = useNavigation();

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
    const setCurrentlyViewedExercise = useStoreActions((actions) => actions.setCurrentlyViewedExercise);
    const setLastRoute = useStoreActions((actions) => actions.setLastRoute);

    const navigateToExercise = (id, title) => {
        setCurrentlyViewedExercise(title);
        setLastRoute('Read');
        navigation.navigate('ExerciseRead');
    }
    /* endregion */

    useEffect(() => {
        getExercisesFromAsyncStorage();
        getProgressFromAsyncStorage();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Könyvtár</Text>
            <ScrollView>
                <View style={styles.pageContent}>
                    {exercises.map((title, idx) => (
                        title.index >= 0 ?
                            <TouchableOpacity key={idx + title} onPress={() => {
                                navigateToExercise(idx, exercises[idx])
                            }}
                                              style={(idx === exercises.length - 1) ? styles.borderlessTitleContainer : styles.titleContainer}>
                                <Text style={styles.titleItemId}>
                                    {title.index + 1}.
                                </Text>
                                <Text style={styles.titleItemText}>
                                    {title.title}
                                </Text>
                            </TouchableOpacity> : <Text></Text>))}
                </View>
            </ScrollView>
            <Menu/>
        </View>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 15,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)',
        alignSelf: "stretch",
        minWidth: 300
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
        minWidth: 300
    },
    titleItemId: {
        paddingRight: 12,
        color: '#9E99ED'
    },
    titleItemText: {
        fontWeight: '700',
        maxWidth: 250
    },
    pageContent: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 80,
        flex: 1,
        width: '100%',
        alignSelf: "stretch"
    },
    screenTitle: {
        textTransform: 'uppercase',
        fontSize: 26,
        fontStyle: 'normal',
        paddingTop: 30,
        paddingBottom: 15,
        paddingLeft: 30
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
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});
