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
import { useAuth } from "@/contexts/authContext";

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const [authPassword, setAuthPassword] = useState("");
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { onLogIn } = useAuth();

  const {
    authenticationStore: { authEmail, setAuthEmail },
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

  const login = async () => {
    setLoading(true);

    const response = await onLogIn!(authEmail, authPassword);
    if (!response.success) {
      setError(response.message);
    }

    setLoading(false);
  };

  const getEyeIconColor = (props: any) => {
    if (props.status === "error") return colors.error;
    if (!props.editable) return colors.palette.neutral400;
    return authPassword ? colors.palette.primary500 : colors.palette.neutral700;
  };

  return (
    <>
      <Screen preset="auto" contentContainerStyle={themed($screenContentContainer)} safeAreaEdges={["top", "bottom"]}>
        <TextField
          status={error ? "error" : undefined}
          value={authEmail}
          onChangeText={setAuthEmail}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="loginScreen:emailFieldLabel"
          placeholderTx="Enter Email"
          onChange={() => error && setError("")}
        />

        <TextField
          status={error ? "error" : undefined}
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
          onChange={() => error && setError("")}
        />

        {error && <Text style={{ marginBottom: 5, color: colors.error }}>{error}</Text>}

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
