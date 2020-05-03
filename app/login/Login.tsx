import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image } from 'react-native';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Feed: { sort: 'latest' | 'top' } | undefined;
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
  imageBg:{
    backgroundColor: '#ccc',
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  mainContainer: {
    // flex:1,
    width: 300,
    height: 310,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: "center",
    padding: 10
  },
  smallContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    height: "auto",
    // backgroundColor:'#ccc'
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
  rememberBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  },
  signUp: {
    marginTop: 20,
    alignItems: 'center'
  },
  SignUpText: {
    textAlign: "center"
  }
});

export function LoginScreen({ route, navigation }: Props) {
  return (
    <View style={styles.background}>
      <Image
        style={styles.imageBg}
        source={require('../../resources/purple-bg.jpg')}
      />
      <View style={styles.mainContainer}>
        <View style={styles.nav}>
          <View style={styles.button} />
          <Text style={styles.titleText}>Sign In</Text>
          {/* <TouchableOpacity onPress={this.closeWindow}>
          <Image
            style={styles.button}
            source={require('../../resources/close.png')}
          /> 
        </TouchableOpacity> */}
        </View>
        <View style={styles.line}></View>
        <View style={styles.smallContainer}>
          <TextInput underlineColorAndroid="#b131d8" placeholder="Please input your user name" />
          <TextInput underlineColorAndroid="#b131d8" placeholder="Please input your password" />
          <View style={styles.rememberBox}>
            <Text style={{ color: "#ccc" }}>Auto Login</Text>
            {/* <Switch
            onValueChange={(value) => this.setState({ autoLogin: value })}
            style={{ marginBottom: 10, marginTop: 10 }}
            value={this.state.autoLogin} /> */}
          </View>
          <View style={styles.gap}></View>
          <Button color='#b131d8' onPress={() => navigation.navigate('Home')} title="Sign In" />
          <TouchableOpacity style={styles.signUp}>
            <Text>Don't have an account?Sign Up Here!</Text>
          </TouchableOpacity>
          <Text style={styles.resetText}>Reset your password</Text>
        </View>
      </View>
    </View>
  );
}

