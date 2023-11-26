/* region */
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
/* endregion */

/* region Navigation */
import { NavigationContainer } from '@react-navigation/native';
import CsodAppReadStack from './stacks/CsodAppReadStack';
import CsodAppProgressStack from './stacks/CsodAppProgressStack';
import CsodAppSettingsStack from './stacks/CsodAppSettingsStack';
import CsodAppExerciseReadStack from './stacks/CsodAppExerciseReadStack';
import { createStackNavigator } from '@react-navigation/stack';
const CsodAppStack = createStackNavigator();
/* endregion */

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <CsodAppStack.Navigator initialRouteName="ExerciseRead" screenOptions={{headerShown: false, cardStyle: {backgroundColor: 'red'}}}>
          <CsodAppStack.Screen name="Read" component={CsodAppReadStack} options={{animationEnabled: false}} />
          <CsodAppStack.Screen name="Progress" component={CsodAppProgressStack} options={{animationEnabled: false}} />
          <CsodAppStack.Screen name="Settings" component={CsodAppSettingsStack} options={{animationEnabled: false}} />
          <CsodAppStack.Screen name="ExerciseRead" component={CsodAppExerciseReadStack} options={{animationEnabled: false}} />
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
