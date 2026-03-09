import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Animated, Linking, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen({ navigation }) {
  const [numPlayers, setNumPlayers] = useState('4');
  const [numImpostors, setNumImpostors] = useState('1');
  const [isImposterWordEnabled, setIsImposterWordEnabled] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true })
    ]).start();

    const loadSettings = async () => {
      try {
        const savedPlayers = await AsyncStorage.getItem('@num_players');
        const savedImpostors = await AsyncStorage.getItem('@num_impostors');
        const savedWordOption = await AsyncStorage.getItem('@imposter_word_enabled');
        
        if (savedPlayers !== null) setNumPlayers(savedPlayers);
        if (savedImpostors !== null) setNumImpostors(savedImpostors);
        if (savedWordOption !== null) setIsImposterWordEnabled(JSON.parse(savedWordOption));
      } catch (e) {
        console.error(e);
      }
    };
    loadSettings();
  }, []);

  const startGame = async () => {
    const pCount = parseInt(numPlayers);
    const iCount = parseInt(numImpostors);
    if (isNaN(pCount) || iCount >= pCount || iCount < 1) {
      alert("Configuração inválida!");
      return;
    }
    try {
      await AsyncStorage.setItem('@num_players', numPlayers);
      await AsyncStorage.setItem('@num_impostors', numImpostors);
      await AsyncStorage.setItem('@imposter_word_enabled', JSON.stringify(isImposterWordEnabled));
    } catch (e) {
      console.error(e);
    }
    const playersArray = Array.from({ length: pCount }, (_, i) => `Jogador ${i + 1}`);
    navigation.navigate('Game', { 
      players: playersArray, 
      impostersCount: iCount, 
      resetDeck: true, 
      showImposterWord: isImposterWordEnabled 
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar style="light" />
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.logoContainer}>
          <Text style={styles.titleSmall}>JOGO DO</Text>
          <Text style={styles.titleMain}>IMPOSTOR</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://github.com/luizgustavolab')}>
            <Text style={styles.developerText}>Desenvolvido por luizgustavolab</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>JOGADORES</Text>
            <TextInput 
              style={styles.input}
              keyboardType="numeric"
              value={numPlayers}
              onChangeText={setNumPlayers}
              selectionColor="#fbbf24"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.inputGroup}>
            <Text style={styles.label}>IMPOSTORES</Text>
            <TextInput 
              style={styles.input}
              keyboardType="numeric"
              value={numImpostors}
              onChangeText={setNumImpostors}
              selectionColor="#fbbf24"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.inputGroup}>
            <Text style={styles.label}>DICA PARA IMPOSTOR</Text>
            <Switch
              trackColor={{ false: '#334155', true: '#fbbf24' }}
              thumbColor={isImposterWordEnabled ? '#fff' : '#94a3b8'}
              onValueChange={() => setIsImposterWordEnabled(previousState => !previousState)}
              value={isImposterWordEnabled}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={startGame} activeOpacity={0.8}>
          <Text style={styles.buttonText}>INICIAR PARTIDA</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.rulesButton} 
          onPress={() => navigation.navigate('Regras')}
          activeOpacity={0.6}
        >
          <Text style={styles.rulesButtonText}>REGRAS DO JOGO</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  logoContainer: { marginBottom: 40, alignItems: 'center' },
  titleSmall: { fontSize: 24, fontWeight: '700', color: '#94a3b8', letterSpacing: 2, textTransform: 'uppercase' },
  titleMain: { fontSize: 48, fontWeight: '900', color: '#fff', letterSpacing: 4, marginTop: -5 },
  developerText: { color: '#fbbf24', fontSize: 12, fontWeight: 'bold', marginTop: 10, textDecorationLine: 'underline' },
  card: { backgroundColor: '#1e293b', width: '100%', borderRadius: 24, padding: 25, elevation: 10 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  label: { color: '#94a3b8', fontSize: 13, fontWeight: 'bold', letterSpacing: 1 },
  input: { color: '#fbbf24', fontSize: 24, fontWeight: 'bold', textAlign: 'right', width: 80 },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 5 },
  button: { backgroundColor: '#fbbf24', width: '100%', height: 65, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  buttonText: { color: '#0f172a', fontWeight: '900', fontSize: 18, letterSpacing: 1 },
  rulesButton: { marginTop: 20, padding: 10 },
  rulesButtonText: { color: '#475569', fontWeight: 'bold', fontSize: 14, letterSpacing: 2 }
});