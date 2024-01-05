import React from "react";
import {View, StyleSheet, Text, ScrollView, Pressable, Image, FlatList} from "react-native";
import {useStoreState, useStoreActions} from "easy-peasy";
import {TouchableOpacity} from "react-native-gesture-handler";
import Menu from "../components/Menu";

import {useNavigation} from '@react-navigation/native';

export default function CsodAppLibraryScreen() {
    const navigation = useNavigation();

    /* region Navigate */
    const setCurrentlyViewedExercise = useStoreActions((actions) => actions.setCurrentlyViewedExercise);
    const setLastRoute = useStoreActions((actions) => actions.setLastRoute);

    const navigateToExercise = (id, title) => {
        setCurrentlyViewedExercise(title);
        setLastRoute('Library');
        navigation.navigate('Read');
    }
    /* endregion */

    /* region Exercises */
    const exercises =  useStoreState(state => state.exercises);
    /* endregion */

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
    container: {
        flex: 1,
        paddingTop: 30,
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: '#F9F9F9',
        height: '100%',
        alignSelf: "stretch"
    }
});
