import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { dashboardStyles } from '../../../styles/dashboardStyles';
import { apiClient } from '../../../utils/api';

const QUOTE_STORAGE_KEY = 'daily_motivational_quote';
const QUOTE_DATE_KEY = 'daily_motivational_quote_date';

interface MotivationalQuoteProps {
  onQuoteLoaded?: (quote: string) => void;
  savedQuote?: string;
}

export const MotivationalQuote: React.FC<MotivationalQuoteProps> = ({ 
  onQuoteLoaded,
  savedQuote 
}) => {
  const [quote, setQuote] = useState<string>(savedQuote || '');
  const [loading, setLoading] = useState(!savedQuote);
  const opacity = useSharedValue(savedQuote ? 1 : 0);
  const scale = useSharedValue(savedQuote ? 1 : 0.95);

  useEffect(() => {
    if (!savedQuote) {
      loadDailyQuote();
    } else {
      // If we have a saved quote, animate it in
      opacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
      scale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
    }
  }, []);

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const loadDailyQuote = async () => {
    try {
      setLoading(true);
      
      // Check if we have a saved quote for today
      const storedQuote = await AsyncStorage.getItem(QUOTE_STORAGE_KEY);
      const storedDate = await AsyncStorage.getItem(QUOTE_DATE_KEY);
      const todayDate = getTodayDateString();

      // If we have today's quote saved, use it
      if (storedQuote && storedDate === todayDate) {
        setQuote(storedQuote);
        if (onQuoteLoaded) {
          onQuoteLoaded(storedQuote);
        }
        // Animate in
        opacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
        scale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
        setLoading(false);
        return;
      }

      // Otherwise, fetch new quote for today
      const response = await apiClient.getDailyQuote();
      if (response.success) {
        const newQuote = response.quote;
        setQuote(newQuote);
        
        // Notify parent component
        if (onQuoteLoaded) {
          onQuoteLoaded(newQuote);
        }
        
        // Save quote and date to AsyncStorage
        await AsyncStorage.setItem(QUOTE_STORAGE_KEY, newQuote);
        await AsyncStorage.setItem(QUOTE_DATE_KEY, todayDate);
        
        // Animate in
        opacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
        scale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
      }
    } catch (error) {
      console.error('Error loading daily quote:', error);
      // Try to use saved quote even if API fails
      const fallbackQuote = await AsyncStorage.getItem(QUOTE_STORAGE_KEY);
      if (fallbackQuote) {
        setQuote(fallbackQuote);
        if (onQuoteLoaded) {
          onQuoteLoaded(fallbackQuote);
        }
      } else {
        const defaultQuote = "Every day is a new beginning. Take a deep breath and start again.";
        setQuote(defaultQuote);
        if (onQuoteLoaded) {
          onQuoteLoaded(defaultQuote);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  // Subtle pulse animation
  const pulseOpacity = useSharedValue(1);
  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  if (loading) {
    return (
      <View style={dashboardStyles.motivationalQuoteContainer}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <Animated.View
      style={[dashboardStyles.motivationalQuoteContainer, animatedStyle]}
      entering={FadeIn.duration(600)}
      exiting={FadeOut.duration(300)}
    >
      <Animated.View style={pulseStyle}>
        <Text style={dashboardStyles.motivationalQuoteText}>{quote}</Text>
      </Animated.View>
    </Animated.View>
  );
};

