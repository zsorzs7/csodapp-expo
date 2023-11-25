import Menu from '../components/Menu';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useState, useEffect } from 'react';

/* region Progress */
import AsyncStorage from '@react-native-async-storage/async-storage';
/* endregion */

export default function CsodAppProgressStack() {
  /* region Progress */
  const [progress, setProgress] = useState(0);

  setProgressToAsyncStorage = async (progress) => {
    try {
      await AsyncStorage.setItem(
        'progress',
        `${progress+4}`
      );
      setProgress(progress);
    } catch (error) {}
  };

  getProgressFromAsyncStorage = async () => {
    try {
      const progress = await AsyncStorage.getItem('progress');
      if (progress !== null) {
        setProgress(parseInt(progress));
      }
    } catch (error) {}
  };
  /* endregion */

  return (
    <View style={styles.container}>
      <Button title="Add+Set" onPress={() => { setProgressToAsyncStorage(progress+1) }}></Button>
      <Text>{progress}</Text>
      <Button title="Get" onPress={() => { getProgressFromAsyncStorage() }}></Button>
      <Menu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});