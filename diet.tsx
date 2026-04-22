import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../../constants/colors';

type Phase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
type MealTab = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

const phases = [
  { key: 'menstrual' as Phase, label: 'Menstrual', days: 'Day 1–5', color: '#C4627A', bg: '#FDF0F3' },
  { key: 'follicular' as Phase, label: 'Follicular', days: 'Day 6–13', color: '#5A8A6A', bg: '#EDF6F0' },
  { key: 'ovulatory' as Phase, label: 'Ovulatory', days: 'Day 14–16', color: '#C4862A', bg: '#FEF6EC' },
  { key: 'luteal' as Phase, label: 'Luteal', days: 'Day 17–28', color: '#7B4E8A', bg: '#F4EEF8' },
];

type FoodItem = { name: string; benefit: string; icon: string };
type MealPlan = { Breakfast: FoodItem[]; Lunch: FoodItem[]; Dinner: FoodItem[]; Snacks: FoodItem[] };

const dietData: Record<Phase, {
  focus: string;
  avoid: string[];
  tip: string;
  nutrients: string[];
  meals: MealPlan;
}> = {
  menstrual: {
    focus: 'Iron & anti-inflammatory foods to replenish energy and ease cramps',
    avoid: ['Excess salt', 'Caffeine', 'Refined sugar', 'Alcohol'],
    tip: 'Warm ginger-lemon water in the morning reduces bloating and cramps significantly.',
    nutrients: ['Iron', 'Magnesium', 'Omega-3', 'Vitamin C'],
    meals: {
      Breakfast: [
        { name: 'Moong Dal Chilla', benefit: 'High protein, replenishes lost iron', icon: 'sunny-outline' },
        { name: 'Ragi Porridge', benefit: 'Calcium-rich, reduces cramping', icon: 'leaf-outline' },
        { name: 'Spinach Paratha', benefit: 'Iron + folate for blood replenishment', icon: 'nutrition-outline' },
      ],
      Lunch: [
        { name: 'Masoor Dal + Brown Rice', benefit: 'Plant iron + complex carbs for energy', icon: 'restaurant-outline' },
        { name: 'Palak Paneer', benefit: 'Iron + calcium, anti-inflammatory', icon: 'leaf-outline' },
        { name: 'Rajma Chawal', benefit: 'Protein + iron, keeps energy stable', icon: 'layers-outline' },
      ],
      Dinner: [
        { name: 'Khichdi with Ghee', benefit: 'Easy to digest, gut-calming', icon: 'moon-outline' },
        { name: 'Vegetable Soup', benefit: 'Hydrating, anti-inflammatory', icon: 'water-outline' },
        { name: 'Bajra Roti + Dal', benefit: 'Magnesium-rich, reduces cramps', icon: 'restaurant-outline' },
      ],
      Snacks: [
        { name: 'Dark Chocolate + Almonds', benefit: 'Magnesium reduces cramps and cravings', icon: 'heart-outline' },
        { name: 'Banana', benefit: 'Potassium reduces bloating', icon: 'nutrition-outline' },
        { name: 'Sesame Chikki', benefit: 'Iron + calcium in natural form', icon: 'star-outline' },
      ],
    },
  },
  follicular: {
    focus: 'Light energising foods to support rising estrogen and boost metabolism',
    avoid: ['Processed foods', 'Deep fried items', 'Refined sugar', 'Heavy dairy'],
    tip: 'This is your peak energy phase. Eat lighter, more frequent meals to sustain energy.',
    nutrients: ['Protein', 'Vitamin E', 'B Vitamins', 'Zinc'],
    meals: {
      Breakfast: [
        { name: 'Vegetable Poha', benefit: 'Light, iron-rich, easy to digest', icon: 'leaf-outline' },
        { name: 'Oats Upma', benefit: 'Fibre-rich, reduces insulin resistance', icon: 'nutrition-outline' },
        { name: 'Egg Bhurji + Toast', benefit: 'Protein + choline for hormone support', icon: 'sunny-outline' },
      ],
      Lunch: [
        { name: 'Quinoa Vegetable Bowl', benefit: 'Complete protein, sustained energy', icon: 'restaurant-outline' },
        { name: 'Chana Salad', benefit: 'High fibre + protein, detoxes excess hormones', icon: 'layers-outline' },
        { name: 'Methi Dal + Jowar Roti', benefit: 'Fenugreek regulates blood sugar', icon: 'leaf-outline' },
      ],
      Dinner: [
        { name: 'Grilled Paneer + Salad', benefit: 'Protein + fibre, light on digestion', icon: 'moon-outline' },
        { name: 'Moong Dal Soup', benefit: 'Light protein, gut-friendly', icon: 'water-outline' },
        { name: 'Vegetable Stir Fry + Brown Rice', benefit: 'Antioxidants + complex carbs', icon: 'restaurant-outline' },
      ],
      Snacks: [
        { name: 'Roasted Chana', benefit: 'High protein, controls hunger', icon: 'ellipse-outline' },
        { name: 'Apple + Almond Butter', benefit: 'Fibre + healthy fats, balances sugar', icon: 'nutrition-outline' },
        { name: 'Cucumber Hummus', benefit: 'Low calorie, fibre-rich', icon: 'leaf-outline' },
      ],
    },
  },
  ovulatory: {
    focus: 'Antioxidant-rich foods to support ovulation and sustain peak performance',
    avoid: ['Trans fats', 'Excess red meat', 'High sugar foods', 'Alcohol'],
    tip: 'You are at peak energy — fuel yourself well with antioxidants and light protein.',
    nutrients: ['Antioxidants', 'Vitamin C', 'Omega-3', 'Lycopene'],
    meals: {
      Breakfast: [
        { name: 'Mixed Fruit Smoothie Bowl', benefit: 'Antioxidants for egg quality', icon: 'sunny-outline' },
        { name: 'Besan Chilla + Tomato Chutney', benefit: 'Protein + lycopene support', icon: 'nutrition-outline' },
        { name: 'Ragi Dosa', benefit: 'Calcium + complex carbs for peak energy', icon: 'restaurant-outline' },
      ],
      Lunch: [
        { name: 'Colourful Vegetable Pulao', benefit: 'Antioxidants from mixed vegetables', icon: 'restaurant-outline' },
        { name: 'Grilled Fish + Salad', benefit: 'Omega-3 supports ovulation', icon: 'leaf-outline' },
        { name: 'Pav Bhaji (less butter)', benefit: 'Mixed vegetables, vitamin-rich', icon: 'layers-outline' },
      ],
      Dinner: [
        { name: 'Tofu Stir Fry', benefit: 'Plant phytoestrogens, hormone balance', icon: 'moon-outline' },
        { name: 'Mixed Dal + Jowar Roti', benefit: 'Complete amino acids + fibre', icon: 'restaurant-outline' },
        { name: 'Broccoli Sabzi + Brown Rice', benefit: 'Detoxes excess estrogen', icon: 'nutrition-outline' },
      ],
      Snacks: [
        { name: 'Walnuts + Grapes', benefit: 'Omega-3 + resveratrol combo', icon: 'diamond-outline' },
        { name: 'Makhana', benefit: 'Low GI, anti-ageing, hormone support', icon: 'star-outline' },
        { name: 'Carrot + Hummus', benefit: 'Beta-carotene supports ovulation', icon: 'leaf-outline' },
      ],
    },
  },
  luteal: {
    focus: 'Magnesium & B6-rich foods to reduce PMS, mood swings and cravings',
    avoid: ['Caffeine (anxiety)', 'Excess salt (bloating)', 'Sugar spikes', 'Alcohol (mood crash)'],
    tip: 'Slow down this phase. Prefer yoga and walks over intense workouts. Rest is productive.',
    nutrients: ['Magnesium', 'Vitamin B6', 'Zinc', 'Fibre'],
    meals: {
      Breakfast: [
        { name: 'Oatmeal + Banana + Seeds', benefit: 'Magnesium + B6 stabilises mood', icon: 'sunny-outline' },
        { name: 'Sabudana Khichdi', benefit: 'Easy carbs reduce fatigue', icon: 'nutrition-outline' },
        { name: 'Sweet Potato Paratha', benefit: 'Complex carbs regulate mood swings', icon: 'restaurant-outline' },
      ],
      Lunch: [
        { name: 'Pumpkin Dal + Brown Rice', benefit: 'Zinc + magnesium reduce PMS', icon: 'restaurant-outline' },
        { name: 'Sweet Potato Sabzi + Roti', benefit: 'Stabilises blood sugar, reduces cravings', icon: 'layers-outline' },
        { name: 'Lauki Dal + Jowar Roti', benefit: 'Light, cooling, reduces bloating', icon: 'leaf-outline' },
      ],
      Dinner: [
        { name: 'Khichdi + Ghee', benefit: 'Gut-soothing, easy on digestion', icon: 'moon-outline' },
        { name: 'Lentil Soup + Sesame Roti', benefit: 'Progesterone-supporting minerals', icon: 'water-outline' },
        { name: 'Mixed Sabzi + Bajra Roti', benefit: 'Magnesium-rich, improves sleep', icon: 'restaurant-outline' },
      ],
      Snacks: [
        { name: 'Dark Chocolate + Almonds', benefit: 'Magnesium fights cravings + anxiety', icon: 'heart-outline' },
        { name: 'Pumpkin Seeds', benefit: 'Zinc + magnesium reduce PMS severity', icon: 'star-outline' },
        { name: 'Chamomile Tea', benefit: 'Calms anxiety, improves sleep quality', icon: 'leaf-outline' },
      ],
    },
  },
};

