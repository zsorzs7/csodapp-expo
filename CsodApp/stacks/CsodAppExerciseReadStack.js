import ExerciseReadMenu from '../components/ExerciseReadMenu';
import { StyleSheet, Text, View } from 'react-native';

export default function CsodAppExerciseReadStack() {
  return (
    <View style={styles.container}>
      <Text>ReadStack</Text>
      <ExerciseReadMenu />
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