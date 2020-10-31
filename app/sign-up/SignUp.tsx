import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import SqlDatabase from '../shared-service/Sql-database';

type RootStackParamList = {
  Home: object;
  Login: object;
  Profile: { userId: string };
  Feed: { sort: 'latest' | 'top' } | undefined;
  ShoppingList: object;
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

type Props = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageBg: {
    backgroundColor: '#ccc',
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  mainContainer: {
    width: 300,
    height: 260,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: "center",
    padding: 10
  },
  label: {
    paddingLeft: 6
  },
  textInput: {
    height: 40,
    paddingLeft: 6
  },
  smallContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    height: "auto"
  },
  line: {
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc'

  },
  gap: {
    marginBottom: 10,
  },
  loginCheck: {
    borderRadius: 10
  },
  resetText: {
    marginTop: 10,
    textAlign: "center",
    color: "white",
    fontWeight: "800",
    fontSize: 15
  },
  button: {
    width: 20,
    height: 20,
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 10
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export function SignUpScreen({ route, navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const backToLogin = () => {
    navigation.navigate("Login", {})
  };
  const signUp = async () => {
    const newUserId = await SqlDatabase.createNewUser(username, password);
    navigation.navigate("ShoppingList", { userId: newUserId })
  }

  React.useEffect(() => {
    SqlDatabase.initData();
  }, []);
  return (
    <View style={styles.background}>
      <Image
        style={styles.imageBg}
        source={require('../../resources/food.jpg')}
      />
      <View style={styles.mainContainer}>
        <View style={styles.nav}>
          <View style={styles.button} />
          <Text style={styles.titleText}>Sign Up</Text>
          <TouchableOpacity onPress={backToLogin}>
            <Image
              style={styles.button}
              source={require('../../resources/close.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.line}></View>
        <View style={styles.smallContainer}>
          <Text>Username</Text>
          <TextInput
            underlineColorAndroid="#009688"
            style={styles.textInput}
            placeholder="Please input your user name"
            onChangeText={username => setUsername(username)} />
          <Text>Password</Text>
          <TextInput
            underlineColorAndroid="#009688"
            style={styles.textInput}
            placeholder="Please input your password"
            onChangeText={password => setPassword(password)} />
          <View style={styles.gap}></View>
          <Button color='#009688' onPress={signUp} title="Sign Up" /> 
        </View>
      </View>
    </View>
  );
}

