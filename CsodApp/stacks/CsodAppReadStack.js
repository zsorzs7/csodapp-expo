import Menu from '../components/Menu';
import { StyleSheet, Text, View } from 'react-native';

export default function CsodAppReadStack() {
  return (
    <View style={styles.container}>
      <Text>ReadStack</Text>
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