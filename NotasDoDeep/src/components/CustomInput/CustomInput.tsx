import React, {ReactNode} from 'react';
import {
  View,
  TextInput,
  ViewProps,
  TextInputProps,
  StyleSheet,
} from 'react-native';

import {Colors} from '../../assets/Colors';

interface InputRootProps extends ViewProps {
  children: ReactNode;
}

function InputRoot(props: InputRootProps) {
  return (
    <View {...props} style={styles.container}>
      {props.children}
    </View>
  );
}

interface InputInputProps extends TextInputProps {}

function InputInput(props: InputInputProps) {
  return <TextInput {...props} style={styles.input}></TextInput>;
}

interface InputIconProps {
  children: ReactNode;
}

function InputIcon(props: InputIconProps) {
  return <>{props.children}</>;
}

export const Input = {
  Root: InputRoot,
  Input: InputInput,
  Icon: InputIcon,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    backgroundColor: Colors.dark_background,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 12,
    paddingLeft: 5,
  },
  input: {
    color: Colors.primaryColor,
    fontSize: 18,
    flex: 1,
  },
});
