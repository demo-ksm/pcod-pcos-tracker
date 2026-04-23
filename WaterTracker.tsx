import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../constants/colors';

interface Props {
  current: number;
  goal: number;
  onAdd: () => void;
}

export default function WaterTracker({ current, goal, onAdd }: Props) {
  const progress = Math.min(current / goal, 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.left}>
          <View style={styles.iconWrap}>
            <Ionicons name="water" size={16} color="#4A90D9" />
          </View>
          <Text style={styles.label}>Water</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.8}>
          <Ionicons name="add" size={16} color={colors.primary} />
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Slim bar */}
      <View style={styles.barWrap}>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.count}>
          <Text style={styles.countCurrent}>{current}</Text>
          <Text style={styles.countTotal}> / {goal}</Text>
        </Text>
      </View>

      {/* Glass indicators */}
      <View style={styles.glasses}>
        {Array.from({ length: goal }).map((_, i) => (
          <View
            key={i}
            style={[styles.glass, i < current && styles.glassFilled]}
          />
        ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EBF3FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.text,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
  },
  addText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.primary,
  },
  barWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.muted,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#4A90D9',
    borderRadius: 3,
  },
  count: {},
  countCurrent: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: '#4A90D9',
  },
  countTotal: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.subtext,
  },
  glasses: {
    flexDirection: 'row',
    gap: 5,
  },
  glass: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.muted,
  },
  glassFilled: {
    backgroundColor: '#4A90D9',
  },
});