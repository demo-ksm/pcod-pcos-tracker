import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import CycleTracker from '../../components/CycleTracker';
import StepCounter from '../../components/StepCounter';
import WaterTracker from '../../components/WaterTracker';
import { colors, fonts } from '../../constants/colors';

export default function HomeScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [water, setWater] = useState(0);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [profile, setProfile] = useState<any>({});

  const WATER_GOAL = 8;
  const today = new Date().toISOString().split('T')[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    buildMarked();
  }, [logs]);

  const loadAll = async () => {
    try {
      const [lg, w, wd, pf] = await Promise.all([
        AsyncStorage.getItem('periodLogs'),
        AsyncStorage.getItem('waterToday'),
        AsyncStorage.getItem('waterDate'),
        AsyncStorage.getItem('userProfile'),
      ]);
      if (lg) setLogs(JSON.parse(lg));
      if (wd === today && w) setWater(Number(w));
      else {
        await AsyncStorage.setItem('waterToday', '0');
        await AsyncStorage.setItem('waterDate', today);
      }
      if (pf) setProfile(JSON.parse(pf));
    } catch (e) {}
  };

  const buildMarked = () => {
    const marked: any = {};
    logs.forEach((log) => {
      const start = new Date(log.startDate);
      const end = log.endDate ? new Date(log.endDate) : start;
      let cur = new Date(start);
      while (cur <= end) {
        const ds = cur.toISOString().split('T')[0];
        marked[ds] = {
          color: colors.primary,
          textColor: '#fff',
          startingDay: ds === log.startDate,
          endingDay: ds === (log.endDate || log.startDate),
        };
        cur.setDate(cur.getDate() + 1);
      }
    });
    setMarkedDates(marked);
  };

  const getCycleInfo = () => {
    if (!logs.length) return { day: 1, daysUntil: null, avgCycle: 28 };
    const sorted = [...logs].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
    const lastStart = new Date(sorted[0].startDate);
    const now = new Date();
    const day = Math.max(
      1,
      Math.ceil((now.getTime() - lastStart.getTime()) / 86400000) + 1
    );
    let avgCycle = parseInt(profile.cycleLength) || 28;
    if (sorted.length >= 2) {
      const gaps: number[] = [];
      for (let i = 0; i < sorted.length - 1; i++) {
        const diff =
          (new Date(sorted[i].startDate).getTime() -
            new Date(sorted[i + 1].startDate).getTime()) /
          86400000;
        gaps.push(diff);
      }
      avgCycle = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
    }
    const next = new Date(lastStart);
    next.setDate(next.getDate() + avgCycle);
    const daysUntil = Math.ceil((next.getTime() - now.getTime()) / 86400000);
    return { day: Math.min(day, avgCycle), daysUntil, avgCycle };
  };

  const logPeriodToday = async () => {
    const alreadyLogged = logs.some((l) => l.startDate === today);
    if (alreadyLogged) return;
    const newLogs = [{ startDate: today, endDate: null }, ...logs];
    setLogs(newLogs);
    await AsyncStorage.setItem('periodLogs', JSON.stringify(newLogs));
    setCalendarVisible(false);
  };

  const addWater = async () => {
    if (water >= WATER_GOAL) return;
    const val = water + 1;
    setWater(val);
    await AsyncStorage.setItem('waterToday', String(val));
    await AsyncStorage.setItem('waterDate', today);
  };

  const { day, daysUntil, avgCycle } = getCycleInfo();
  const name = profile.name ? `, ${profile.name.split(' ')[0]}` : '';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {greeting}{name} 👋
          </Text>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => {}}
          >
            <Ionicons name="person-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Cycle Tracker — centerpiece */}
        <View style={styles.trackerSection}>
          <CycleTracker
            day={day}
            totalDays={avgCycle}
            daysUntil={daysUntil}
            onPress={() => setCalendarVisible(true)}
          />
        </View>

        {/* Step Counter */}
        <StepCounter />

        {/* Water Tracker */}
        <WaterTracker
          current={water}
          goal={WATER_GOAL}
          onAdd={addWater}
        />
      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        visible={calendarVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCalendarVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setCalendarVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.sheet}
            onPress={() => {}}
          >
            {/* Handle */}
            <View style={styles.handle} />

            {/* Sheet Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Cycle Calendar</Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setCalendarVisible(false)}
              >
                <Ionicons name="close" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Calendar */}
            <Calendar
              markingType="period"
              markedDates={{
                ...markedDates,
                [today]: {
                  ...(markedDates[today] || {}),
                  today: true,
                },
              }}
              theme={{
                calendarBackground: colors.card,
                textSectionTitleColor: colors.subtext,
                todayTextColor: colors.primary,
                dayTextColor: colors.text,
                textDisabledColor: colors.border,
                arrowColor: colors.primary,
                monthTextColor: colors.text,
                textDayFontFamily: fonts.medium,
                textMonthFontFamily: fonts.bold,
                textDayHeaderFontFamily: fonts.medium,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: '#fff',
              }}
            />

            {/* Legend + Log Button */}
            <View style={styles.sheetFooter}>
              <View style={styles.legend}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.legendText}>Period days</Text>
              </View>
              <TouchableOpacity
                style={styles.logBtn}
                onPress={logPeriodToday}
              >
                <Ionicons name="add-circle-outline" size={17} color="#fff" />
                <Text style={styles.logBtnText}>Log Period Today</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 12,
    paddingBottom: 30,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  greeting: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.text,
    letterSpacing: -0.3,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackerSection: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetTitle: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.text,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetFooter: {
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 12,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.subtext,
  },
  logBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: '#fff',
  },
});