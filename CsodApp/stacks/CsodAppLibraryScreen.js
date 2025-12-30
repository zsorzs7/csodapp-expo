import React from "react";
import {View, StyleSheet, Text, ScrollView, Pressable} from "react-native";
import {useStoreState, useStoreActions} from "easy-peasy";
import {TouchableOpacity} from "react-native-gesture-handler";
import Menu from "../components/Menu";

import {useNavigation} from '@react-navigation/native';

export default function CsodAppLibraryScreen() {
    const navigation = useNavigation();

    /* region Navigate */
    const setCurrentlyViewedExercise = useStoreActions((actions) => actions.setCurrentlyViewedExercise);
    const setLastRoute = useStoreActions((actions) => actions.setLastRoute);
    const triggerTimerReset = useStoreActions((actions) => actions.triggerTimerReset);

    /* endregion */

    /* region Exercises */
    const exercises = useStoreState(state => state.exercises);
    
    // Sort exercises by index to ensure correct order
    const sortedExercises = exercises.length > 0 
        ? [...exercises].sort((a, b) => {
            const indexA = parseInt(a.index) || 0;
            const indexB = parseInt(b.index) || 0;
            return indexA - indexB;
        })
        : [];
    /* endregion */

    const navigateToExercise = (exerciseIndex) => {
        // Find the exercise by index from the original exercises array
        const exercise = exercises.find(ex => parseInt(ex.index) === parseInt(exerciseIndex));
        if (exercise) {
            setCurrentlyViewedExercise(exercise);
            setLastRoute('Library');
            triggerTimerReset();
            navigation.navigate('Read');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Könyvtár</Text>
            <ScrollView style={styles.exercisesList}>
                {sortedExercises.map((item, index) => (
                    <Pressable
                        key={`exercise-${item.index}-${index}`}
                        style={styles.titleContainer}
                        onPress={() => navigateToExercise(item.index)}>
                        <Text style={styles.titleItemId}>
                            {item.index}.
                        </Text>
                        <Text style={styles.titleItemText}>
                            {item.title}
                        </Text>
                    </Pressable>
                ))}
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
    container: {
        flex: 1,
        paddingTop: 30,
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: '#F9F9F9',
        height: '100%',
        alignSelf: "stretch",
        paddingBottom: 60
    },
    exercisesList: {
        width: '100%',
        padding: 20
    }
});
