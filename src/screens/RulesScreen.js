import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function RulesScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>COMO JOGAR</Text>
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.stepNumber}>01</Text>
            <Text style={styles.stepText}>Defina números de jogadores e impostores. Sugere-se o número de rodadas, pelo menos, em impostores + 1.</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.stepNumber}>02</Text>
            <Text style={styles.stepText}>De forma ordenada, cada jogador diz UMA palavra que se aproxime semanticamente da sua palavra-chave. O impostor não sabe a palavra-chave dos outros jogadores.</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.stepNumber}>03</Text>
            <Text style={styles.stepText}>Ao final da rodada, todos votam em um suspeito. O mais votado é eliminado.</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.stepNumber}>04</Text>
            <Text style={styles.stepText}>O eliminado revela com sinceridade se era o impostor ou não.</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.stepNumber}>05</Text>
            <Text style={styles.stepText}>Após a eliminação, havendo mais impostores no jogo, inicia-se nova rodada, em que os jogadores devem dizer novas palavras, com novas votações.</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.stepNumber}>06</Text>
            <Text style={styles.stepText}>Terminando todas rodadas que foram estabelecidas no início, havendo impostores não descobertos, estes vencem.</Text>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>ENTENDI</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { flex: 1, padding: 30, paddingTop: 60 },
  title: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: 2, marginBottom: 30, textAlign: 'center' },
  scrollContent: { paddingBottom: 20 },
  section: { flexDirection: 'row', marginBottom: 25, alignItems: 'flex-start' },
  stepNumber: { fontSize: 20, fontWeight: '900', color: '#fbbf24', marginRight: 15, width: 30 },
  stepText: { fontSize: 16, color: '#94a3b8', flex: 1, lineHeight: 24 },
  button: { backgroundColor: '#fbbf24', width: '100%', height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  buttonText: { color: '#0f172a', fontWeight: '900', fontSize: 16, letterSpacing: 1 }
});