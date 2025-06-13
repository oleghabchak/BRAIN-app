import { StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { useAppTheme } from "@/utils/useAppTheme";
import { useEffect, useState } from "react";

interface TextWithLinkProps {
  defaultText: string;
  clickableText: string;
  style?: StyleProp<ViewStyle>;
  defaultTextStyles?: StyleProp<TextStyle>;
  clickableTextStyles?: StyleProp<TextStyle>;
  onPressClickable?: () => void;
  withCooldown?: boolean;
  cooldownText?: string;
}

export default function TextWithLink({
  defaultText,
  clickableText,
  style,
  defaultTextStyles,
  clickableTextStyles,
  onPressClickable,
  withCooldown,
  cooldownText,
}: TextWithLinkProps) {
  const {
    theme: { colors },
  } = useAppTheme();
  const [pressed, setPressed] = useState(false);

  const [timer, setTimer] = useState(0);

  const handlePress = () => {
    if (withCooldown && !pressed) {
      setPressed(true);
      setTimer(30); // set cooldown seconds here
      onPressClickable?.();
    } else if (!withCooldown) {
      onPressClickable?.();
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (pressed && withCooldown) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setPressed(false);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pressed]);

  return (
    <View style={[{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }, style]}>
      <Text style={[{ fontSize: 14, textAlign: "center" }, defaultTextStyles]}>{defaultText}</Text>
      <TouchableOpacity disabled={pressed} onPress={handlePress}>
        {timer == 0 ? (
          <Text style={[{ color: colors.palette.primary500, fontSize: 14 }, clickableTextStyles]}>{clickableText}</Text>
        ) : (
          <Text
            style={[
              clickableTextStyles,
              { color: colors.palette.neutral600, fontSize: 14, textDecorationLine: "none" },
            ]}
          >
            {cooldownText}
            {timer}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
