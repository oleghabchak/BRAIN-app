import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '@/navigators/AuthNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useHeader } from '@/utils/useHeader';
import LeftArrowIcon from "@assets/icons/arrow-left.svg";
import { colors } from '@/theme';
import LogoIcon from "@assets/icons/auth/logo.svg";


type PolicyDetailScreenRouteProp = RouteProp<AuthStackParamList, 'PolicyDetail'>;

type PolicyDetailScreenNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    'PolicyDetail'
>;

const getPolicyContent = (
    policyType: 'privacy' | 'terms' | 'cookie',
) => {
    let title = '';
    let subtitle = '';
    let content = '';

    const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

    switch (policyType) {
        case 'privacy':
            title = 'Brainsugar Privacy Policy';
            subtitle = 'Privacy';
            content = loremIpsum;
            break;
        case 'terms':
            title = 'Brainsugar Terms of Service';
            subtitle = 'Terms';
            content = `These are the terms and conditions governing your use of the Brainsugar application. Please read them carefully.

${loremIpsum}`;
            break;
        case 'cookie':
            title = 'Brainsugar Cookie Policy';
            subtitle = 'Cookies';
            content = `This policy explains how Brainsugar uses cookies and similar technologies.

${loremIpsum}`;
            break;
        default:
            title = 'Brainsugar Policy';
            subtitle = 'Policy';
            content = 'No content available for this policy type.';
    }

    return { title, subtitle, content };
};

export function PolicyDetailScreen() {
    const navigation = useNavigation<PolicyDetailScreenNavigationProp>();
    const route = useRoute<PolicyDetailScreenRouteProp>();
    const { policyType } = route.params;

    const { title, subtitle, content } = useMemo(
        () => getPolicyContent(policyType),
        [policyType],
    );

    const headerTitle = useMemo(() => {
        switch (policyType) {
            case 'privacy':
                return 'Privacy Policy';
            case 'terms':
                return 'Terms of Policy';
            case 'cookie':
                return 'Cookie Policy';
            default:
                return 'Policy';
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
        [headerTitle],
    );


    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.logoContainer}>
                    <LogoIcon
                        width={42}
                        height={42}
                    />
                    <Text style={styles.appName}>Brainsugar</Text>
                </View>

                <Text style={styles.mainTitle}>{title}</Text>
                <Text style={styles.subTitle}>{subtitle}</Text>
                <View style={styles.divider} />
                <Text style={styles.content}>{content}</Text>
            </ScrollView>
        </SafeAreaView>
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 48,
    },
    appName: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
        color: '#333',
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    subTitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 15,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 15,
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
        marginBottom: 20,
    },
});