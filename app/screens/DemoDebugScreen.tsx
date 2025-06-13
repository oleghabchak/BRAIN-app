import * as Application from 'expo-application';
import { FC, useCallback, useMemo } from 'react';
import { LayoutAnimation, Linking, Platform, TextStyle, useColorScheme, View, ViewStyle } from 'react-native';

import { Button, ListItem, Screen, Text } from '@/components';
import { isRTL } from '@/i18n';
import { useStores } from '@/models';
import { DemoTabScreenProps } from '@/navigators/DemoNavigator';
import type { ThemedStyle } from '@/theme';
import { $styles } from '@/theme';
import { useAppTheme } from '@/utils/useAppTheme';

/**
 * @param {string} url - The URL to open in the browser.
 * @returns {void} - No return value.
 */
function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));
}

const usingHermes = typeof HermesInternal === 'object' && HermesInternal !== null;

export const DemoDebugScreen: FC<DemoTabScreenProps<'DemoDebug'>> = function DemoDebugScreen(_props) {
  const { setThemeContextOverride, themeContext, themed } = useAppTheme();
  const {
    authenticationStore: { logout },
  } = useStores();

  // @ts-expect-error
  const usingFabric = global.nativeFabricUIManager != null;

  const demoReactotron = useMemo(
    () => async () => {
      if (__DEV__) {
        console.tron.display({
          name: 'DISPLAY',
          value: {
            appId: Application.applicationId,
            appName: Application.applicationName,
            appVersion: Application.nativeApplicationVersion,
            appBuildVersion: Application.nativeBuildVersion,
            hermesEnabled: usingHermes,
          },
          important: true,
        });
      }
    },
    []
  );

  const toggleTheme = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate the transition
    setThemeContextOverride(themeContext === 'dark' ? 'light' : 'dark');
  }, [themeContext, setThemeContextOverride]);

  // Resets the theme to the system theme
  const colorScheme = useColorScheme();
  const resetTheme = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setThemeContextOverride(undefined);
  }, [setThemeContextOverride]);

  return (
    <Screen preset="scroll" safeAreaEdges={['top']} contentContainerStyle={[$styles.container, themed($container)]}>
      <Text preset="heading" tx="Account Screen" style={themed($title)} />
    </Screen>
  );
};

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xxl,
});

const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxl,
});

const $reportBugsLink: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.tint,
  marginBottom: spacing.lg,
  alignSelf: isRTL ? 'flex-start' : 'flex-end',
});

const $item: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
});

const $itemsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginVertical: spacing.xl,
});

const $button: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
});

const $buttonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
});

const $hint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.palette.neutral600,
  fontSize: 12,
  lineHeight: 15,
  paddingBottom: spacing.lg,
});

// @demo remove-file
