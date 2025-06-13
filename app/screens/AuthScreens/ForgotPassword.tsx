import { View, TouchableOpacity, ViewStyle } from "react-native";
import React, { FC, useState } from "react";
import { AuthStackParamList } from "@/navigators/AuthNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Screen, Text, TextField } from "@/components";
import { $screenContentContainer } from "./LoginScreen";
import { useAppTheme } from "@/utils/useAppTheme";
import { useHeader } from "@/utils/useHeader";
import LeftArrowIcon from "@assets/icons/arrow-left.svg";
import { useNavigation, NavigationProp, useRoute } from "@react-navigation/native";
import OTPCode from "@/components/OTPCode";
import TextWithLink from "@/components/TextWithLink";
import type { ThemedStyle } from "@/theme";
import EyeClosedIcon from "@assets/icons/auth/eye_closed.svg";
import EyeOpenIcon from "@assets/icons/auth/eye_open.svg";
import { useAuth } from "@/contexts/authContext";
import BlurBackground from "@/components/BlurBackground";
import LoadingCircle from "@/components/LoadingCircle";
import PasswordResetedImage from "@assets/images/password_reseted.svg";
import { useStores } from "@/models";

export type ForgotPasswordProps = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export const ForgotPassword: FC<ForgotPasswordProps> = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const {
    themed,
    theme: { colors },
  } = useAppTheme();

  const { resetPassword } = useAuth();

  const {
    authenticationStore: { authEmail },
  } = useStores();

  const route = useRoute();

  const { code } = route.params as { code: string };

  console.log(code);

  const [otpCode, setOtpCode] = useState(Array(6).fill(""));
  const [emailVerificationError, setEmailVerificationError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getEyeIconColor = (props: any, authPassword: string) => {
    if (props.status === "error") return colors.error;
    if (!props.editable) return colors.palette.neutral400;
    return authPassword ? colors.palette.primary500 : colors.palette.neutral700;
  };

  useHeader(
    {
      titleTx: "Log in",
      LeftActionComponent: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LeftArrowIcon width={24} height={24} />
        </TouchableOpacity>
      ),
    },
    []
  );

  const onResetPassword = async () => {
    setModalOpen(true);
    setLoading(true);
    const response = await resetPassword(authEmail, newPassword, confirmNewPassword, otpCode.join(""));
    if (!response.success) {
      setEmailVerificationError(response.message);
      setModalOpen(false);
    } else {
      setTimeout(() => {
        navigation.navigate("Info");
        setModalOpen(false);
      }, 2000);
    }
    setLoading(false);
    setModalOpen(false);
    setModalOpen(true);
  };

  return (
    <>
      <Screen preset="auto" contentContainerStyle={themed($screenContentContainer)} safeAreaEdges={["bottom"]}>
        <View style={{ flex: 1, marginTop: -20 }}>
          <Text style={{ fontSize: 18, marginBottom: 5, lineHeight: 28 }}>
            We’ve sent a 6-digit verification code to your email address
          </Text>
          <Text weight="medium" style={{ color: colors.palette.neutral600, fontSize: 13 }}>
            Please fill out this field to create a new password.
          </Text>
          <OTPCode
            style={emailVerificationError ? { borderColor: colors.error, color: colors.error } : undefined}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            onChange={() => emailVerificationError && setEmailVerificationError("")}
          />

          <TextWithLink
            style={{ marginTop: 15 }}
            defaultText="Haven't received the verification code?"
            clickableText="Resend it."
            clickableTextStyles={{ textDecorationLine: "underline", fontWeight: 700 }}
          />

          <View style={{ marginTop: 40 }}>
            <TextField
              status={emailVerificationError ? "error" : undefined}
              value={newPassword}
              onChangeText={(password) => setNewPassword(password)}
              containerStyle={themed($textField)}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={isAuthPasswordHidden}
              labelTx="New Password"
              placeholderTx="Enter password"
              placeholderTextColor={emailVerificationError ? colors.error : colors.palette.neutral600}
              RightAccessory={(props) =>
                !isAuthPasswordHidden ? (
                  <TouchableOpacity onPress={() => setIsAuthPasswordHidden(true)}>
                    <EyeOpenIcon
                      width={25}
                      height={25}
                      style={[props.style, { marginRight: 9 }]}
                      color={getEyeIconColor(props, newPassword)}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => setIsAuthPasswordHidden(false)}>
                    <EyeClosedIcon
                      width={20}
                      height={20}
                      style={[props.style, { marginRight: 11 }]}
                      color={getEyeIconColor(props, newPassword)}
                    />
                  </TouchableOpacity>
                )
              }
              onChange={() => emailVerificationError && setEmailVerificationError("")}
            />
            <TextField
              status={emailVerificationError ? "error" : undefined}
              value={confirmNewPassword}
              onChangeText={(c_password) => setConfirmNewPassword(c_password)}
              containerStyle={[themed($textField), { marginBottom: 25 }]}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={isAuthPasswordHidden}
              labelTx="Confirm New Password"
              placeholderTx="Enter password"
              placeholderTextColor={emailVerificationError ? colors.error : colors.palette.neutral600}
              RightAccessory={(props) =>
                !isAuthPasswordHidden ? (
                  <TouchableOpacity onPress={() => setIsAuthPasswordHidden(true)}>
                    <EyeOpenIcon
                      width={25}
                      height={25}
                      style={[props.style, { marginRight: 9 }]}
                      color={getEyeIconColor(props, confirmNewPassword)}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => setIsAuthPasswordHidden(false)}>
                    <EyeClosedIcon
                      width={20}
                      height={20}
                      style={[props.style, { marginRight: 11 }]}
                      color={getEyeIconColor(props, confirmNewPassword)}
                    />
                  </TouchableOpacity>
                )
              }
              onChange={() => emailVerificationError && setEmailVerificationError("")}
            />
            {emailVerificationError && (
              <Text style={{ fontSize: 12, color: colors.error, marginBottom: 20 }}>{emailVerificationError}</Text>
            )}

            <Button onPress={onResetPassword}>Save New Password</Button>
          </View>
        </View>
      </Screen>
      {modalOpen && (
        <BlurBackground>
          {loading ? (
            <LoadingCircle />
          ) : (
            <View style={$emailVerifiedModal}>
              <View style={{ marginLeft: 20, alignItems: "center" }}>
                <PasswordResetedImage width={300} height={300} />
                <Text weight="medium" style={{ fontSize: 18, marginTop: 10 }}>
                  Password updated successfully!
                </Text>
              </View>
            </View>
          )}
        </BlurBackground>
      )}
    </>
  );
};

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
});

const $emailVerifiedModal: ViewStyle = {
  backgroundColor: "white",
  alignItems: "center",
  width: "90%",
  paddingVertical: 35,
  borderRadius: 16,
  justifyContent: "center",
};
