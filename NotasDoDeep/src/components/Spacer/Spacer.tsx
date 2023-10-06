import React from 'react';
import {View, ViewProps} from 'react-native';

interface SpacerProps extends ViewProps {
  spaceSize: number;
}

export default function Spacer(props: SpacerProps) {
  return <View style={{marginTop: props.spaceSize}} />;
}