export default function DietScreen() {
  const [selectedPhase, setSelectedPhase] = useState<Phase>('follicular');
  const [activeTab, setActiveTab] = useState<MealTab>('Breakfast');

  const phase = phases.find((p) => p.key === selectedPhase)!;
  const diet = dietData[selectedPhase];
  const meals = diet.meals[activeTab];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Diet Planner</Text>
        <Text style={styles.subtitle}>Cycle-synced Indian meal guide</Text>
      </View>

      {/* Phase Selector */}
      <Text style={styles.sectionLabel}>Select Your Phase</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.phasesScroll}
      >
        {phases.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[
              styles.phaseChip,
              selectedPhase === p.key && {
                backgroundColor: p.color,
                borderColor: p.color,
              },
            ]}
            onPress={() => setSelectedPhase(p.key)}
          >
            <Text
              style={[
                styles.phaseChipLabel,
                selectedPhase === p.key && { color: '#fff' },
              ]}
            >
              {p.label}
            </Text>
            <Text
              style={[
                styles.phaseChipDays,
                selectedPhase === p.key && { color: '#fff9' },
              ]}
            >
              {p.days}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Focus Card */}
      <View style={[styles.focusCard, { backgroundColor: phase.bg }]}>
        <View style={[styles.focusBadge, { backgroundColor: phase.color }]}>
          <Text style={styles.focusBadgeText}>Phase Focus</Text>
        </View>
        <Text style={[styles.focusText, { color: phase.color }]}>{diet.focus}</Text>
        <View style={styles.nutrientsRow}>
          {diet.nutrients.map((n) => (
            <View key={n} style={[styles.nutrientChip, { borderColor: phase.color + '40' }]}>
              <Text style={[styles.nutrientText, { color: phase.color }]}>{n}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Meal Tabs */}
      <View style={styles.mealTabs}>
        {(['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as MealTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.mealTab, activeTab === tab && { backgroundColor: phase.color }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.mealTabText,
                activeTab === tab && { color: '#fff' },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Food Cards */}
      <View style={styles.foodList}>
        {meals.map((food, idx) => (
          <View key={idx} style={styles.foodCard}>
            <View style={[styles.foodIconWrap, { backgroundColor: phase.bg }]}>
              <Ionicons name={food.icon as any} size={22} color={phase.color} />
            </View>
            <View style={styles.foodContent}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodBenefit}>{food.benefit}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Avoid Section */}
      <View style={styles.avoidCard}>
        <Text style={styles.avoidTitle}>Avoid This Phase</Text>
        <View style={styles.avoidList}>
          {diet.avoid.map((item, idx) => (
            <View key={idx} style={styles.avoidItem}>
              <Ionicons name="close-circle" size={14} color="#C4627A" />
              <Text style={styles.avoidText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Tip */}
      <View style={[styles.tipCard, { borderLeftColor: phase.color }]}>
        <Ionicons name="bulb-outline" size={16} color={phase.color} />
        <Text style={styles.tipText}>{diet.tip}</Text>
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
    paddingBottom: 8,
  },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.subtext, marginTop: 3 },
  sectionLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.subtext,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  phasesScroll: { paddingHorizontal: 20, gap: 10, marginBottom: 16 },
  phaseChip: {
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    minWidth: 110,
  },
  phaseChipLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.text,
  },
  phaseChipDays: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.subtext,
    marginTop: 2,
  },
  focusCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 10,
  },
  focusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  focusBadgeText: { fontFamily: fonts.semiBold, fontSize: 11, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5 },
  focusText: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 20 },
  nutrientsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  nutrientChip: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  nutrientText: { fontFamily: fonts.semiBold, fontSize: 11 },
  mealTabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mealTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 9,
  },
  mealTabText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.subtext,
  },
  foodList: { paddingHorizontal: 20, gap: 10, marginBottom: 16 },
  foodCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  foodIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodContent: { flex: 1 },
  foodName: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.text },
  foodBenefit: { fontFamily: fonts.regular, fontSize: 12, color: colors.subtext, marginTop: 2, lineHeight: 17 },
  avoidCard: {
    marginHorizontal: 20,
    backgroundColor: '#FEF6F7',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F2D0D5',
  },
  avoidTitle: { fontFamily: fonts.semiBold, fontSize: 13, color: '#C4627A', marginBottom: 10 },
  avoidList: { gap: 6 },
  avoidItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avoidText: { fontFamily: fonts.regular, fontSize: 13, color: '#8B4452' },
  tipCard: {
    marginHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  tipText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.subtext, lineHeight: 20 },
});