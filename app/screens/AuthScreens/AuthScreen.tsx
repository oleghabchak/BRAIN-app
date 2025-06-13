import GreenBrainImage from '@assets/images/brainsugar-green.svg';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useEffect, useRef } from 'react';
import { Animated, TextStyle, View, ViewStyle } from 'react-native';

import { Button, Screen, Text } from '@/components';
import { AuthStackParamList } from '@/navigators/AuthNavigator';
import type { ThemedStyle } from '@/theme';
import { useAppTheme } from '@/utils/useAppTheme';

export type AuthScreenProps = NativeStackScreenProps<AuthStackParamList, 'Auth'>;

export const AuthScreen: FC<AuthScreenProps> = () => {
  const { themed } = useAppTheme();
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Screen preset="auto" contentContainerStyle={themed($screenContentContainer)} safeAreaEdges={['top', 'bottom']}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <View style={themed($centerContent)}>
          <GreenBrainImage width={100} height={100} />
          <Text weight="medium" style={themed($authTitle)}>
            Welcome to Brainsugar
          </Text>
          <Text style={themed($authDescription)}>
            This space is designed to help you understand{'\n'}your anger, manage it in healthy ways, and{'\n'}build
            emotional balance over time.
          </Text>
        </View>

        <View style={themed($buttonContainer)}>
          <Button onPress={() => navigation.navigate('SignUp')}>Sign up</Button>
          <Button preset="outline" onPress={() => navigation.navigate('Login')}>
            Log in
          </Button>
        </View>
      </Animated.View>
    </Screen>
  );
};

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  flex: 1,
  justifyContent: 'space-between',
});

const $centerContent: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  rowGap: 10,
});

const $buttonContainer: ThemedStyle<ViewStyle> = () => ({
  width: '100%',
  rowGap: 10,
});

const $authTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 24,
  lineHeight: 40,
});

const $authDescription: ThemedStyle<TextStyle> = ({ colors }) => ({
  textAlign: 'center',
  color: colors.palette.neutral600,
  fontSize: 15,
  lineHeight: 25,
});
