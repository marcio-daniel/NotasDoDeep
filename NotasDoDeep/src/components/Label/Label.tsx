import React from 'react';
import {Text, TextProps} from 'react-native';

interface LabelProps extends TextProps {
  fontSize: number;
  color?: string;
  fontWeight: '400' | 'bold' | '900';
}

export default function Label(props: LabelProps) {
  return (
    <Text
      style={{
        fontSize: props.fontSize,
        color: props.color,
        fontWeight: props.fontWeight,
        margin: 5,
      }}
      {...props}>
      {props.children}
    </Text>
  );
}
