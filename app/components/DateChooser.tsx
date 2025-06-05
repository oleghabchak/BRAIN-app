import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import React, { useState } from "react";
import DatePicker from "react-native-date-picker";
import { Text } from "./Text";
import { useAppTheme } from "@/utils/useAppTheme";
import { ThemedStyle } from "@/theme";
import { formatDate } from "@/utils/formatDate";

type Mode = "date" | "time" | "datetime";

interface DatePickerProps {
  mode?: Mode;
  title: string;
  styles?: ViewStyle;
  value: Date;
  onChange: (date: Date) => void;
}

export default function DateChooser({ mode = "date", title, styles, value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const { themed } = useAppTheme();

  const { day, month, year } = formatDate(value);

  return (
    <View>
      <Text preset="formLabel" style={themed($labelStyle)}>
        {title}
      </Text>
      <TouchableOpacity onPress={() => setOpen(true)} style={[themed($dateChooserContainer), styles]}>
        <View style={$dateRow}>
          <Text weight="medium" style={themed($dateText)}>
            {day}
          </Text>

          <View style={themed($divider)} />

          <Text weight="medium" style={themed($dateText)}>
            {month}
          </Text>

          <View style={themed($divider)} />

          <Text weight="medium" style={themed($dateText)}>
            {year}
          </Text>
        </View>
      </TouchableOpacity>

      <DatePicker
        modal
        mode={mode}
        open={open}
        date={value}
        onConfirm={(date) => {
          setOpen(false);
          onChange(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
}

const $labelStyle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
});

const $dateChooserContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderWidth: 1,
  borderColor: colors.palette.neutral600,
  borderRadius: 16,
  padding: 23,
  alignItems: "center",
  marginBottom: spacing.md,
});

const $dateRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-evenly",
  width: "100%",
};

const $dateText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  fontWeight: "600",
  color: colors.palette.primary500,
  minWidth: 50,
  textAlign: "center",
});

const $divider: ThemedStyle<TextStyle> = ({ colors }) => ({
  width: 1,
  height: 15,
  backgroundColor: colors.palette.primary400,
  marginHorizontal: 8,
});
