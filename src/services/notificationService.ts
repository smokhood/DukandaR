// Notification Service for DukandaR
import { Deal } from '@models/Deal';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permission
 * @returns True if granted
 */
export async function requestPermission(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#16a34a',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.error('Request notification permission error:', error);
    return false;
  }
}

/**
 * Get Expo push token (for production)
 * @returns Push token or null
 */
export async function getExpoPushToken(): Promise<string | null> {
  try {
    // Push notifications don't work in Expo Go
    if (!Constants.isDevice) {
      console.log('Push notifications only work on physical devices');
      return null;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      console.log('No project ID found');
      return null;
    }

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;

    return token;
  } catch (error) {
    console.error('Get Expo push token error:', error);
    return null;
  }
}

/**
 * Schedule a local notification
 * @param title Notification title
 * @param body Notification body
 * @param trigger Seconds from now (null for immediate)
 * @returns Notification identifier
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  seconds: number | null = null
): Promise<string> {
  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: seconds === null 
        ? null 
        : { 
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds,
            repeats: false,
          },
    });

    return identifier;
  } catch (error) {
    console.error('Schedule local notification error:', error);
    throw error;
  }
}

/**
 * Schedule deal alert notification
 * @param deal Deal object
 */
export async function scheduleDealAlert(deal: Deal): Promise<void> {
  try {
    await scheduleLocalNotification(
      '🔥 Aaj Ka Deal!',
      `${deal.shopName}: ${deal.productName} sirf Rs. ${deal.dealPrice}`,
      null // Immediate
    );
  } catch (error) {
    console.error('Schedule deal alert error:', error);
    // Don't throw - notification is not critical
  }
}

/**
 * Schedule stock reminder for shop owner
 * @param productName Product name
 * @param searchCount Number of searches
 */
export async function scheduleStockReminderForOwner(
  productName: string,
  searchCount: number
): Promise<void> {
  try {
    await scheduleLocalNotification(
      '🔍 Customers Dhundh Rahe Hain',
      `${searchCount} log "${productName}" dhundh rahe hain aapke qareeb. Kya aapke paas hai?`,
      null // Immediate
    );
  } catch (error) {
    console.error('Schedule stock reminder error:', error);
    // Don't throw - notification is not critical
  }
}

/**
 * Cancel a scheduled notification
 * @param id Notification identifier
 */
export async function cancelNotification(id: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (error) {
    console.error('Cancel notification error:', error);
  }
}

/**
 * Cancel all notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Cancel all notifications error:', error);
  }
}
