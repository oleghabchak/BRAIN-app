import { BottomTabScreenProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { TextStyle, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import  HomeIcon  from '../../assets/icons/home.svg';
import  LearnIcon  from '../../assets/icons/learn.svg';
import  GuideIcon  from '../../assets/icons/play.svg';
import  AccountIcon  from '../../assets/icons/user.svg';

import { Icon } from '@/components';
import { translate } from '@/i18n';
import { DemoCommunityScreen, DemoDebugScreen, DemoShowroomScreen } from '@/screens';
import { DemoPodcastListScreen } from '@/screens/DemoPodcastListScreen';
import type { ThemedStyle } from '@/theme';
import { useAppTheme } from '@/utils/useAppTheme';

import { AppStackParamList, AppStackScreenProps } from './AppNavigator';

export type DemoTabParamList = {
  DemoCommunity: undefined;
  DemoShowroom: { queryIndex?: string; itemIndex?: string };
  DemoDebug: undefined;
  DemoPodcastList: undefined;
};

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>;

const Tab = createBottomTabNavigator<DemoTabParamList>();

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `DemoNavigator`.
 */
export function DemoNavigator() {
  const { bottom } = useSafeAreaInsets();
  const {
    themed,
    theme: { colors },
  } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: themed([$tabBar, { height: bottom + 70 }]),
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: themed($tabBarLabel),
        tabBarItemStyle: themed($tabBarItem),
      }}
    >
      <Tab.Screen
        name="DemoShowroom"
        component={DemoShowroomScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <HomeIcon color={focused ? colors.tint : colors.tintInactive} width={24} height={24} />
          ),
        }}

      />

      <Tab.Screen
        name="DemoCommunity"
        component={DemoCommunityScreen}
        options={{
          tabBarLabel: "Learn",
          tabBarIcon: ({ focused }) => (
            <LearnIcon color={focused ? colors.tint : colors.tintInactive} width={24} height={24} />
          ),
        }}
      />

      <Tab.Screen
        name="DemoPodcastList"
        component={DemoPodcastListScreen}
        options={{
          tabBarAccessibilityLabel: translate('demoNavigator:podcastListTab'),
          tabBarLabel: "Guide",
          tabBarIcon: ({ focused }) => (
            <GuideIcon color={focused ? colors.tint : colors.tintInactive} width={24} height={24} />
          ),
        }}
      />

      <Tab.Screen
        name="DemoDebug"
        component={DemoDebugScreen}
        options={{
          tabBarLabel: "Account",
          tabBarIcon: ({ focused }) => (
            <AccountIcon color={focused ? colors.tint : colors.tintInactive} width={24} height={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const $tabBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
});

const $tabBarItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.md,
});

const $tabBarLabel: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  color: colors.text,
});

// @demo remove-file
