import LeftArrowIcon from "@assets/icons/arrow-left.svg";
import EyeClosedIcon from "@assets/icons/auth/eye_closed.svg";
import EyeOpenIcon from "@assets/icons/auth/eye_open.svg";
import EmailVerifiedImage from "@assets/images/email_verified.svg";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View, ViewStyle } from "react-native";

import { Button, Screen, Text, TextField } from "@/components";
import BlurBackground from "@/components/BlurBackground";
import LoadingCircle from "@/components/LoadingCircle";
import OTPCode from "@/components/OTPCode";
import { useAuth } from "@/contexts/authContext";
import { AppStackScreenProps } from "@/navigators";
import { AuthStackParamList } from "@/navigators/AuthNavigator";
import { type ThemedStyle } from "@/theme";
import { useAppTheme } from "@/utils/useAppTheme";
import { useHeader } from "@/utils/useHeader";

interface ForgotPasswordScreenProps extends AppStackScreenProps<"ForgotPassword"> {}

export const ForgotPasswordScreen: FC<ForgotPasswordScreenProps> = observer(
  function ForgotPasswordScreen(_props) {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otpCode, setOtpCode] = useState(Array(6).fill(""));
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isNewPasswordHidden, setIsNewPasswordHidden] = useState(true);
    const [isConfirmNewPasswordHidden, setIsConfirmNewPasswordHidden] = useState(true);

    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const {
      themed,
      theme: { colors },
    } = useAppTheme();

    const { forgotPassword, verifyForgotPasswordOtp, resetPassword } = useAuth();

    useHeader(
      {
        titleTx: step === 4 ? "" : "Forgot Password", 
        LeftActionComponent:
          step === 4 ? null : ( 
            <TouchableOpacity
              onPress={() => {
                if (step > 1) {
                  setStep(step - 1);
                  setError(""); 
                } else {
                  navigation.goBack(); 
                }
              }}
            >
              <LeftArrowIcon width={24} height={24} />
            </TouchableOpacity>
          ),
      },
      [step] 
    );

    const handleForgotPassword = async () => {
      setLoading(true);
      setError("");
      const response = await forgotPassword(email);
      if (response.success) {
        setStep(2);
      } else {
        setError(response.message);
      }
      setLoading(false);
    };

    const handleVerifyOtp = async () => {
      setLoading(true);
      setError("");
      const code = otpCode.join("");
      const response = await verifyForgotPasswordOtp(email, code);
      if (response.success) {
        setStep(3);
      } else {
        setError(response.message);
      }
      setLoading(false);
    };

    const handleResetPassword = async () => {
      if (newPassword !== confirmNewPassword) {
        setError("Passwords do not match.");
        return;
      }
      setLoading(true);
      setError("");
      const code = otpCode.join("");
      const response = await resetPassword(email, code, newPassword);
      if (response.success) {
        setModalOpen(true);
        setStep(4); 
        setTimeout(() => {
          setModalOpen(false);
          navigation.navigate("Login"); 
        }, 2000);
      } else {
        setError(response.message);
      }
      setLoading(false);
    };

    const getEyeIconColor = (props: any, passwordValue: string) => {
      if (props.status === "error") return colors.error;
      if (!props.editable) return colors.palette.neutral400;
      return passwordValue ? colors.palette.primary500 : colors.palette.neutral700;
    };

    return (
      <>
        <Screen contentContainerStyle={themed($screenContentContainer)} safeAreaEdges={["bottom"]}>
          {step === 1 && (
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, marginBottom: 5 }}>
                Enter your email to reset your password.
              </Text>
              <TextField
                status={error ? "error" : undefined}
                value={email}
                onChangeText={setEmail}
                containerStyle={themed($textField)}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                labelTx="Email"
                placeholderTx="Enter Email"
                placeholderTextColor={error ? colors.error : colors.palette.neutral600}
                onChange={() => error && setError("")}
              />
              {error && <Text style={{ fontSize: 12, color: colors.error }}>{error}</Text>}
            </View>
          )}

          {step === 2 && (
            <View style={{ flex: 1, marginTop: 20 }}>
              <Text style={{ fontSize: 18, marginBottom: 5 }}>
                We’ve sent a 6-digit verification code to your email address
              </Text>
              <Text weight="medium" style={{ color: colors.palette.neutral600, fontSize: 13 }}>
                Please check your email to continue the password reset process.
              </Text>
              <OTPCode
                style={error ? { borderColor: colors.error } : undefined}
                otpCode={otpCode}
                setOtpCode={setOtpCode}
                onChange={() => error && setError("")}
              />
              {error && <Text style={{ fontSize: 12, color: colors.error }}>{error}</Text>}

              <TouchableOpacity style={{ marginTop: 15 }} onPress={handleForgotPassword}>
                <Text
                  style={{
                    textDecorationLine: "underline",
                    fontWeight: "700",
                    color: colors.palette.primary500,
                  }}
                >
                  Resend it.
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, marginBottom: 5 }}>Set your new password.</Text>
              <TextField
                status={error ? "error" : undefined}
                value={newPassword}
                onChangeText={setNewPassword}
                containerStyle={themed($textField)}
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect={false}
                secureTextEntry={isNewPasswordHidden}
                labelTx="New Password"
                placeholderTx="Enter new password"
                placeholderTextColor={error ? colors.error : colors.palette.neutral600}
                RightAccessory={(props) =>
                  !isNewPasswordHidden ? (
                    <TouchableOpacity onPress={() => setIsNewPasswordHidden(true)}>
                      <EyeOpenIcon
                        width={25}
                        height={25}
                        style={[props.style, { marginRight: 9 }]}
                        color={getEyeIconColor(props, newPassword)}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => setIsNewPasswordHidden(false)}>
                      <EyeClosedIcon
                        width={20}
                        height={20}
                        style={[props.style, { marginRight: 11 }]}
                        color={getEyeIconColor(props, newPassword)}
                      />
                    </TouchableOpacity>
                  )
                }
                onChange={() => error && setError("")}
              />
              <TextField
                status={error ? "error" : undefined}
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                containerStyle={[themed($textField), { marginBottom: 25 }]}
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect={false}
                secureTextEntry={isConfirmNewPasswordHidden}
                labelTx="Confirm New Password"
                placeholderTx="Confirm new password"
                placeholderTextColor={error ? colors.error : colors.palette.neutral600}
                RightAccessory={(props) =>
                  !isConfirmNewPasswordHidden ? (
                    <TouchableOpacity onPress={() => setIsConfirmNewPasswordHidden(true)}>
                      <EyeOpenIcon
                        width={25}
                        height={25}
                        style={[props.style, { marginRight: 9 }]}
                        color={getEyeIconColor(props, confirmNewPassword)}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => setIsConfirmNewPasswordHidden(false)}>
                      <EyeClosedIcon
                        width={20}
                        height={20}
                        style={[props.style, { marginRight: 11 }]}
                        color={getEyeIconColor(props, confirmNewPassword)}
                      />
                    </TouchableOpacity>
                  )
                }
                onChange={() => error && setError("")}
              />
              {error && <Text style={{ fontSize: 12, color: colors.error }}>{error}</Text>}
            </View>
          )}

          {step !== 4 && ( // Hide button on success screen
            <Button
              testID="forgot-password-button"
              disabled={
                loading ||
                (step === 1 && !email) ||
                (step === 2 && otpCode.some((el) => el === "")) ||
                (step === 3 && (!newPassword || !confirmNewPassword))
              }
              style={themed($tapButton)}
              onPress={() => {
                if (step === 1) {
                  handleForgotPassword();
                } else if (step === 2) {
                  handleVerifyOtp();
                } else if (step === 3) {
                  handleResetPassword();
                }
              }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>{step === 1 ? "Send Code" : step === 2 ? "Verify Code" : "Save New Password"}</>
              )}
            </Button>
          )}
        </Screen>
        {modalOpen && (
          <BlurBackground>
            {loading ? (
              <LoadingCircle />
            ) : (
              <View style={$emailVerifiedModal}>
                <View style={{ marginLeft: 20, alignItems: "center" }}>
                  <EmailVerifiedImage width={200} height={200} />
                  <Text weight="medium" style={{ fontSize: 18, marginTop: 10 }}>
                    Password reset successfully!
                  </Text>
                </View>
              </View>
            )}
          </BlurBackground>
        )}
      </>
    );
  }
);

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-between",
});

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
});

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
});

const $emailVerifiedModal: ViewStyle = {
  backgroundColor: "white",
  alignItems: "center",
  width: "90%",
  paddingVertical: 30,
  borderRadius: 16,
  justifyContent: "center",
};