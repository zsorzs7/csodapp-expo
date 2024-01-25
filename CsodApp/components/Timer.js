import React, {useState} from "react";
import {View, StyleSheet, Text, Image} from "react-native";
import {useStoreState, useStoreActions} from "easy-peasy";
import {TouchableOpacity} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Dimensions} from 'react-native';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer'
import { Audio } from "expo-av";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


export const Timer = () => {
    const doneExercisesToday = useStoreState((state) => state.doneExercisesToday);
    const [stateDoneExercises, setStateDoneExercises] = useState(doneExercisesToday);
    const addDoneExercise = useStoreActions((actions) => actions.addDoneExercise);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasPlayed, setHasPlayed] = useState(0);
    const [sound, setSound] = React.useState();

    const getDoneExercisesToday = async () => {
        const doneExercisesToday = await AsyncStorage.getItem('doneExercisesToday');
        if (doneExercisesToday !== null) {
            await setDoneExercisesAsyncStorage(JSON.parse(doneExercisesToday));
            setStateDoneExercises(JSON.parse(doneExercisesToday));
        } else {
            await setDoneExercisesAsyncStorage(0);
            setStateDoneExercises(0);
        }
    }

    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/old/sounds/notification2.wav')
        );
        setSound(sound);

        await sound.playAsync(); }

    React.useEffect(() => {
        getDoneExercisesToday();
        return sound
            ? () => {
                sound.unloadAsync(); }
            : undefined;
    }, [sound]);

    const stepUpToday = async () => {
        addDoneExercise();
        await setDoneExercisesAsyncStorage(doneExercisesToday + 1);
        setStateDoneExercises(doneExercisesToday + 1);
    }

    const setDoneExercisesAsyncStorage = async (number) => {
        try {
            await AsyncStorage.setItem('doneExercisesToday', JSON.stringify(number));
        }
        catch(e){
            console.log(error);
        }
    }

    const [duration, setDuration] = useState(900);

    return (<View style={[styles.timer]}>
        <View style={{backgroundColor: 'white', borderRadius: 100, padding: 10, elevation: 0.5}}>
            <View style={{borderRadius: 100, padding: 0, borderWidth: 0, borderStyle: 'dashed'}}>
                <CountdownCircleTimer
                    key={duration}
                    isPlaying={isPlaying}
                    duration={900}
                    colors={['#9E99ED', '#F7C4D5']}
                    strokeWidth={18}
                    trailColor={'white'}
                    strokeLinecap={'butt'}
                    onComplete={() => {
                        setIsPlaying(false);
                        setHasPlayed(hasPlayed + 1);
                        stepUpToday();
                        playSound();
                        return {shouldRepeat: true, delay: 1.5}
                    }}
                >
                    {({remainingTime}) => <View style={styles.timerInside}>
                        {isPlaying ?
                            <TouchableOpacity style={{height: 40}} onPress={() => {
                                setIsPlaying(false);
                                setDuration(remainingTime);
                            }}>
                                <Image style={{height: 36.73, width: 36}}
                                       source={require('../assets/old/stop.png')}></Image>
                            </TouchableOpacity> :
                            <TouchableOpacity style={{height: 40}} onPress={() => {
                                setIsPlaying(true)
                            }}>
                                <Image style={{height: 39.73, width: 36}}
                                       source={require('../assets/old/start.png')}></Image>
                            </TouchableOpacity>}
                        <Text style={styles.timerInsideTime}>{Math.floor(remainingTime / 60)}
                            :{remainingTime - Math.floor(remainingTime / 60) * 60 < 10 ? '0' : ''}
                            {remainingTime - Math.floor(remainingTime / 60) * 60}</Text>
                    </View>}
                </CountdownCircleTimer>
            </View>
        </View>
        {/*<View style={styles.checkboxContainer}>*/}
        {/*    {[1, 2, 3, 4, 5].map((todo, idx) => (*/}
        {/*        idx + 1 <= doneExercisesToday ?*/}
        {/*            <Image style={styles.checkbox} key={idx} source={require('../assets/old/checkbox-checked.png')}></Image>*/}
        {/*            :*/}
        {/*            <TouchableOpacity key={idx} onPress={() => stepUpToday()}>*/}
        {/*                <Image style={styles.checkbox} source={require('../assets/old/checkbox.png')}></Image>*/}
        {/*            </TouchableOpacity>*/}
        {/*    ))}*/}
        {/*</View>*/}
    </View>);
};

const styles = StyleSheet.create({
    timerInside: {
        height: 143,
        width: 123,
        backgroundColor: 'white',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1
    },
    timerInsideTime: {
        fontSize: 20,
        fontWeight: '300',
        color: '#9E99ED',
        paddingTop: 10
    },
    timer: {
        marginTop: 40,
        backgroundColor: '#F9F9F9',
        width: '100%',
        padding: 25,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    checkboxContainer: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 15
    },
    checkbox: {
        width: 20,
        height: 20,
        margin: 8
    }
});
