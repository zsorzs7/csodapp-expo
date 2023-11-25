/* region */
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
/* endregion */

/* region Navigation */
import { NavigationContainer } from '@react-navigation/native';
import CsodAppListenStack from './stacks/CsodAppListenStack';
import { createStackNavigator } from '@react-navigation/stack';
const CsodAppStack = createStackNavigator();
/* endregion */

export default function App() {
  return (
    <NavigationContainer>
      <CsodAppStack.Navigator>
        <CsodAppStack.Screen name="Aktuális gyakorlat" component={CsodAppListenStack} />
      </CsodAppStack.Navigator>
    </NavigationContainer>
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
