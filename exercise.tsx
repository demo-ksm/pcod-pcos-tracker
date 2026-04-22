import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

type Category = 'All' | 'Yoga' | 'Gym' | 'Weightlifting';

const exercises = [
  {
    id: 1,
    name: 'Full Body Stretch',
    category: 'Yoga',
    sets: 3,
    benefit: 'Reduces cortisol and improves flexibility',
    icon: 'body-outline',
    color: '#C4627A',
  },
  {
    id: 2,
    name: 'Surya Namaskar',
    category: 'Yoga',
    sets: 5,
    benefit: 'Balances hormones and boosts metabolism',
    icon: 'sunny-outline',
    color: '#C4627A',
  },
  {
    id: 3,
    name: 'Cat-Cow Flow',
    category: 'Yoga',
    sets: 3,
    benefit: 'Relieves lower back pain and abdominal tension',
    icon: 'leaf-outline',
    color: '#C4627A',
  },
  {
    id: 4,
    name: 'Child\'s Pose',
    category: 'Yoga',
    sets: 3,
    benefit: 'Calms nervous system, reduces anxiety',
    icon: 'moon-outline',
    color: '#C4627A',
  },
  {
    id: 5,
    name: 'Upper Body Strength',
    category: 'Gym',
    sets: 4,
    benefit: 'Improves insulin sensitivity',
    icon: 'fitness-outline',
    color: '#8B2252',
  },
  {
    id: 6,
    name: 'Resistance Band Squats',
    category: 'Gym',
    sets: 4,
    benefit: 'Strengthens lower body, burns visceral fat',
    icon: 'barbell-outline',
    color: '#8B2252',
  },
  {
    id: 7,
    name: 'Core Circuit',
    category: 'Gym',
    sets: 3,
    benefit: 'Reduces belly fat, supports posture',
    icon: 'disc-outline',
    color: '#8B2252',
  },
  {
    id: 8,
    name: 'Deadlift',
    category: 'Weightlifting',
    sets: 5,
    benefit: 'Builds full-body strength, boosts testosterone balance',
    icon: 'barbell-outline',
    color: '#5A3E6B',
  },
  {
    id: 9,
    name: 'Romanian Deadlift',
    category: 'Weightlifting',
    sets: 4,
    benefit: 'Targets hamstrings, improves posture',
    icon: 'trending-up-outline',
    color: '#5A3E6B',
  },
  {
    id: 10,
    name: 'Goblet Squat',
    category: 'Weightlifting',
    sets: 4,
    benefit: 'Lower body strength, metabolic conditioning',
    icon: 'trophy-outline',
    color: '#5A3E6B',
  },
];

const filters: Category[] = ['All', 'Yoga', 'Gym', 'Weightlifting'];

const categoryColors: Record<string, string> = {
  Yoga: '#C4627A',
  Gym: '#8B2252',
  Weightlifting: '#5A3E6B',
};

export default function ExerciseScreen() {
  const [activeFilter, setActiveFilter] = useState<Category>('All');

  const filtered =
    activeFilter === 'All'
      ? exercises
      : exercises.filter((e) => e.category === activeFilter);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Exercise Guide</Text>
        <Text style={styles.subtitle}>PCOS-friendly workouts for every phase</Text>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
        style={styles.filtersScroll}
      >
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              activeFilter === f && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === f && styles.filterTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Exercise Cards */}
      <View style={styles.cardsContainer}>
        {filtered.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            {/* Image Placeholder */}
            <View
              style={[
                styles.imagePlaceholder,
                { backgroundColor: exercise.color + '18' },
              ]}
            >
              <Ionicons
                name={exercise.icon as any}
                size={36}
                color={exercise.color}
              />
            </View>

            {/* Content */}
            <View style={styles.cardContent}>
              <View style={styles.cardTopRow}>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: categoryColors[exercise.category] + '18' },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { color: categoryColors[exercise.category] },
                    ]}
                  >
                    {exercise.category}
                  </Text>
                </View>
                <View style={styles.setsBadge}>
                  <Text style={styles.setsText}>Set: {exercise.sets}</Text>
                </View>
              </View>

              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseBenefit}>{exercise.benefit}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 13, color: colors.subtext, marginTop: 4 },
  filtersScroll: { marginBottom: 20 },
  filtersContent: { paddingHorizontal: 20, gap: 8 },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: { fontSize: 13, fontWeight: '600', color: colors.subtext },
  filterTextActive: { color: '#fff' },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 14,
  },
  exerciseCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  imagePlaceholder: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: { padding: 14 },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  setsBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  setsText: { fontSize: 12, fontWeight: '600', color: colors.text },
  exerciseName: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  exerciseBenefit: { fontSize: 12, color: colors.subtext, lineHeight: 17 },
});