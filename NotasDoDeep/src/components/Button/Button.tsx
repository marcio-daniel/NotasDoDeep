import React, {ReactNode} from 'react';
import {
  StyleSheet,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {Colors} from '../../assets/Colors';

interface ButtonRootProps extends TouchableOpacityProps {}

function ButtonRoot(props: ButtonRootProps) {
  return <TouchableOpacity {...props}>{props.children}</TouchableOpacity>;
}

interface ButtonTextProps extends TextProps {}

function ButtonText(props: ButtonTextProps) {
  return <Text {...props}>{props.children}</Text>;
}

export const Button = {
  Root: ButtonRoot,
  Text: ButtonText,
};
