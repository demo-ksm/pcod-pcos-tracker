import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { colors, fonts } from '../constants/colors';

const { width } = Dimensions.get('window');
const SIZE = width * 0.62;
const STROKE = 16;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

interface Props {
  day: number;
  totalDays: number;
  daysUntil: number | null;
  onPress: () => void;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function CycleTracker({ day, totalDays, daysUntil, onPress }: Props) {
  const animVal = useRef(new Animated.Value(0)).current;

  const progress = Math.min(day / totalDays, 1);

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: progress,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRC, 0],
  });

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  const periodText =
    daysUntil === null
      ? 'Tap to log period'
      : daysUntil > 0
      ? `Period in ${daysUntil} days`
      : daysUntil === 0
      ? 'Period expected today'
      : `${Math.abs(daysUntil)} days late`;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} activeOpacity={1}>
        <Animated.View style={[styles.ringWrap, { transform: [{ scale: scaleAnim }] }]}>
          {/* Outer glow */}
          <View style={styles.glowRing} />
          <Svg width={SIZE} height={SIZE}>
            <Defs>
              <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#E8A4C8" />
                <Stop offset="50%" stopColor="#C4627A" />
                <Stop offset="100%" stopColor="#8B2252" />
              </LinearGradient>
            </Defs>
            {/* Track */}
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="#F0ECF4"
              strokeWidth={STROKE}
              fill="none"
            />
            {/* Progress */}
            <AnimatedCircle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="url(#ringGrad)"
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={CIRC}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${SIZE / 2}, ${SIZE / 2}`}
            />
          </Svg>
          {/* Center Content */}
          <View style={styles.centerContent}>
            <Text style={styles.dayNumber}>{day}</Text>
            <Text style={styles.dayLabel}>Day</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* Period Prediction */}
      <View style={styles.predictionRow}>
        <View style={styles.predictionDot} />
        <Text style={styles.predictionText}>{periodText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  ringWrap: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
    width: SIZE - 20,
    height: SIZE - 20,
    borderRadius: (SIZE - 20) / 2,
    backgroundColor: 'transparent',
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    elevation: 0,
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontFamily: fonts.bold,
    fontSize: 58,
    color: colors.primary,
    lineHeight: 62,
    letterSpacing: -2,
  },
  dayLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.subtext,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  predictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  predictionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  predictionText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primary,
  },
});