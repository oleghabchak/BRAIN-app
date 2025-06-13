import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { AuthStackParamList } from "@/navigators/AuthNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeader } from "@/utils/useHeader";
import LeftArrowIcon from "@assets/icons/arrow-left.svg";
import { colors } from "@/theme";
import LogoIcon from "@assets/icons/auth/logo.svg";
import { Screen } from "@/components";
import { getPolicyContent } from "@/constants/policyContent";

type PolicyDetailScreenRouteProp = RouteProp<AuthStackParamList, "PolicyDetail">;

type PolicyDetailScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, "PolicyDetail">;

export function PolicyDetailScreen() {
  const navigation = useNavigation<PolicyDetailScreenNavigationProp>();
  const route = useRoute<PolicyDetailScreenRouteProp>();
  const { policyType } = route.params;

  const { title, subtitle, content } = useMemo(() => getPolicyContent(policyType), [policyType]);

  const headerTitle = useMemo(() => {
    switch (policyType) {
      case "privacy":
        return "Privacy Policy";
      case "terms":
        return "Terms of Policy";
      case "cookie":
        return "Cookie Policy";
      default:
        return "Policy";
    }
  }, [policyType]);

  useHeader(
    {
      title: headerTitle,
      backgroundColor: colors.background,
      LeftActionComponent: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LeftArrowIcon width={24} height={24} />
        </TouchableOpacity>
      ),
    },
    [headerTitle]
  );

  return (
    <Screen preset="auto" safeAreaEdges={["bottom"]}>
      <ScrollView style={styles.container}>
        <View style={styles.logoContainer}>
          <LogoIcon width={42} height={42} />
          <Text style={styles.appName}>Brainsugar</Text>
        </View>

        <Text style={styles.mainTitle}>{title}</Text>
        <Text style={styles.subTitle}>{subtitle}</Text>
        <View style={styles.divider} />
        <Text style={styles.content}>{content}</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 48,
  },
  appName: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    color: "#333",
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subTitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    marginBottom: 20,
  },
});
