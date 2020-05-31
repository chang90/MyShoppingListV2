import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image, Switch } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import SqlDatabase from '../shared-service/Sql-database';
const db = SqlDatabase.getConnection();

type RootStackParamList = {
  Home: object;
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
  rememberBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  autoLoginLabel: {
    color: '#ccc',
    marginRight: 5
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(true);

  const func = (value: boolean) => setAutoLogin(value);
  const closeWindow = () => {
    navigation.navigate("ShoppingList", { userId: 1 })
  };
  React.useEffect(() => {
    db.transaction(tx => {

      // Clean up old DB data
      // console.log('drop table')
      // tx.executeSql("DROP TABLE users;");
      // tx.executeSql("DROP TABLE shopping_lists;");
      // tx.executeSql("DROP TABLE tags;");
      // tx.executeSql("DROP TABLE items;",[], 
      //   function(error){
      //     console.log("item table Could not delete");
      //   }
      // );
      // tx.executeSql("DROP TABLE item_tags;");
      // tx.executeSql("PRAGMA foreign_keys = ON;")

      // Init database and set up default value
      // Create Users table
      tx.executeSql(
        "create table if not exists users (id integer primary key not null, user_name text, create_date text, update_date text, password text, connect_to_cloud boolean);");

      // Create Shopping Lists table
      tx.executeSql(
        "create table if not exists shopping_lists (id integer primary key not null, shopping_list_name text, created_date text, updated_date text, completed_date text, user_id integer);");

      // Create Tags table
      tx.executeSql(
        "create table if not exists tags (id integer primary key not null, tag_name text, created_date text, updated_date text, default_tag boolean, color string);");

      // Create Items table
      tx.executeSql(
        "create table if not exists items (id integer primary key not null, item_name text, create_date text, update_date text, expiry_date text, notes text, status number not null, shoppinglist_id integer not null);");

      const currentDate = new Date().toUTCString();
      tx.executeSql(`insert into items (item_name, create_date, update_date, status, shoppinglist_id) values ('loginpage', '${currentDate}', '${currentDate}', ${1}, ${1})`, [], error =>
        console.log(error)
      );

      tx.executeSql("select * from items", [], (_, { rows }) => {
        console.log('items: ',rows);
    });
      // Create Item Tag matching table
      tx.executeSql(
        "create table if not exists item_tags (id integer primary key not null, item_id integer, tag_id integer);");

      tx.executeSql("select * from users where id = 1", [], (_, { rows }) => {
        console.log('users', rows)
        if (rows.length == 0) {
          // create default user
          const currentDate = new Date().toUTCString();
          tx.executeSql(`insert into users (user_name, create_date, update_date, connect_to_cloud) values ('default', '${currentDate}','${currentDate}',0);`);
        }
      })
      
    });
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
          <Text style={styles.titleText}>Sign In</Text>
          <TouchableOpacity onPress={closeWindow}>
            <Image
              style={styles.button}
              source={require('../../resources/close.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.line}></View>
        <View style={styles.smallContainer}>
          <Text>Username</Text>
          <TextInput underlineColorAndroid="#009688" placeholder="Please input your user name" onChangeText={username => setUsername(username)} />
          <Text>Password</Text>
          <TextInput underlineColorAndroid="#009688" placeholder="Please input your password" onChangeText={password => setPassword(password)} />
          <View style={styles.rememberBox}>
            <Text style={styles.autoLoginLabel}>Auto Login</Text>
            <Switch
              onValueChange={func}
              style={{ marginBottom: 10, marginTop: 10 }}
              value={autoLogin} />
          </View>
          <View style={styles.gap}></View>
          <Button color='#009688' onPress={() => navigation.navigate('Home')} title="Sign In" />
          <TouchableOpacity style={styles.signUp}>
            <Text>Don't have an account?Sign Up Here!</Text>
          </TouchableOpacity>
          <Text style={styles.resetText}>Reset your password</Text>
        </View>
      </View>
    </View>
  );
}

