import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function AwarenessScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📚</Text>
      <Text style={styles.text}>PCOS vs PCOD</Text>
      <Text style={styles.sub}>Coming next...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: { fontSize: 48, marginBottom: 12 },
  text: { color: colors.primary, fontSize: 20, fontWeight: 'bold' },
  sub: { color: colors.subtext, fontSize: 14, marginTop: 6 },
});