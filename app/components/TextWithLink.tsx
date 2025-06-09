import { StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { useAppTheme } from '@/utils/useAppTheme';

interface TextWithLinkProps {
  defaultText: string;
  clickableText: string;
  style?: StyleProp<ViewStyle>;
  defaultTextStyles?: StyleProp<TextStyle>;
  clickableTextStyles?: StyleProp<TextStyle>;
}

export default function TextWithLink({
  defaultText,
  clickableText,
  style,
  defaultTextStyles,
  clickableTextStyles,
}: TextWithLinkProps) {
  const {
    theme: { colors },
  } = useAppTheme();
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center' }, style]}>
      <Text style={[{ fontSize: 14, textAlign: 'center' }, defaultTextStyles]}>{defaultText}</Text>
      <TouchableOpacity>
        <Text style={[{ color: colors.palette.primary500, fontSize: 14 }, clickableTextStyles]}>{clickableText}</Text>
      </TouchableOpacity>
    </View>
  );
}
