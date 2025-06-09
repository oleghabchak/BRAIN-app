import { BlurView } from '@react-native-community/blur';
import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useAppTheme } from '@/utils/useAppTheme';

export const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function BlurBackground({ children }: { children: React.ReactNode }) {
  const {
    theme: { colors },
  } = useAppTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[{ ...$loadingScreenContainer, opacity: fadeAnim }]}>
      <AnimatedBlurView
        style={$blurView}
        blurType="light"
        blurAmount={2}
        reducedTransparencyFallbackColor={colors.palette.primary500}
      />
      {children}
    </Animated.View>
  );
}

const $loadingScreenContainer: ViewStyle = {
  position: 'absolute',
  zIndex: 1,
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
};

const $blurView: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundColor: 'rgba(88, 92, 229, 0.2)',
};
