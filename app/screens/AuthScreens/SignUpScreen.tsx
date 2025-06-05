import { FC, useEffect, useRef, useState } from "react";
import { TextInput, TouchableOpacity, View, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { Button, ListItem, ListView, Screen, Text, TextField } from "@/components";
import { AppStackScreenProps } from "@/navigators";
import { type ThemedStyle } from "@/theme";
import { useAppTheme } from "@/utils/useAppTheme";
import { useHeader } from "@/utils/useHeader";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@/navigators/AuthNavigator";
import LeftArrowIcon from "@assets/icons/arrow-left.svg";
import BlurBackground from "@/components/BlurBackground";
import LoadingCircle from "@/components/LoadingCircle";
import DateChooser from "@/components/DateChooser";
import CustomDropbar from "@/components/CustomDropbar";
import { useAuth } from "@/contexts/authContext";
import StepsPagination from "@/components/StepsPagination";
import EyeOpenIcon from "@assets/icons/auth/eye_open.svg";
import EyeClosedIcon from "@assets/icons/auth/eye_closed.svg";
import { Checkbox } from "@/components/Toggle/Checkbox";

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen(_props) {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const [loading, setLoading] = useState(false);
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true);

  const [isPrivacyChecked, setPrivacyChecked] = useState(false);
  const [isTermsChecked, setTermsChecked] = useState(false);
  const [isCookiePolicyChecked, setCookiePolicyChecked] = useState(false);

  const [isDisabled, setIsDisabled] = useState(true);

  const { userRegistrationInfo, setUserRegistrationInfo } = useAuth();
  const { step } = userRegistrationInfo;

  const {
    themed,
    theme: { colors },
  } = useAppTheme();

  useEffect(() => {
    getDisabledState();
  }, [userRegistrationInfo]);

  const getDisabledState = () => {
    if (step === 1) {
      const { name, birth_date, gender } = userRegistrationInfo;
      setIsDisabled(!name || !birth_date || !gender);
    } else if (step === 2) {
      const { email, password, c_password } = userRegistrationInfo;
      setIsDisabled(!email || !password || !c_password);
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
              value={userRegistrationInfo.email}
              onChangeText={(email) => updateUserRegistrationInfo({ email })}
              containerStyle={themed($textField)}
              autoCapitalize="none"
              autoCorrect={false}
              labelTx="Email"
              placeholderTx="Enter Email"
            />
            <TextField
              value={userRegistrationInfo.password}
              onChangeText={(password) => updateUserRegistrationInfo({ password })}
              containerStyle={themed($textField)}
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              secureTextEntry={isAuthPasswordHidden}
              labelTx="Password"
              placeholderTx="Enter password"
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
            />
            <TextField
              value={userRegistrationInfo.c_password}
              onChangeText={(c_password) => updateUserRegistrationInfo({ c_password })}
              containerStyle={[themed($textField), { marginBottom: 25 }]}
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              secureTextEntry={isAuthPasswordHidden}
              labelTx="Confirm Password"
              placeholderTx="Enter password"
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
            />
            <Checkbox checked={isPrivacyChecked} onPress={() => setPrivacyChecked(!isPrivacyChecked)}>
              <View style={{ alignItems: "center", flexDirection: "row", gap: 3 }}>
                <Text style={{ fontSize: 14, color: "#8F9098" }}>I understood the</Text>
                <TouchableOpacity>
                  <Text weight="medium" style={{ fontSize: 14, color: colors.palette.primary500 }}>
                    Privacy Policy.
                  </Text>
                </TouchableOpacity>
              </View>
            </Checkbox>
            <Checkbox checked={isTermsChecked} onPress={() => setTermsChecked(!isTermsChecked)}>
              <View style={{ alignItems: "center", flexDirection: "row", gap: 3 }}>
                <Text style={{ fontSize: 14, color: "#8F9098" }}>I understood the</Text>
                <TouchableOpacity>
                  <Text weight="medium" style={{ fontSize: 14, color: colors.palette.primary500 }}>
                    Terms of Policy.
                  </Text>
                </TouchableOpacity>
              </View>
            </Checkbox>
            <Checkbox checked={isCookiePolicyChecked} onPress={() => setCookiePolicyChecked(!isCookiePolicyChecked)}>
              <View style={{ alignItems: "center", flexDirection: "row", gap: 3 }}>
                <Text style={{ fontSize: 14, color: "#8F9098" }}>I understood the</Text>
                <TouchableOpacity>
                  <Text weight="medium" style={{ fontSize: 14, color: colors.palette.primary500 }}>
                    Cookie Policy.
                  </Text>
                </TouchableOpacity>
              </View>
            </Checkbox>
          </View>
        )}

        <Button
          testID="login-button"
          disabled={isDisabled}
          style={themed($tapButton)}
          onPress={() => setUserRegistrationInfo({ ...userRegistrationInfo, step: Math.min(step + 1, 3) })}
        >
          Next
        </Button>
      </Screen>
      {loading && (
        <BlurBackground>
          <LoadingCircle />
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
  marginTop: spacing.xs,
});
