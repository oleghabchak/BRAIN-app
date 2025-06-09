import { useRef } from 'react';
import { StyleProp, TextInput, View, ViewStyle } from 'react-native';

import { ThemedStyle } from '@/theme';
import { useAppTheme } from '@/utils/useAppTheme';

interface OTPCodeProps {
  otpCode: string[];
  setOtpCode: React.Dispatch<React.SetStateAction<string[]>>;
  style?: StyleProp<ViewStyle>;
  onChange?: () => void;
}

export default function OTPCode({ otpCode, setOtpCode, style, onChange }: OTPCodeProps) {
  const {
    themed,
    theme: { colors },
  } = useAppTheme();

  const inputRefs = useRef<TextInput[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    const newOtpCode = [...otpCode];

    if (value.length === 1) {
      newOtpCode[index] = value;
      setOtpCode(newOtpCode);
      if (index < otpCode.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (value === '') {
      newOtpCode[index] = '';
      setOtpCode(newOtpCode);
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace') {
      if (otpCode[index] === '') {
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      }
    }
  };

  return (
    <View style={themed($otpContainer)}>
      {otpCode.map((digit, index) => (
        <TextInput
          key={index}
          ref={(el) => (inputRefs.current[index] = el!)}
          style={[
            themed($otpInput),
            { borderColor: digit !== '' ? colors.palette.primary500 : colors.palette.neutral400 },
            style,
          ]}
          keyboardType="number-pad"
          maxLength={1}
          value={digit}
          onChangeText={(value) => {
            handleOtpChange(index, value);
            if (onChange) onChange();
          }}
          onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
          placeholder="0"
          placeholderTextColor={colors.palette.neutral300}
        />
      ))}
    </View>
  );
}

const $otpContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: spacing.lg,
});

const $otpInput: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  borderRadius: 8,
  marginHorizontal: 7,
  textAlign: 'center',
  width: 48,
  height: 48,
  color: colors.palette.primary500,
  fontWeight: 700,
  fontSize: 30,
});
