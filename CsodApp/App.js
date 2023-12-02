/* region */
import {StyleSheet} from 'react-native';
import {SafeAreaProvider} from "react-native-safe-area-context";
/* endregion */

/* region Navigation */
import {NavigationContainer} from '@react-navigation/native';
import CsodAppLibraryScreen from './stacks/CsodAppLibraryScreen';
import CsodAppProgressScreen from './stacks/CsodAppProgressScreen';
import CsodAppSettingsScreen from './stacks/CsodAppSettingsScreen';
import CsodAppReadScreen from './stacks/CsodAppReadScreen';
import {createStackNavigator} from '@react-navigation/stack';

const CsodAppStack = createStackNavigator();
import store from './store/store';
/* endregion */

/* region Store */
import {StoreProvider} from 'easy-peasy';
/* endregion */

export default function App() {
    return (
        <StoreProvider store={store}>
            <SafeAreaProvider>
                <NavigationContainer>
                    <CsodAppStack.Navigator initialRouteName="Progress"
                                            screenOptions={{headerShown: false, cardStyle: {backgroundColor: 'red'}}}>
                        <CsodAppStack.Screen name="Library" component={CsodAppLibraryScreen}
                                             options={{animationEnabled: false}}/>
                        <CsodAppStack.Screen name="Progress" component={CsodAppProgressScreen}
                                             options={{animationEnabled: false}}/>
                        <CsodAppStack.Screen name="Settings" component={CsodAppSettingsScreen}
                                             options={{animationEnabled: false}}/>
                        <CsodAppStack.Screen name="Read" component={CsodAppReadScreen}
                                             options={{animationEnabled: false}}/>
                    </CsodAppStack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </StoreProvider>
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
