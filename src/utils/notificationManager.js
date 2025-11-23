import notifee, { TriggerType, RepeatFrequency } from '@notifee/react-native';
import { Platform } from 'react-native';

// Request notification permission
export async function requestPermission() {
  if (Platform.OS === 'android') {
    return await notifee.requestPermission();
  }
}

// Create channel
export async function createChannel() {
  await notifee.createChannel({
    id: 'salah',
    name: 'Salah Reminders',
    lights: true,
    vibration: true,
  });
}

// Schedule a single daily notification
export async function scheduleDailyNotification(id, title, body, timeString) {
  const [hour, minute] = timeString.split(':').map(Number);

  const date = new Date(Date.now());
  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(0);

  // If the time already passed today → schedule for tomorrow
  if (date < new Date()) {
    date.setDate(date.getDate() + 1);
  }

  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
    repeatFrequency: RepeatFrequency.DAILY,   // ⭐ FIXED
  };

  await notifee.createTriggerNotification(
    {
      id,
      title,
      body,
      android: {
        channelId: 'salah',
        smallIcon: 'ic_launcher', // must exist in mipmap
        pressAction: { id: 'default' },
      },
    },
    trigger
  );
}

// Cancel all notifications
export async function cancelAll() {
  await notifee.cancelAllNotifications();
}

// Schedule 5 Fard Salah notifications
export async function scheduleFard(timings) {
  await scheduleDailyNotification('fajr', 'Fajr Salah', 'It is time for Fajr', timings.Fajr);
  await scheduleDailyNotification('dhuhr', 'Dhuhr Salah', 'It is time for Dhuhr', timings.Dhuhr);
  await scheduleDailyNotification('asr', 'Asr Salah', 'It is time for Asr', timings.Asr);
  await scheduleDailyNotification('maghrib', 'Maghrib Salah', 'It is time for Maghrib', timings.Maghrib);
  await scheduleDailyNotification('isha', 'Isha Salah', 'It is time for Isha', timings.Isha);
}

// Custom times
export async function scheduleCustom(times) {
  await scheduleDailyNotification('fajr', 'Fajr Reminder', 'It is Fajr time', times.fajr);
  await scheduleDailyNotification('dhuhr', 'Dhuhr Reminder', 'It is Dhuhr time', times.dhuhr);
  await scheduleDailyNotification('asr', 'Asr Reminder', 'It is Asr time', times.asr);
  await scheduleDailyNotification('maghrib', 'Maghrib Reminder', 'It is Maghrib time', times.maghrib);
  await scheduleDailyNotification('isha', 'Isha Reminder', 'It is Isha time', times.isha);
}
