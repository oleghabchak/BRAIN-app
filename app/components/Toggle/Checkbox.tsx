import TickIcon from '@assets/icons/tick.svg';
import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onPress, children, style }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked, style]}>
          {checked && <TickIcon width={12} height={12} />}
        </View>
      </TouchableOpacity>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8F9098',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#5A67D8',
    borderColor: '#5A67D8',
  },
  checkText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    color: '#4A5568',
  },
});
