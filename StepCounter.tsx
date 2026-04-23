import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../constants/colors';

const STEP_GOAL = 8000;

export default function StepCounter() {
  const [steps, setSteps] = useState(0);
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let subscription: any;

    const setup = async () => {
      const isAvail = await Pedometer.isAvailableAsync();
      setAvailable(isAvail);

      if (isAvail) {
        // Get today's steps
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        try {
          const result = await Pedometer.getStepCountAsync(start, end);
          if (result) setSteps(result.steps);
        } catch (e) {}

        // Live updates
        subscription = Pedometer.watchStepCount((result) => {
          setSteps(result.steps);
        });
      }
    };

    setup();
    return () => subscription?.remove();
  }, []);

  const progress = Math.min(steps / STEP_GOAL, 1);
  const percentage = Math.round(progress * 100);

  if (available === false) {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Ionicons name="walk-outline" size={18} color={colors.subtext} />
          <Text style={styles.unavailable}>Step counter not available on this device</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Ionicons name="walk" size={18} color={colors.success} />
        </View>
        <View style={styles.textBlock}>
          <View style={styles.numberRow}>
            <Text style={styles.stepCount}>
              {steps.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.stepLabel}>steps</Text>
          </View>
          <Text style={styles.goalText}>{percentage}% of daily goal</Text>
        </View>
        <Text style={styles.goalNumber}>
          {STEP_GOAL.toLocaleString('en-IN')}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.bar}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.successSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: { flex: 1 },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  stepCount: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.text,
    letterSpacing: -0.5,
  },
  stepLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.subtext,
  },
  goalText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.subtext,
    marginTop: 1,
  },
  goalNumber: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.subtext,
  },
  bar: {
    height: 5,
    backgroundColor: colors.muted,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 3,
  },
  unavailable: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.subtext,
  },
});