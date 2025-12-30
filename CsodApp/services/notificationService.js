import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const exercisesData = require('../data/exercises.json');

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Get current exercise index from AsyncStorage
const getCurrentExerciseIndex = async () => {
  try {
    const index = await AsyncStorage.getItem('currentExerciseIndex');
    if (index !== null && !isNaN(parseInt(index))) {
      return parseInt(index);
    }
    // Fallback to progress
    const progress = await AsyncStorage.getItem('progress');
    if (progress !== null && !isNaN(parseInt(progress))) {
      return parseInt(progress);
    }
    // Default to first exercise index
    const firstExercise = exercisesData.find(ex => ex.index !== undefined);
    return firstExercise ? parseInt(firstExercise.index) : 1;
  } catch (error) {
    console.log('Error getting current exercise index:', error);
    const firstExercise = exercisesData.find(ex => ex.index !== undefined);
    return firstExercise ? parseInt(firstExercise.index) : 1;
  }
};

// Get exercise by index
const getExerciseByIndex = (index) => {
  const exercise = exercisesData.find(ex => ex.index === index);
  if (exercise) {
    return exercise;
  }
  // Fallback to first exercise
  return exercisesData.find(ex => ex.index !== undefined) || exercisesData[0] || { index: 1, title: 'Gyakorlat' };
};

// Request notification permissions
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('Error requesting notification permissions:', error);
    return false;
  }
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.log('Error cancelling notifications:', error);
  }
};

// Schedule daily notifications at specified times
export const scheduleDailyNotifications = async () => {
  try {
    // First, cancel all existing notifications
    await cancelAllNotifications();
    
    // Check if notifications are enabled
    const notificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');
    if (notificationsEnabled !== 'true') {
      console.log('Notifications are disabled');
      return;
    }
    
    // Request permissions
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permissions not granted');
      return;
    }
    
    // Get current exercise
    const currentIndex = await getCurrentExerciseIndex();
    const exercise = getExerciseByIndex(currentIndex);
    
    // Ensure exercise index is a number
    const exerciseIndex = exercise.index !== undefined ? parseInt(exercise.index) : currentIndex;
    const exerciseTitle = exercise.title || `Gyakorlat ${exerciseIndex}`;
    
    // Notification times: every hour from 10:00 to 19:00
    const notificationTimes = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    
    // Schedule notifications for each time
    for (let i = 0; i < notificationTimes.length; i++) {
      const hour = notificationTimes[i];
      
      // Create notification content
      const notificationContent = {
        title: `CsodApp - ${exerciseIndex}. GYAKORLAT`,
        body: exerciseTitle,
        sound: true,
        data: { exerciseIndex: exerciseIndex },
      };
      
      // Schedule for today and every day after
      // Use DailyTriggerInput format for Expo SDK 54
      const trigger = {
        type: 'daily',
        hour: hour,
        minute: 0,
        repeats: true,
      };
      
      await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: trigger,
      });
      
      // console.log(`Scheduled notification for ${hour}:00`);
    }
    
    // console.log('All daily notifications scheduled (10:00 - 19:00 every hour)');
  } catch (error) {
    console.log('Error scheduling notifications:', error);
  }
};

// Update notifications when exercise changes
export const updateNotifications = async () => {
  await scheduleDailyNotifications();
};

// Initialize notifications (call on app start)
export const initializeNotifications = async () => {
  try {
    const notificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');
    if (notificationsEnabled === 'true') {
      await scheduleDailyNotifications();
    }
  } catch (error) {
    console.log('Error initializing notifications:', error);
  }
};

