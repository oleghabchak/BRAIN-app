import { FC, useRef, useState } from "react";
import { TextInput, TouchableOpacity, View, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { Button, ListItem, ListView, Screen, Text, TextField } from "@/components";
import { useStores } from "@/models";
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

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen(_props) {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    themed,
    theme: { colors },
  } = useAppTheme();

  useHeader(
    {
      titleTx: "Sign Up",
      LeftActionComponent: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LeftArrowIcon width={24} height={24} />
        </TouchableOpacity>
      ),
    },
    []
  );

  return (
    <>
      <Screen contentContainerStyle={themed($screenContentContainer)} safeAreaEdges={["top", "bottom"]}>
        <View style={{ flex: 1 }}>
          <TextField
            status={error ? "error" : undefined}
            value={name}
            onChangeText={setName}
            containerStyle={themed($textField)}
            autoCapitalize="none"
            autoCorrect={false}
            labelTx="Your name"
            placeholderTx="Enter Name"
            onChange={() => error && setError("")}
          />

          <DateChooser title="Date of Birth" />

          <CustomDropbar
            title="Your Gender"
            placeholder="Please select a gender"
            options={["Female", "Male", "Prefer not to say"]}
          />

          {error && <Text style={{ marginBottom: 5, color: colors.error }}>{error}</Text>}
        </View>
        <Button testID="login-button" style={themed($tapButton)}>
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

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
});

export const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
});
