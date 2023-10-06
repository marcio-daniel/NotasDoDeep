import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Input} from '../CustomInput/CustomInput';
import {Envelope, Lock} from 'phosphor-react-native';
import {Colors} from '../../assets/Colors';
import Label from '../Label/Label';
import {Button} from '../Button/Button';
import Spacer from '../Spacer/Spacer';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {
  User,
  UserAuth,
  UserState,
  signin,
} from '../../state/features/user/user-slice';
import {login} from '../../actions/user';
import {useDispatch} from 'react-redux';

export default function LoginForm() {
  const navigation = useNavigation();
  const [email, setEmail] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [errorBox, setErrorBox] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch();

  async function handleLogin() {
    setErrorMsg('');
    setErrorBox(false);
    const auth: UserAuth = {
      email: email,
      password: password,
    };
    const response = await login(auth);
    if (response?.status === 403) {
      setErrorBox(true);
      setErrorMsg(response.msg);
    }
    if (response?.status === 200) {
      const token = response.data.token;
      const currentUser: User = response.data.user;
      const userState: UserState = {
        token: token,
        currentUser: currentUser,
      };
      dispatch(signin(userState));
      navigation.navigate('Home');
    }
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
      <Spacer spaceSize={30} />
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Button.Root style={styles.button} onPress={handleLogin}>
          <Button.Text style={styles.textButton}>Entrar</Button.Text>
        </Button.Root>
        <Spacer spaceSize={3} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Registration');
          }}>
          <Label fontSize={13} fontWeight="900" color={Colors.secundaryColor}>
            Não possui conta? Clique aqui e cadastre-se!
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
    height: 35,
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
});
