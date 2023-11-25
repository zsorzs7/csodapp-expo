import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Menu() {
    const navigation = useNavigation();

    return (
    <View style={menuStyles.menu}>
      <TouchableOpacity onPress={() => { navigation.navigate('Read') }}>
        <Image style={menuStyles.menuItem} source={require('../assets/old/read.png')}></Image>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.navigate('Progress') }}>
        <Image style={menuStyles.menuItem} source={require('../assets/old/home.png')}></Image>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.navigate('Settings') }}>
        <Image style={menuStyles.menuItem} source={require('../assets/old/settings.png')}></Image>
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