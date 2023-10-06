import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../assets/Colors';
import LoginForm from '../components/LoginForm/LoginForm';

export default function Login() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes of Deep</Text>
      <Text style={styles.subTitle}>Faça o login e começe a usar!</Text>
      <LoginForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.primaryColor,
    paddingBottom: 2,
  },
  subTitle: {
    fontSize: 14,
    color: Colors.secundaryColor,
    fontWeight: '600',
  },
});
