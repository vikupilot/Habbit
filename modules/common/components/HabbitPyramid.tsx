import React, { useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

interface HabbitPyramidProps {
  size?: number;
}

export const HabbitPyramid: React.FC<HabbitPyramidProps> = ({ size = 200 }) => {
  // Create animated values for each letter
  const animations = {
    h1: new Animated.Value(0),
    a1: new Animated.Value(0),
    b1: new Animated.Value(0),
    b2: new Animated.Value(0),
    i: new Animated.Value(0),
    t: new Animated.Value(0),
  };

  useEffect(() => {
    // Stagger animations for each letter
    const timing = 150; // Delay between each letter
    
    Object.values(animations).forEach((anim, index) => {
      Animated.sequence([
        Animated.delay(index * timing),
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.5,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    });
  }, []);

  const AnimatedText = Animated.createAnimatedComponent(Text);

  const letterStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.8, 1, 1.2],
        }),
      },
    ],
  });

  return (
    <View style={[styles.container, { height: size }]}>
      {/* Row 1 - H */}
      <View style={styles.row1}>
        <Animated.Text
          style={[
            styles.letter,
            styles.letterLarge,
            letterStyle(animations.h1),
          ]}
        >
          H
        </Animated.Text>
      </View>

      {/* Row 2 - A B */}
      <View style={styles.row2}>
        <Animated.Text
          style={[
            styles.letter,
            styles.letterMedium,
            letterStyle(animations.a1),
          ]}
        >
          A
        </Animated.Text>
        <Animated.Text
          style={[
            styles.letter,
            styles.letterMedium,
            letterStyle(animations.b1),
          ]}
        >
          B
        </Animated.Text>
      </View>

      {/* Row 3 - B I T */}
      <View style={styles.row3}>
        <Animated.Text
          style={[
            styles.letter,
            styles.letterSmall,
            letterStyle(animations.b2),
          ]}
        >
          B
        </Animated.Text>
        <Animated.Text
          style={[
            styles.letter,
            styles.letterSmall,
            letterStyle(animations.i),
          ]}
        >
          I
        </Animated.Text>
        <Animated.Text
          style={[
            styles.letter,
            styles.letterSmall,
            letterStyle(animations.t),
          ]}
        >
          T
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  row1: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  row3: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  letter: {
    fontWeight: '800',
    color: '#000000',
  },
  letterLarge: {
    fontSize: 72,
  },
  letterMedium: {
    fontSize: 56,
  },
  letterSmall: {
    fontSize: 40,
  },
});
