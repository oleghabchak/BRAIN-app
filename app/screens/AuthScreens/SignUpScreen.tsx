import LeftArrowIcon from "@assets/icons/arrow-left.svg";
import EyeClosedIcon from "@assets/icons/auth/eye_closed.svg";
import EyeOpenIcon from "@assets/icons/auth/eye_open.svg";
import EmailVerifiedImage from "@assets/images/email_verified.svg";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useRef, useState } from "react";
import { ActivityIndicator, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";

import { Button, ListItem, ListView, Screen, Text, TextField } from "@/components";
import BlurBackground from "@/components/BlurBackground";
import CustomDropbar from "@/components/CustomDropbar";
import DateChooser from "@/components/DateChooser";
import LoadingCircle from "@/components/LoadingCircle";
import OTPCode from "@/components/OTPCode";
import StepsPagination from "@/components/StepsPagination";
import TextWithLink from "@/components/TextWithLink";
import { Checkbox } from "@/components/Toggle/Checkbox";
import { useAuth } from "@/contexts/authContext";
import { AppStackScreenProps } from "@/navigators";
import { AuthStackParamList } from "@/navigators/AuthNavigator";
import { type ThemedStyle } from "@/theme";
import { UserRegistrationInfo } from "@/types/authContext";
import { useAppTheme } from "@/utils/useAppTheme";
import { useHeader } from "@/utils/useHeader";

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen(_props) {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const [loading, setLoading] = useState(false);
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true);

  const [isPrivacyChecked, setPrivacyChecked] = useState(false);
  const [isTermsChecked, setTermsChecked] = useState(false);
  const [isCookiePolicyChecked, setCookiePolicyChecked] = useState(false);

  const [isDisabled, setIsDisabled] = useState(true);

  const { userRegistrationInfo, setUserRegistrationInfo, onSignUp, verifyEmail } = useAuth();
  const { step } = userRegistrationInfo;

  const [otpCode, setOtpCode] = useState(Array(6).fill(""));
  const [registerError, setRegisterError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [emailVerificationError, setEmailVerificationError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const {
    themed,
    theme: { colors },
  } = useAppTheme();

  useEffect(() => {
    getDisabledState();
  }, [userRegistrationInfo, otpCode]);

  const getDisabledState = () => {
    if (step === 1) {
      const { name, birth_date, gender } = userRegistrationInfo;
      setIsDisabled(!name || !birth_date || !gender);
    } else if (step === 2) {
      const { email, password, c_password } = userRegistrationInfo;
      setIsDisabled(!email || !password || !c_password);
    } else if (step === 3) {
      setIsDisabled(otpCode.some((el) => el === ""));
    }
  };

  const updateUserRegistrationInfo = (data: Partial<UserRegistrationInfo>) => {
    setUserRegistrationInfo((prev) => ({ ...prev, ...data }));
  };

  useHeader(
    {
      titleTx: "Sign Up",
      LeftActionComponent: (
        <TouchableOpacity
          onPress={() => {
            if (step > 1) {
              updateUserRegistrationInfo({ step: step - 1 });
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

  const signUp = async () => {
    if (!isTermsChecked || !isPrivacyChecked || !isCookiePolicyChecked) {
      setTermsError("You need to agree to all terms before register.");
      return;
    }
    setLoading(true);
    const { name, email, password, c_password } = userRegistrationInfo;
    const response = await onSignUp(name, email, password, c_password);
    if (response.success) {
      console.log(response.email_verification_token);
      setUserRegistrationInfo({ ...userRegistrationInfo, step: step + 1 });
    } else {
      setRegisterError(response.message);
    }
    setLoading(false);
  };

  const onVerifyEmail = async () => {
    setModalOpen(true);
    setLoading(true);
    const { email } = userRegistrationInfo;
    const code = otpCode.join("");
    const response = await verifyEmail(email, code);
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
  };

  const getEyeIconColor = (props: any, authPassword: string) => {
    if (props.status === "error") return colors.error;
    if (!props.editable) return colors.palette.neutral400;
    return authPassword ? colors.palette.primary500 : colors.palette.neutral700;
  };

  return (
    <>
      <Screen contentContainerStyle={themed($screenContentContainer)} safeAreaEdges={["bottom"]}>
        <StepsPagination currentStep={step} />
        {step == 1 && (
          <View style={{ flex: 1 }}>
            <TextField
              value={userRegistrationInfo.name}
              onChangeText={(name) => updateUserRegistrationInfo({ name })}
              containerStyle={themed($textField)}
              autoCapitalize="none"
              autoCorrect={false}
              labelTx="Your name"
              placeholderTx="Enter Name"
            />
            <DateChooser
              title="Date of Birth"
              value={userRegistrationInfo.birth_date}
              onChange={(birth_date) => updateUserRegistrationInfo({ birth_date })}
            />
            <CustomDropbar
              title="Your Gender"
              placeholder="Please select a gender"
              options={["Female", "Male", "Prefer not to say"]}
              value={userRegistrationInfo.gender}
              onChange={(gender) => updateUserRegistrationInfo({ gender })}
            />
          </View>
        )}

        {step == 2 && (
          <View style={{ flex: 1 }}>
            <TextField
              status={registerError ? "error" : undefined}
              value={userRegistrationInfo.email}
              onChangeText={(email) => updateUserRegistrationInfo({ email })}
              containerStyle={themed($textField)}
              autoCapitalize="none"
              autoCorrect={false}
              labelTx="Email"
              placeholderTx="Enter Email"
              placeholderTextColor={registerError ? colors.error : colors.palette.neutral600}
              onChange={() => registerError && setRegisterError("")}
            />
            <TextField
              status={registerError ? "error" : undefined}
              value={userRegistrationInfo.password}
              onChangeText={(password) => updateUserRegistrationInfo({ password })}
              containerStyle={themed($textField)}
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              secureTextEntry={isAuthPasswordHidden}
              labelTx="Password"
              placeholderTx="Enter password"
              placeholderTextColor={registerError ? colors.error : colors.palette.neutral600}
              RightAccessory={(props) =>
                !isAuthPasswordHidden ? (
                  <TouchableOpacity onPress={() => setIsAuthPasswordHidden(true)}>
                    <EyeOpenIcon
                      width={25}
                      height={25}
                      style={[props.style, { marginRight: 9 }]}
                      color={getEyeIconColor(props, userRegistrationInfo.password)}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => setIsAuthPasswordHidden(false)}>
                    <EyeClosedIcon
                      width={20}
                      height={20}
                      style={[props.style, { marginRight: 11 }]}
                      color={getEyeIconColor(props, userRegistrationInfo.password)}
                    />
                  </TouchableOpacity>
                )
              }
              onChange={() => registerError && setRegisterError("")}
            />
            <TextField
              status={registerError ? "error" : undefined}
              value={userRegistrationInfo.c_password}
              onChangeText={(c_password) => updateUserRegistrationInfo({ c_password })}
              containerStyle={[themed($textField), { marginBottom: 25 }]}
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              secureTextEntry={isAuthPasswordHidden}
              labelTx="Confirm Password"
              placeholderTx="Enter password"
              placeholderTextColor={registerError ? colors.error : colors.palette.neutral600}
              RightAccessory={(props) =>
                !isAuthPasswordHidden ? (
                  <TouchableOpacity onPress={() => setIsAuthPasswordHidden(true)}>
                    <EyeOpenIcon
                      width={25}
                      height={25}
                      style={[props.style, { marginRight: 9 }]}
                      color={getEyeIconColor(props, userRegistrationInfo.c_password)}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => setIsAuthPasswordHidden(false)}>
                    <EyeClosedIcon
                      width={20}
                      height={20}
                      style={[props.style, { marginRight: 11 }]}
                      color={getEyeIconColor(props, userRegistrationInfo.c_password)}
                    />
                  </TouchableOpacity>
                )
              }
              onChange={() => registerError && setRegisterError("")}
            />

            <Checkbox
              style={termsError ? { borderColor: colors.error } : undefined}
              checked={isPrivacyChecked}
              onPress={() => {
                setPrivacyChecked(!isPrivacyChecked);
                setTermsError("");
              }}
            >
              <TextWithLink
                defaultText="I understood the"
                clickableText="Privacy Policy."
                defaultTextStyles={{ color: colors.palette.neutral600, fontWeight: 400 }}
                clickableTextStyles={{ fontWeight: 500 }}
              />
            </Checkbox>
            <Checkbox
              style={termsError ? { borderColor: colors.error } : undefined}
              checked={isTermsChecked}
              onPress={() => {
                setTermsChecked(!isTermsChecked);
                setTermsError("");
              }}
            >
              <TextWithLink
                defaultText="I understood the"
                clickableText="Terms of Policy."
                defaultTextStyles={{ color: colors.palette.neutral600, fontWeight: 400 }}
                clickableTextStyles={{ fontWeight: 500 }}
              />
            </Checkbox>
            <Checkbox
              style={termsError ? { borderColor: colors.error } : undefined}
              checked={isCookiePolicyChecked}
              onPress={() => {
                setCookiePolicyChecked(!isCookiePolicyChecked);
                setTermsError("");
              }}
            >
              <TextWithLink
                defaultText="I understood the"
                clickableText="Cookie Policy."
                defaultTextStyles={{ color: colors.palette.neutral600, fontWeight: 400 }}
                clickableTextStyles={{ fontWeight: 500 }}
              />
            </Checkbox>
            {registerError && <Text style={{ fontSize: 12, color: colors.error }}>{registerError}</Text>}
            {termsError && <Text style={{ fontSize: 12, color: colors.error }}>{termsError}</Text>}
          </View>
        )}

        {step == 3 && (
          <View style={{ flex: 1, marginTop: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>
              We’ve sent a verification link with a 6-digit code to your email address
            </Text>
            <Text weight="medium" style={{ color: colors.palette.neutral600, fontSize: 13 }}>
              Please check your email to continue the sign-up process.
            </Text>
            <OTPCode
              style={emailVerificationError ? { borderColor: colors.error, color: colors.error } : undefined}
              otpCode={otpCode}
              setOtpCode={setOtpCode}
              onChange={() => emailVerificationError && setEmailVerificationError("")}
            />
            {emailVerificationError && (
              <Text style={{ fontSize: 12, color: colors.error }}>{emailVerificationError}</Text>
            )}

            <TextWithLink
              style={{ marginTop: 15 }}
              defaultText="Haven't received the verification code?"
              clickableText="Resend it."
              clickableTextStyles={{ textDecorationLine: "underline", fontWeight: 700 }}
            />

            <Text style={{ fontSize: 18, marginTop: 50 }}>Having trouble finding your 6-digit code?</Text>
            <Text
              weight="medium"
              style={{ color: colors.palette.neutral600, fontSize: 12, marginTop: 10, lineHeight: 20 }}
            >
              Check your spam folder or make sure you spelled your email address correctly. If needed, please go back to
              the previous screen to re-enter your email address!
            </Text>
          </View>
        )}

        <Button
          testID="login-button"
          disabled={isDisabled}
          style={themed($tapButton)}
          onPress={() => {
            if (step == 2) {
              signUp();
              return;
            }
            if (step < 3) {
              setUserRegistrationInfo({ ...userRegistrationInfo, step: step + 1 });
            } else {
              onVerifyEmail();
            }
          }}
        >
          {loading ? <ActivityIndicator color="white" /> : <>{step == 3 ? "Submit code" : "Next"}</>}
        </Button>
      </Screen>
      {modalOpen && (
        <BlurBackground>
          {loading ? (
            <LoadingCircle />
          ) : (
            <View style={$emailVerifiedModal}>
              <View style={{ marginLeft: 20 }}>
                <EmailVerifiedImage width={200} height={200} />
                <Text weight="medium" style={{ fontSize: 18, marginTop: 10 }}>
                  Your email is verified!
                </Text>
              </View>
            </View>
          )}
        </BlurBackground>
      )}
    </>
  );
});

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-between",
});

export const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
});

export const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
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
