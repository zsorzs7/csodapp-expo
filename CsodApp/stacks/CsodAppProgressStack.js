import Menu from '../components/Menu';
import { StyleSheet, Text, View, Button, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

/* region Progress */
import AsyncStorage from '@react-native-async-storage/async-storage';
/* endregion */

export default function CsodAppProgressStack() {
  /* region Progress */
  const [progress, setProgress] = useState(0);
  const [viewed, setViewed] = useState(0);
  const [exercises, setExercises] = useState([])

  /* region Async Storage */
  setProgressToAsyncStorage = async (progress) => {
    try {
      await AsyncStorage.setItem(
        'progress',
        `${progress+4}`
      );
      setProgress(progress);
      setViewed(progress);
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

  /* region Viewed */
  viewPrevious = () => {
    if(viewed > 0) {
      setViewed(viewed - 1);
    }
  }

  viewNext = () => {
      setViewed(viewed + 1);
  }
  /* endregion */

  fetchExercises = async () => {
    try {
      const firebaseConfig = {
        apiKey: "AIzaSyDDvcz0oGtL8gFQq0OSidN_BjQINIOj3vg",
        authDomain: "csodapp-471f4.firebaseapp.com",
        projectId: "csodapp-471f4",
        storageBucket: "csodapp-471f4.appspot.com",
        messagingSenderId: "41075695763",
        appId: "1:41075695763:web:a7973be2a4d290eca06d66",
        measurementId: "G-8B1367S9RM"
      };

      const app = initializeApp(firebaseConfig);      
      const db = getFirestore(app);
      const table = collection(db, "420");
      const titleCollection = await getDocs(table);
      const exercises = titleCollection.docs.map((doc) => doc.data());
      exercises.map((title, idx) => (title.index = idx));
      setExercises(exercises);
      console.log(exercises[0]);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {  
    fetchExercises();
  });

  return (
    <View style={styles.container}>  
      {/* region Progress */}
      <ScrollView contentContainerStyle={{ marginLeft: 0, width: screenWidth, justifyContent: 'center', alignItems: 'center', paddingTop: 60, paddingLeft: 20, paddingRight: 20}} contentInset={{top: 200, left: 0, bottom: 0, right: 0}}>
        <Text style={styles.progressId}>{viewed}. GYAKORLAT</Text>
        <Text style={styles.progressText}>{exercises[viewed]?.title || 'Sanyi'}</Text>
        <View style={styles.progressIcons}>
          <TouchableOpacity onPress={() => {viewPrevious()}}>
            <Image style={styles.smallIcon} source={require('../assets/old/back.png')}></Image>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image style={styles.bigIcon} source={require('../assets/old/expand.png')}></Image>
         </TouchableOpacity>
         {progress > viewed &&
          <TouchableOpacity onPress={() => {viewNext()}}>
            <Image style={styles.smallIcon} source={require('../assets/old/view-next.png')}></Image>
          </TouchableOpacity>
        }
        {progress === viewed &&
         <TouchableOpacity onPress={() => {setProgressToAsyncStorage(progress+1)}}>
            <Image style={styles.smallIcon} source={require('../assets/old/next.png')}></Image>
         </TouchableOpacity>  
        }       
        </View>
      </ScrollView>
      {/* endregion */}

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
 progressId: {
    textAlign: 'center',
    paddingTop: 150,
    fontSize: 20,
    paddingBottom: 18
  },
  progressText: {
    fontSize: 19,
    fontWeight: '700',
    paddingBottom: 18,
    textAlign: 'center',
    width: 260,
    maxWidth: 260,
    height: 100,
    marginBottom: 10
  },
  progressIcons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 260,
    maxWidth: 260
  },
  smallIcon: {
    width: 42,
    height: 42
  },
  bigIcon: {
    width: 60,
    height: 60
  }
});