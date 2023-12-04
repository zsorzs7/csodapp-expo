import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useStoreState} from 'easy-peasy';


export default function ReadMenu() {
    const navigation = useNavigation();

    const lastRoute = useStoreState((state) => state.lastRoute);

    const navigateToLastRoute = () => {
        navigation.navigate(lastRoute);
    }

    return (
        <View style={menuStyles.menu}>
            <TouchableOpacity onPress={() => {
                navigateToLastRoute();
            }}>
                <Image style={menuStyles.menuItem} source={require('../assets/old/back.png')}></Image>
            </TouchableOpacity>
        </View>
    );
}

const menuStyles = StyleSheet.create({
    menu: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: "space-around",
        paddingTop: 12,
        height: 64,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 12,
        backgroundColor: 'white',
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0
    },
    menuItem: {
        height: 40,
        width: 40
    },
});
