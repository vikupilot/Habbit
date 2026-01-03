import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';

export const AnimatedLogo: React.FC = () => {
  // Animation values
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const pulse = useSharedValue(1);

  useEffect(() => {
    // Continuous rotation animation
    rotate.value = withRepeat(
      withTiming(360, {
        duration: 4000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Initial scale up animation
    scale.value = withSpring(1, { damping: 8, stiffness: 50 });

    // Continuous pulse animation
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  // Outer ring animation - rotates continuously
  const outerRingStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ] as any,
  }));

  // Inner circle animation - rotates opposite direction
  const innerCircleStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${-rotate.value * 0.6}deg` },
      { scale: scale.value * 0.85 },
    ] as any,
  }));

  // Center dot animation - pulses
  const centerDotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value * scale.value * 0.7 }] as any,
  }));

  // Three habit dots around the circle
  const dot1Style = useAnimatedStyle(() => {
    const angle = (rotate.value * Math.PI) / 180;
    const radius = 65;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return {
      transform: [
        { translateX: x * scale.value },
        { translateY: y * scale.value },
        { scale: pulse.value },
      ] as any,
    };
  });

  const dot2Style = useAnimatedStyle(() => {
    const angle = ((rotate.value + 120) * Math.PI) / 180;
    const radius = 65;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return {
      transform: [
        { translateX: x * scale.value },
        { translateY: y * scale.value },
        { scale: pulse.value },
      ] as any,
    };
  });

  const dot3Style = useAnimatedStyle(() => {
    const angle = ((rotate.value + 240) * Math.PI) / 180;
    const radius = 65;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return {
      transform: [
        { translateX: x * scale.value },
        { translateY: y * scale.value },
        { scale: pulse.value },
      ] as any,
    };
  });

  return (
    <View style={styles.container}>
      {/* Outer Ring - Rotating circle */}
      <Animated.View style={[styles.outerRing, outerRingStyle]}>
        <View style={styles.ringBorder} />
      </Animated.View>

      {/* Inner Circle - Counter-rotating */}
      <Animated.View style={[styles.innerCircle, innerCircleStyle]}>
        <View style={styles.innerCircleBorder} />
      </Animated.View>

      {/* Three habit dots orbiting around */}
      <Animated.View style={[styles.dot, styles.dot1, dot1Style]} />
      <Animated.View style={[styles.dot, styles.dot2, dot2Style]} />
      <Animated.View style={[styles.dot, styles.dot3, dot3Style]} />

      {/* Center dot - Pulsing */}
      <Animated.View style={[styles.centerDot, centerDotStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outerRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringBorder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: '#000000',
  },
  innerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircleBorder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#000000',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#000000',
    position: 'absolute',
  },
  dot1: {
    top: '50%',
    left: '50%',
    marginLeft: -7,
    marginTop: -7,
  },
  dot2: {
    top: '50%',
    left: '50%',
    marginLeft: -7,
    marginTop: -7,
  },
  dot3: {
    top: '50%',
    left: '50%',
    marginLeft: -7,
    marginTop: -7,
  },
  centerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000000',
    position: 'absolute',
  },
});
