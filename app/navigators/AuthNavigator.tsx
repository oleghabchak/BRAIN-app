// src/navigation/AuthNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Screens from "@/screens";
import { PolicyType } from "@/constants/policyContent";

export type AuthStackParamList = {
  Auth: undefined;
  SignUp: undefined;
  Login: undefined;
  Info: undefined;
  ForgotPassword: undefined;
  PasswordRecovery: undefined;
  ResetPasswordOtp: { email: string };
  ResetPassword: { otpCode: string };
  PolicyDetail: { policyType: PolicyType };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
      <Stack.Screen name="Auth" component={Screens.AuthScreen} />
      <Stack.Screen name="SignUp" component={Screens.SignUpScreen} />
      <Stack.Screen name="Login" component={Screens.LoginScreen} />
      <Stack.Screen name="Info" component={Screens.InfoScreen} />
      <Stack.Screen name="PolicyDetail" component={Screens.PolicyDetailScreen} />
      <Stack.Screen name="ForgotPassword" component={Screens.ForgotPassword} />
      {/* <Stack.Screen name="PasswordRecovery" component={Screens.PasswordRecoveryScreen} />
      <Stack.Screen name="ResetPasswordOtp" component={Screens.ResetPasswordOtpScreen} />
      <Stack.Screen name="ResetPassword" component={Screens.ResetPasswordScreen} /> */}
    </Stack.Navigator>
  );
}
