import InfoImage from '@assets/images/info_image.svg';
import React, { FC } from 'react';
import { View, ViewStyle } from 'react-native';

import { Button, Screen, Text } from '@/components';
import { useAuth } from '@/contexts/authContext';
import { AppStackScreenProps } from '@/navigators';
import type { ThemedStyle } from '@/theme';
import { useAppTheme } from '@/utils/useAppTheme';

interface InfoScreenProps extends AppStackScreenProps<'Info'> {}

export const InfoScreen: FC<InfoScreenProps> = () => {
  const {
    themed,
    theme: { colors },
  } = useAppTheme();
  const { setUserRegistrationInfo, authState, setAuthState } = useAuth();

  const onUserUnderstand = () => {
    setUserRegistrationInfo({
      name: '',
      birth_date: new Date(),
      gender: '',
      email: '',
      password: '',
      c_password: '',
      step: 1,
    });
    setAuthState({
      ...authState,
      authenticated: true,
    });
  };

  return (
    <Screen preset="auto" contentContainerStyle={themed($screenContentContainer)} safeAreaEdges={['top', 'bottom']}>
      <View style={{ flex: 1 }}>
        <InfoImage width={350} height={500} />
        <Text weight="medium" style={{ fontSize: 25, textAlign: 'center', lineHeight: 30 }}>
          You can experience the Brainsugar app with a{' '}
          <Text weight="medium" style={{ fontSize: 25, color: colors.palette.primary500 }}>
            7-day
          </Text>{' '}
          free trial
        </Text>
        <Text
          style={{ fontSize: 14, color: colors.palette.neutral600, textAlign: 'center', lineHeight: 20, marginTop: 10 }}
        >
          After your 7-day free trial ends, you’ll need to choose a subscription to continue using the app.
        </Text>
      </View>
      <Button onPress={onUserUnderstand}>I Understand</Button>
    </Screen>
  );
};

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.lg,
  justifyContent: 'space-between',
  alignItems: 'center',
});
