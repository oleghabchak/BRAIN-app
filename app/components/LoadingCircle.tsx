import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg from 'react-native-svg';

import { useAppTheme } from '@/utils/useAppTheme';

import { AnimatedCircle } from './BlurBackground';

export default function LoadingCircle() {
  const {
    theme: { colors },
  } = useAppTheme();

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    rotateLoop.start();

    return () => rotateLoop.stop();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Svg width={50} height={50} viewBox="0 0 100 100">
        <AnimatedCircle
          cx="50"
          cy="50"
          r="40"
          stroke={colors.palette.primary500}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="130 200"
          strokeDashoffset="0"
          fill="none"
        />
      </Svg>
    </Animated.View>
  );
}
