import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Input} from '../CustomInput/CustomInput';
import {Envelope, Lock, User} from 'phosphor-react-native';
import {Colors} from '../../assets/Colors';
import Label from '../Label/Label';
import {Button} from '../Button/Button';
import Spacer from '../Spacer/Spacer';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {UserAuth} from '../../state/features/user/user-slice';
import {registration} from '../../actions/user';

export default function RegistrationForm() {
  const navigation = useNavigation();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [errorBox, setErrorBox] = useState<boolean>(false);
  const [sucessBox, setSucessBox] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm_password, setConfirm_password] = useState<string>('');

  function validate() {
    let error = false;
    setErrorMsg('');
    setErrorBox(false);
    let re =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;
    let msg = '';
    if (!re.test(email)) {
      msg += 'O email informado precisa ser valido!\n';
      setErrorBox(true);
      error = true;
    }
    if (name.length < 3) {
      msg += 'O nome precisa ser valido!\n';
      setErrorBox(true);
      error = true;
    }
    if (
      name === '' ||
      email === '' ||
      password === '' ||
      confirm_password === ''
    ) {
      msg += 'Todos os campos precisam ser preenchidos!\n';
      setErrorBox(true);
      error = true;
    }
    if (!(password === confirm_password)) {
      msg += 'As senhas digitadas precisam ser iguais!\n';
      setErrorBox(true);
      error = true;
    }
    if (password.length < 4) {
      msg += 'As senhas digitadas precisam ter pelo menos 4 caracteres!\n';
      setErrorBox(true);
      error = true;
    }

    setErrorMsg(msg);
    return error;
  }

  function handleRegistration() {
    const error = validate();
    if (!error) {
      const user: UserAuth = {
        name: name,
        email: email,
        password: password,
      };
      const response = registration(user);
      if (response.status === 409) {
        setErrorMsg(response.msg);
        return;
      }
      setSucessBox(true);
      clearData();
    }
  }

  function clearData() {
    setEmail('');
    setName('');
    setConfirm_password('');
    setPassword('');
  }

  return (
    <View style={styles.container}>
      {errorBox ? (
        <View style={styles.erroBox}>
          <Label fontSize={17} fontWeight="900" color="black">
            {errorMsg}
          </Label>
        </View>
      ) : null}
      {sucessBox ? (
        <View style={styles.sucessBox}>
          <Label fontSize={17} fontWeight="900" color="black">
            Usuário criado com sucesso!
          </Label>
        </View>
      ) : null}
      <Spacer spaceSize={10} />
      <Label fontSize={22} fontWeight="bold" color={Colors.secundaryColor}>
        Nome
      </Label>
      <Input.Root>
        <Input.Icon>
          <User size={25} color={Colors.primaryColor} />
        </Input.Icon>
        <Input.Input
          placeholder="Digite seu nome!"
          value={name}
          onChangeText={setName}
          placeholderTextColor={Colors.primaryColor}
        />
      </Input.Root>
      <Spacer spaceSize={10} />
      <Label fontSize={22} fontWeight="bold" color={Colors.secundaryColor}>
        Email
      </Label>
      <Input.Root>
        <Input.Icon>
          <Envelope size={25} color={Colors.primaryColor} />
        </Input.Icon>
        <Input.Input
          placeholder="Digite seu email!"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={Colors.primaryColor}
        />
      </Input.Root>
      <Spacer spaceSize={10} />
      <Label fontSize={22} fontWeight="bold" color={Colors.secundaryColor}>
        Senha
      </Label>
      <Input.Root>
        <Input.Icon>
          <Lock size={25} color={Colors.primaryColor} />
        </Input.Icon>
        <Input.Input
          placeholder="Digite sua senha!"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={Colors.primaryColor}
          secureTextEntry={true}
        />
      </Input.Root>
      <Spacer spaceSize={10} />
      <Label fontSize={22} fontWeight="bold" color={Colors.secundaryColor}>
        Confirmação de Senha
      </Label>
      <Input.Root>
        <Input.Icon>
          <Lock size={25} color={Colors.primaryColor} />
        </Input.Icon>
        <Input.Input
          placeholder="Confirme sua senha!"
          value={confirm_password}
          onChangeText={setConfirm_password}
          placeholderTextColor={Colors.primaryColor}
          secureTextEntry={true}
        />
      </Input.Root>
      <Spacer spaceSize={30} />
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Button.Root style={styles.button} onPress={handleRegistration}>
          <Button.Text style={styles.textButton}>Cadastrar</Button.Text>
        </Button.Root>
        <Spacer spaceSize={3} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <Label fontSize={13} fontWeight="900" color={Colors.secundaryColor}>
            Já possui uma conta? Clique aqui e faça o login!
          </Label>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '90%',
    margin: 12,
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.primaryColor,
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  textButton: {
    fontSize: 15,
    fontWeight: '900',
    color: 'black',
  },
  erroBox: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#bd0707e1',
    padding: 6,
  },
  sucessBox: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#079c07e4',
    padding: 6,
  },
});
