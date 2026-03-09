import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories } from '../data/words';

export default function GameScreen({ route, navigation }) {
  const { players, impostersCount, resetDeck, showImposterWord } = route.params;
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [gameState, setGameState] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    setupGame();
  }, []);

  const setupGame = async () => {
    try {
      let usedWords = [];
      if (!resetDeck) {
        const storedUsed = await AsyncStorage.getItem('@used_words');
        usedWords = storedUsed ? JSON.parse(storedUsed) : [];
      } else {
        await AsyncStorage.removeItem('@used_words');
      }

      const availablePairs = categories.filter(p => !usedWords.includes(p.word));

      if (availablePairs.length === 0) {
        Alert.alert("Aviso", "Todas as palavras foram usadas. O baralho será resetado.");
        await AsyncStorage.removeItem('@used_words');
        navigation.navigate('Home');
        return;
      }

      const pair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
      await AsyncStorage.setItem('@used_words', JSON.stringify([...usedWords, pair.word]));

      let newGameSetup = players.map(name => ({
        name,
        role: 'player',
        word: pair.word
      }));

      const availableIndices = Array.from({ length: players.length }, (_, i) => i);
      for (let i = availableIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
      }

      for (let i = 0; i < impostersCount; i++) {
        const targetIndex = availableIndices[i];
        newGameSetup[targetIndex].role = 'imposter';
        newGameSetup[targetIndex].word = showImposterWord ? pair.imposterWord : "???";
      }

      setGameState(newGameSetup);
    } catch (e) {
      console.error(e);
    }
  };

  const nextPlayer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentPlayerIndex < players.length - 1) {
      setRevealed(false);
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      pan.setValue({ x: 0, y: 0 });
    } else {
      setCurrentPlayerIndex(-1);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gesture) => {
        if (Math.abs(gesture.dx) > 120) {
          setRevealed(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  if (gameState.length === 0) return null;

  if (currentPlayerIndex === -1) {
    return (
      <View style={styles.container}>
        <Text style={styles.wordText}>TODOS JÁ VIRAM!</Text>
        <View style={styles.finalInstructionsCard}>
          <Text style={styles.finalInstructionsText}>
            Agora iniciam-se as rodadas. Quando todas as rodadas terminarem, clique para começar um novo jogo.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => navigation.push('Game', { players, impostersCount, resetDeck: false, showImposterWord })}
        >
          <Text style={styles.nextButtonText}>NOVO JOGO (PALAVRAS INÉDITAS)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.nextButton, { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#fbbf24', marginTop: 15 }]} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={[styles.nextButtonText, { color: '#fbbf24' }]}>NOVO JOGO (RESETAR TUDO)</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.header}>Vez de: {gameState[currentPlayerIndex].name}</Text>
      <View style={styles.cardContainer}>
        {!revealed ? (
          <Animated.View style={[pan.getLayout(), styles.card]} {...panResponder.panHandlers}>
            <Text style={styles.cardText}>Arraste para revelar sua palavra</Text>
          </Animated.View>
        ) : (
          <View style={[styles.card, styles.revealedCard, gameState[currentPlayerIndex].role === 'imposter' && styles.imposterCard]}>
            {gameState[currentPlayerIndex].role === 'imposter' && (
              <Text style={styles.imposterBadge}>VOCÊ É O IMPOSTOR</Text>
            )}
            <Text style={styles.wordText}>{gameState[currentPlayerIndex].word}</Text>
            <TouchableOpacity style={styles.nextButton} onPress={nextPlayer}>
              <Text style={styles.nextButtonText}>OK, JÁ VI!</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
        <Text style={styles.exitText}>Sair</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center', padding: 20 },
  header: { fontSize: 24, color: '#fff', fontWeight: '900', letterSpacing: 1, marginBottom: 40 },
  cardContainer: { width: '100%', height: 400, alignItems: 'center', justifyContent: 'center' },
  card: { width: '90%', height: '100%', backgroundColor: '#1e293b', borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#334155', elevation: 20 },
  revealedCard: { backgroundColor: '#1e293b', borderColor: '#fbbf24', borderWidth: 2 },
  imposterCard: { borderColor: '#ef4444', borderWidth: 3 },
  imposterBadge: { color: '#ef4444', fontWeight: 'bold', fontSize: 14, marginBottom: 15, letterSpacing: 3 },
  cardText: { color: '#94a3b8', fontSize: 18, textAlign: 'center', padding: 40, lineHeight: 28 },
  wordText: { color: '#fff', fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 40 },
  nextButton: { backgroundColor: '#fbbf24', width: '90%', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
  nextButtonText: { color: '#0f172a', fontWeight: '900', fontSize: 14, textAlign: 'center' },
  exitText: { color: '#475569', marginTop: 50, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  finalInstructionsCard: { backgroundColor: '#1e293b', padding: 25, borderRadius: 20, marginBottom: 40, width: '90%', borderWidth: 1, borderColor: '#334155' },
  finalInstructionsText: { color: '#94a3b8', fontSize: 16, textAlign: 'center', lineHeight: 24, fontWeight: '500' }
});