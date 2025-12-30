import ReadMenu from '../components/ReadMenu';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {useStoreState, useStoreActions} from "easy-peasy";
import {useState, useEffect} from 'react';

export default function CsodAppReadScreen() {
    const currentlyViewedExercise = useStoreState((state) => state.currentlyViewedExercise);

    useEffect(() => {
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>{currentlyViewedExercise.index || ''}. gyakorlat</Text>
            <Text style={styles.exerciseTitle}>{currentlyViewedExercise.title}</Text>
            <ScrollView>
                <View style={styles.pageContent}>
                    {currentlyViewedExercise.text.split(/[0-9]|[0-9][0-9]|[1-9]0+/).filter(title => title.length).map((title, idx) => (
                        <Text key={idx + '-part'} style={styles.exercisePart}>{idx + 1}{title}</Text>
                    ))}
                    {currentlyViewedExercise.text.split(/[0-9]|[0-9][0-9]|[1-9]0+/).filter(title => title.length).map((title, idx) => (
                        <Text key={idx + '-part'} style={styles.exercisePart}>{idx + 1}{title}</Text>
                    ))}
                </View>
            </ScrollView>
            <ReadMenu/>
        </View>
    );
}

const styles = StyleSheet.create({
    exerciseTitle: {
        fontWeight: '700',
        fontSize: 16,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30
    },
    exercisePart: {
        paddingBottom: 12
    },
    pageContent: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 80,
        flex: 1,
        width: '100%',
        alignSelf: 'stretch'
    },
    screenTitle: {
        textTransform: 'uppercase',
        fontSize: 26,
        fontStyle: 'normal',
        paddingBottom: 20,
        paddingTop: 30,
        paddingLeft: 30,
        paddingRight: 30
    },
    menuItem: {
        height: 40,
        width: 40
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
    }
});
