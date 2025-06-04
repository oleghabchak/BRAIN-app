import { FC, useRef, useState } from "react";
import { TextInput, TouchableOpacity, View, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { Button, Screen, Text, TextField } from "@/components";
import { useStores } from "@/models";
import { AppStackScreenProps } from "@/navigators";
import { type ThemedStyle } from "@/theme";
import { useAppTheme } from "@/utils/useAppTheme";
import { useHeader } from "@/utils/useHeader";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@/navigators/AuthNavigator";
import LeftArrowIcon from "@assets/icons/left-arrow.svg";
import EyeOpenIcon from "@assets/icons/auth/eye_open.svg";
import EyeClosedIcon from "@assets/icons/auth/eye_closed.svg";
import BlurBackground from "@/components/BlurBackground";
import LoadingCircle from "@/components/LoadingCircle";

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const authPasswordInput = useRef<TextInput>(null);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const [authPassword, setAuthPassword] = useState("");
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    authenticationStore: { authEmail, setAuthEmail, setAuthToken },
  } = useStores();

  const {
    themed,
    theme: { colors },
  } = useAppTheme();

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

  function login() {
    setLoading(true);
    setAttemptsCount(attemptsCount + 1);

    setTimeout(() => {
      setAuthToken(String(Date.now()));

      setAuthPassword("");
      setAuthEmail("");
      setLoading(false);
    }, 3000);
  }

  const getEyeIconColor = (props: any) => {
    if (props.status === "error") return colors.error;
    if (!props.editable) return colors.palette.neutral400;
    return authPassword ? colors.palette.primary500 : colors.palette.neutral700;
  };

  return (
    <>
      <Screen preset="auto" contentContainerStyle={themed($screenContentContainer)} safeAreaEdges={["top", "bottom"]}>
        <TextField
          value={authEmail}
          onChangeText={setAuthEmail}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="loginScreen:emailFieldLabel"
          placeholderTx="Enter Email"
          // helper={error}
          onSubmitEditing={() => authPasswordInput.current?.focus()}
        />

        <TextField
          ref={authPasswordInput}
          value={authPassword}
          onChangeText={setAuthPassword}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={isAuthPasswordHidden}
          labelTx="loginScreen:passwordFieldLabel"
          placeholderTx="Enter password"
          onSubmitEditing={login}
          RightAccessory={(props) =>
            !isAuthPasswordHidden ? (
              <TouchableOpacity onPress={() => setIsAuthPasswordHidden(true)}>
                <EyeOpenIcon
                  width={25}
                  height={25}
                  style={[props.style, { marginRight: 9 }]}
                  color={getEyeIconColor(props)}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setIsAuthPasswordHidden(false)}>
                <EyeClosedIcon
                  width={20}
                  height={20}
                  style={[props.style, { marginRight: 11 }]}
                  color={getEyeIconColor(props)}
                />
              </TouchableOpacity>
            )
          }
        />

        <Button testID="login-button" style={themed($tapButton)} onPress={login} disabled={!authEmail || !authPassword}>
          Log in
        </Button>
        <Button preset="outline" testID="login-button" style={themed($tapButton)}>
          Switch to Sign up
        </Button>
        <TouchableOpacity style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
          <Text style={{ fontSize: 13, color: colors.palette.primary500, textDecorationLine: "underline" }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
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
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
});

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
});

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
});
