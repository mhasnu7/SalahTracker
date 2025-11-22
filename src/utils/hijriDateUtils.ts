import { UmmalquraCalendar } from "@umalqura/core";

export const hijriMonths = [
  "محرم", "صفر", "ربيع الأول", "ربيع الثاني", "جمادى الأولى", "جمادى الآخرة",
  "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
];

export const HIJRI_WEEKDAY_NAMES = [
  "السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"
];

export interface HijriDateInfo {
  day: number;
  month: number;
  year: number;
  arabicMonthName: string;
}

export const toHijri = (date: Date): HijriDateInfo => {
  const hijri = UmmalquraCalendar.fromGregorian(date);
  return {
    day: hijri.day,
    month: hijri.month - 1, // Adjust to 0-indexed month
    year: hijri.year,
    arabicMonthName: hijriMonths[hijri.month - 1],
  };
};

export const generateMonthDays = (month: number, year: number) => {
  const firstDayOfMonthGregorian = new Date(year, month, 1);
  const hijriFirstDay = UmmalquraCalendar.fromGregorian(firstDayOfMonthGregorian);
  
  const days: (any | null)[] = [];
  const totalDaysInHijriMonth = hijriFirstDay.getDaysInMonth(hijriFirstDay.year, hijriFirstDay.month);

  // Determine the starting day of the week for the first day of the Hijri month
  // UmmalquraCalendar.fromGregorian returns a day of the week where Sunday=0, Saturday=6
  // Our HIJRI_WEEKDAY_NAMES starts with Saturday (0-indexed)
  const firstDayOfWeekGregorian = new Date(hijriFirstDay.toGregorian().setDate(hijriFirstDay.toGregorian().getDate())).getDay();
  // Adjust for Saturday being the first day in HIJRI_WEEKDAY_NAMES (Saturday=0, Sunday=1, ..., Friday=6)
  const adjustedStartDay = (firstDayOfWeekGregorian + 1) % 7;


  for (let i = 0; i < adjustedStartDay; i++) {
    days.push(null);
  }

  for (let d = 1; d <= totalDaysInHijriMonth; d++) {
    const currentHijriDate = UmmalquraCalendar.fromHijri(year, month + 1, d); // month is 1-indexed for UmmalquraCalendar
    const gregorian = currentHijriDate.toGregorian();

    days.push({
      hijriDay: d,
      arabicDay: HIJRI_WEEKDAY_NAMES[currentHijriDate.dayOfWeek === 0 ? 6 : currentHijriDate.dayOfWeek - 1], // Adjust for Saturday=0 in our array
      gregorianDay: gregorian.getDate(),
      gregorianMonth: gregorian.getMonth() + 1,
      gregorianYear: gregorian.getFullYear(),
    });
  }

  const weeks: (any | null)[][] = [];
  let currentWeek: (any | null)[] = [];

  for (let i = 0; i < days.length; i++) {
    currentWeek.push(days[i]);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
};

export const getHijriMonthName = (monthIndex: number): string => {
  return hijriMonths[monthIndex];
};