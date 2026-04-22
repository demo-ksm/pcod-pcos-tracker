import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

type Profile = {
  name: string;
  age: string;
  height: string;
  weight: string;
  cycleLength: string;
  periodLength: string;
  activityLevel: string;
};

const DEFAULT_PROFILE: Profile = {
  name: '',
  age: '',
  height: '',
  weight: '',
  cycleLength: '28',
  periodLength: '5',
  activityLevel: 'Moderate',
};

const ACTIVITY_LEVELS = ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'];

const profileFields: { key: keyof Profile; label: string; unit?: string; icon: string }[] = [
  { key: 'name', label: 'Name', icon: 'person-outline' },
  { key: 'age', label: 'Age', unit: 'years', icon: 'calendar-outline' },
  { key: 'height', label: 'Height', unit: 'cm', icon: 'resize-outline' },
  { key: 'weight', label: 'Weight', unit: 'kg', icon: 'scale-outline' },
  { key: 'cycleLength', label: 'Cycle Length', unit: 'days', icon: 'sync-outline' },
  { key: 'periodLength', label: 'Period Length', unit: 'days', icon: 'time-outline' },
  { key: 'activityLevel', label: 'Activity Level', icon: 'walk-outline' },
];

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [editVisible, setEditVisible] = useState(false);
  const [editData, setEditData] = useState<Profile>(DEFAULT_PROFILE);
  const [activityDropdown, setActivityDropdown] = useState(false);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem('userProfile');
      if (saved) setProfile(JSON.parse(saved));
    } catch (e) {}
  };

  const openEdit = () => {
    setEditData({ ...profile });
    setEditVisible(true);
  };

  const saveProfile = async () => {
    if (!editData.name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(editData));
      setProfile({ ...editData });
      setEditVisible(false);
      Alert.alert('Saved', 'Your profile has been updated');
    } catch (e) {}
  };

  const getBMI = () => {
    const h = parseFloat(profile.height) / 100;
    const w = parseFloat(profile.weight);
    if (!h || !w) return null;
    const bmi = (w / (h * h)).toFixed(1);
    let label = '';
    const val = parseFloat(bmi);
    if (val < 18.5) label = 'Underweight';
    else if (val < 25) label = 'Normal';
    else if (val < 30) label = 'Overweight';
    else label = 'Obese';
    return { bmi, label };
  };

  const bmiData = getBMI();
  const isProfileEmpty = !profile.name;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.editHeaderBtn} onPress={openEdit}>
          <Ionicons name="create-outline" size={18} color={colors.primary} />
          <Text style={styles.editHeaderText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={colors.primary} />
        </View>
        <Text style={styles.profileName}>
          {profile.name || 'Your Name'}
        </Text>
        {profile.age ? (
          <Text style={styles.profileAge}>{profile.age} years old</Text>
        ) : null}
      </View>

      {/* BMI Card */}
      {bmiData && (
        <View style={styles.bmiCard}>
          <View style={styles.bmiRow}>
            <View>
              <Text style={styles.bmiLabel}>BMI</Text>
              <Text style={styles.bmiValue}>{bmiData.bmi}</Text>
            </View>
            <View style={styles.bmiDivider} />
            <View>
              <Text style={styles.bmiLabel}>Category</Text>
              <Text style={styles.bmiCategory}>{bmiData.label}</Text>
            </View>
            <View style={styles.bmiDivider} />
            <View>
              <Text style={styles.bmiLabel}>Weight</Text>
              <Text style={styles.bmiValue}>{profile.weight} kg</Text>
            </View>
          </View>
        </View>
      )}

      {/* Info Cards */}
      {isProfileEmpty ? (
        <View style={styles.emptyCard}>
          <Ionicons name="person-add-outline" size={32} color={colors.border} />
          <Text style={styles.emptyTitle}>Set up your profile</Text>
          <Text style={styles.emptySub}>
            Add your details to get personalised recommendations
          </Text>
          <TouchableOpacity style={styles.setupButton} onPress={openEdit}>
            <Text style={styles.setupButtonText}>Set Up Profile</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Health Details</Text>
          {profileFields.map((field) => (
            profile[field.key] ? (
              <View key={field.key} style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <Ionicons name={field.icon as any} size={18} color={colors.primary} />
                </View>
                <Text style={styles.infoLabel}>{field.label}</Text>
                <Text style={styles.infoValue}>
                  {profile[field.key]}
                  {field.unit ? ` ${field.unit}` : ''}
                </Text>
              </View>
            ) : null
          ))}
        </View>
      )}

      {/* Edit Modal */}
      <Modal
        visible={editVisible}
        animationType="slide"
        onRequestClose={() => setEditVisible(false)}
      >
        <ScrollView style={styles.modalContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={saveProfile}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            {profileFields.map((field) => (
              field.key === 'activityLevel' ? (
                <View key={field.key} style={styles.formField}>
                  <Text style={styles.formLabel}>{field.label}</Text>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setActivityDropdown(!activityDropdown)}
                  >
                    <Text style={styles.dropdownValue}>{editData.activityLevel}</Text>
                    <Ionicons
                      name={activityDropdown ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={colors.subtext}
                    />
                  </TouchableOpacity>
                  {activityDropdown && (
                    <View style={styles.dropdownMenu}>
                      {ACTIVITY_LEVELS.map((level) => (
                        <TouchableOpacity
                          key={level}
                          style={[
                            styles.dropdownItem,
                            editData.activityLevel === level && styles.dropdownItemActive,
                          ]}
                          onPress={() => {
                            setEditData((prev) => ({ ...prev, activityLevel: level }));
                            setActivityDropdown(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.dropdownItemText,
                              editData.activityLevel === level && styles.dropdownItemTextActive,
                            ]}
                          >
                            {level}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                <View key={field.key} style={styles.formField}>
                  <Text style={styles.formLabel}>
                    {field.label}{field.unit ? ` (${field.unit})` : ''}
                  </Text>
                  <TextInput
                    style={styles.formInput}
                    value={editData[field.key]}
                    onChangeText={(val) =>
                      setEditData((prev) => ({ ...prev, [field.key]: val }))
                    }
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    placeholderTextColor={colors.subtext}
                    keyboardType={
                      ['age', 'height', 'weight', 'cycleLength', 'periodLength'].includes(field.key)
                        ? 'numeric'
                        : 'default'
                    }
                  />
                </View>
              )
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </Modal>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  editHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editHeaderText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: colors.card,
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  profileName: { fontSize: 20, fontWeight: '700', color: colors.text },
  profileAge: { fontSize: 13, color: colors.subtext, marginTop: 4 },
  bmiCard: {
    marginHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  bmiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bmiLabel: { fontSize: 11, color: '#FFD6E8', textAlign: 'center', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  bmiValue: { fontSize: 20, fontWeight: '700', color: '#fff', textAlign: 'center' },
  bmiCategory: { fontSize: 15, fontWeight: '600', color: '#fff', textAlign: 'center' },
  bmiDivider: { width: 1, height: 40, backgroundColor: '#fff3' },
  infoSection: { marginHorizontal: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.subtext,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  infoRow: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: { flex: 1, fontSize: 14, color: colors.subtext, fontWeight: '500' },
  infoValue: { fontSize: 14, fontWeight: '700', color: colors.text },
  emptyCard: {
    marginHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  emptySub: { fontSize: 13, color: colors.subtext, textAlign: 'center', lineHeight: 19 },
  setupButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  setupButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  modalContainer: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 54,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  modalSave: { fontSize: 15, fontWeight: '700', color: colors.primary },
  formSection: { padding: 20, gap: 16 },
  formField: {},
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.subtext,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownValue: { fontSize: 15, color: colors.text, fontWeight: '500' },
  dropdownMenu: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemActive: { backgroundColor: colors.primary + '12' },
  dropdownItemText: { fontSize: 14, color: colors.text },
  dropdownItemTextActive: { color: colors.primary, fontWeight: '700' },
});