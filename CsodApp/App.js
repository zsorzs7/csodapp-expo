/* region */
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
/* endregion */

/* region Navigation */
import { NavigationContainer } from '@react-navigation/native';
import CsodAppReadStack from './stacks/CsodAppReadStack';
import CsodAppProgressStack from './stacks/CsodAppProgressStack';
import CsodAppSettingsStack from './stacks/CsodAppSettingsStack';
import { createStackNavigator } from '@react-navigation/stack';
const CsodAppStack = createStackNavigator();
/* endregion */

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <CsodAppStack.Navigator initialRouteName="Progress">
          <CsodAppStack.Screen name="Read" component={CsodAppReadStack} />
          <CsodAppStack.Screen name="Progress" component={CsodAppProgressStack} />
          <CsodAppStack.Screen name="Settings" component={CsodAppSettingsStack} />
        </CsodAppStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
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
