import ArrowDownIcon from "@assets/icons/arrow-down.svg";
import ArrowUpIcon from "@assets/icons/arrow-up.svg";
import React, { useEffect, useState } from "react";
import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { ThemedStyle } from "@/theme";
import { useAppTheme } from "@/utils/useAppTheme";

import { ListItem } from "./ListItem";
import { Text } from "./Text";

interface CustomDropbarProps<T = string> {
  title?: string;
  placeholder: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
}

export default function CustomDropbar({ title, placeholder, options, value, onChange }: CustomDropbarProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [selected, setSelected] = useState(value);
  const {
    themed,
    theme: { colors },
  } = useAppTheme();

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const toggleDropdown = () => setIsOpened((prev) => !prev);
  const onSelect = (item: string) => {
    setSelected(item);
    onChange(item);
    setIsOpened(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Text preset="formLabel" style={themed($labelStyle)}>
        {title}
      </Text>

      <TouchableOpacity
        onPress={toggleDropdown}
        style={[
          themed($dropbarContainer),
          { borderColor: selected ? colors.palette.primary500 : colors.palette.neutral600 },
        ]}
        activeOpacity={0.9}
      >
        <View style={$row}>
          <Text
            style={[
              themed($placeholderText),
              { color: selected ? colors.palette.primary500 : colors.palette.neutral600 },
            ]}
          >
            {selected ? selected : placeholder}
          </Text>
          {isOpened ? (
            <ArrowUpIcon
              color={selected ? colors.palette.primary500 : colors.palette.neutral600}
              width={14}
              height={14}
            />
          ) : (
            <ArrowDownIcon
              color={selected ? colors.palette.primary500 : colors.palette.neutral600}
              width={14}
              height={14}
            />
          )}
        </View>
        {isOpened && (
          <View style={themed($dropdownList)}>
            <FlatList
              scrollEnabled={false}
              data={options}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => onSelect(item)}>
                  <ListItem
                    style={{ borderColor: item == selected ? colors.palette.primary500 : colors.palette.neutral600 }}
                    textStyle={{ color: item == selected ? colors.palette.primary500 : colors.palette.neutral600 }}
                  >
                    {item}
                  </ListItem>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const $labelStyle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
});

const $dropbarContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderWidth: 1,
  padding: spacing.md,
  marginBottom: spacing.sm,
  borderRadius: 16,
  borderColor: colors.palette.neutral600,
});

const $dropdownList: ThemedStyle<ViewStyle> = ({ colors }) => ({
  marginTop: 15,
});

const $row: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};

const $placeholderText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral600,
});
