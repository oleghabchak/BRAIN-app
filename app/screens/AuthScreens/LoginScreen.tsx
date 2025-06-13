import LeftArrowIcon from "@assets/icons/arrow-left.svg";
import EyeClosedIcon from "@assets/icons/auth/eye_closed.svg";
import EyeOpenIcon from "@assets/icons/auth/eye_open.svg";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { TouchableOpacity, ViewStyle } from "react-native";

import { Button, Screen, Text, TextField } from "@/components";
import BlurBackground from "@/components/BlurBackground";
import LoadingCircle from "@/components/LoadingCircle";
import { useAuth } from "@/contexts/authContext";
import { useStores } from "@/models";
import { AppStackScreenProps } from "@/navigators";
import { AuthStackParamList } from "@/navigators/AuthNavigator";
import { type ThemedStyle } from "@/theme";
import { useAppTheme } from "@/utils/useAppTheme";
import { useHeader } from "@/utils/useHeader";
import { api } from "@/services";
import { ForgotPasswordResponse } from "@/types/authResponse";

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const [authPassword, setAuthPassword] = useState("");
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noEmailForgotPassword, setNoEmailForgotPassword] = useState("");

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

  const forgotPassword = async () => {
    if (!authEmail) {
      setNoEmailForgotPassword("Please enter your email before reseting your password");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post<ForgotPasswordResponse>("/forgot-password", {
        email: authEmail,
      });

      if (response && response.success) {
        navigation.navigate("ForgotPassword");
        console.log(response.data?.password_reset_code);
      } else {
        setNoEmailForgotPassword(response.data.message);
      }
    } catch (error) {
      setNoEmailForgotPassword("Something goes wrong with forgot password");
    } finally {
      setLoading(false);
    }
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
          status={error || noEmailForgotPassword ? "error" : undefined}
          value={authEmail}
          onChangeText={setAuthEmail}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="loginScreen:emailFieldLabel"
          placeholderTx="Enter Email"
          onChange={() => {
            if (error) {
              setError("");
            }
            if (noEmailForgotPassword) {
              setNoEmailForgotPassword("");
            }
          }}
        />
        {noEmailForgotPassword && (
          <Text style={{ marginBottom: 10, color: colors.error }}>{noEmailForgotPassword}</Text>
        )}

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
        <Button
          preset="outline"
          testID="login-button"
          style={themed($tapButton)}
          onPress={() => navigation.navigate("SignUp")}
        >
          Switch to Sign up
        </Button>
        <TouchableOpacity style={{ width: "100%", alignItems: "center", marginTop: 20 }} onPress={forgotPassword}>
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

export const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
});

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
});

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
});
